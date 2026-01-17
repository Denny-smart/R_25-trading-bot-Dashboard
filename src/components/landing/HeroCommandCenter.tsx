import { motion } from 'framer-motion';
import { Activity, Shield, TrendingUp, Cpu, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroCommandCenter() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-background to-background" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          SYSTEM ONLINE // V2.5.0
        </motion.div>

        {/* Hero Text */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
        >
          Autonomous Trading. <br />
          <span className="text-primary text-glow">Real-Time Intelligence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12"
        >
          Execute institutional-grade strategies with the MaliBot Command Interface. 
          Reserved for approved operators only.
        </motion.p>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-none clip-path-polygon relative group overflow-hidden"
            asChild
          >
            <Link to="/login">
              <span className="relative z-10 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Validating Access Protocol...
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </Button>
          
          <span className="text-xs text-muted-foreground font-mono">
           ⚠ ACCESS RESTRICTED TO AUTHORIZED PERSONNEL
          </span>
        </motion.div>
      </div>
      
      {/* Holographic Dashboard Preview (Static representation for now, or animated SVGs) */}
      <div className="absolute bottom-0 w-full h-[30vh] md:h-[40vh] bg-gradient-to-t from-primary/5 to-transparent opacity-50 pointer-events-none" />
    </section>
  );
}
