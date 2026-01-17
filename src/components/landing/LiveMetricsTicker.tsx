import { motion } from 'framer-motion';

const metrics = [
    { label: "Win Rate", value: "88.4%", active: true },
    { label: "Daily Volume", value: "$142K", active: false },
    { label: "Active Bots", value: "2", active: true },
    { label: "System Uptime", value: "99.99%", active: true },
];

export function LiveMetricsTicker() {
    return (
        <section className="py-12 border-y border-white/5 bg-black/40 backdrop-blur-sm">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {metrics.map((metric, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                                {metric.label}
                            </span>
                            <div className="flex items-center gap-2">
                                {metric.active && (
                                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#00FF9D]" />
                                )}
                                <span className="text-3xl font-bold font-mono text-foreground tracking-tight">
                                    {metric.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
