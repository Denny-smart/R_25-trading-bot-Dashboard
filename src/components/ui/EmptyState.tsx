import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
    children?: ReactNode;
    variant?: 'default' | 'small';
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    children,
    variant = 'default'
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-border/50 bg-card/50",
                variant === 'small' ? "py-6 px-4" : "py-12 px-4",
                className
            )}
        >
            {Icon && (
                <div className="bg-primary/10 p-4 rounded-full mb-4 animate-in zoom-in-50 duration-500">
                    <Icon className="w-8 h-8 text-primary" />
                </div>
            )}

            <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
            </h3>

            {description && (
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    {description}
                </p>
            )}

            {children}

            {action && (
                <Button onClick={action.onClick} className="mt-2">
                    {action.label}
                </Button>
            )}
        </div>
    );
}
