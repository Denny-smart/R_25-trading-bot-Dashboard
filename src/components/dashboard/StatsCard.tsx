import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

// Animated Counter Component
function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    // Format based on magnitude (simple heuristic)
    current.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2
    })
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function StatsCard({ title, value, change, trend = 'neutral', icon, className }: StatsCardProps) {
  // Determine if value is numeric for animation
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  const isNumeric = !isNaN(numericValue);

  // Extract prefix/suffix if string
  const prefix = typeof value === 'string' && value.includes('$') ? '$' : '';
  const suffix = typeof value === 'string' && value.includes('%') ? '%' : '';

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn("glass-card p-4 rounded-xl flex flex-col justify-between h-full group", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</h3>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold font-mono tracking-tight text-foreground flex items-baseline">
          {prefix}
          {isNumeric ? (
            <AnimatedCounter value={numericValue} />
          ) : (
            value
          )}
          {suffix}
        </div>

        {change && (
          <div className={cn(
            "flex items-center text-xs font-medium",
            trend === 'up' && "text-success",
            trend === 'down' && "text-destructive",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {trend === 'up' && <ArrowUp className="w-3 h-3 mr-1" />}
            {trend === 'down' && <ArrowDown className="w-3 h-3 mr-1" />}
            {change}
            <span className="ml-1 text-muted-foreground opacity-60">vs last period</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
