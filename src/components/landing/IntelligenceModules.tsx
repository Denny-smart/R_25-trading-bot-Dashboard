import { motion } from 'framer-motion';
import { Activity, Shield, Cpu, Zap, BarChart3, Lock } from 'lucide-react';

const modules = [
    {
        title: "Real-Time Monitoring",
        icon: Activity,
        desc: "Live pulse tracking of all active positions and market signals.",
        color: "text-primary"
    },
    {
        title: "Neural Performance",
        icon: Cpu,
        desc: "Adaptive algorithms optimization per market condition.",
        color: "text-secondary"
    },
    {
        title: "Risk Containment",
        icon: Shield,
        desc: "Automated drawdown protection and capital preservation protocols.",
        color: "text-accent"
    },
    {
        title: "Admin Oversight",
        icon: Lock,
        desc: "Human-in-the-loop verification for high-stakes execution.",
        color: "text-warning"
    }
];

export function IntelligenceModules() {
    return (
        <section className="py-24 bg-background relative z-10">
            <div className="container px-4 md:px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                        System Modules
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Operational capabilities of the MaliBot ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((mod, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative bg-card border border-white/5 p-6 rounded-none overflow-hidden hover:border-primary/50 transition-colors duration-500"
                        >
                            {/* Scanline effect on hover */}
                            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none" />

                            <div className={`mb-4 ${mod.color} group-hover:animate-pulse`}>
                                <mod.icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-2">{mod.title}</h3>
                            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                {mod.desc}
                            </p>

                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-primary transition-colors" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-primary transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
