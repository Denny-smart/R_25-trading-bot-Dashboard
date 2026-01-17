import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Scan, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccessPortalProps {
    onAuth: () => Promise<void>;
    isLoading: boolean;
}

export function AccessPortal({ onAuth, isLoading }: AccessPortalProps) {
    const [scanState, setScanState] = useState<'idle' | 'scanning' | 'granted' | 'denied'>('idle');

    const handleAccessRequest = async () => {
        setScanState('scanning');

        // Simulate biometric scan delay before actual auth
        setTimeout(async () => {
            try {
                await onAuth();
                // If onAuth doesn't throw, we assume success or redirect happens
                // setScanState('granted'); // Usually redirect happens fast
            } catch (e) {
                setScanState('denied');
                setTimeout(() => setScanState('idle'), 3000);
            }
        }, 1500);
    };

    return (
        <div className="relative w-full max-w-md p-8 overflow-hidden rounded-xl bg-black/80 border border-primary/20 backdrop-blur-xl shadow-[0_0_50px_rgba(0,240,255,0.1)]">
            {/* Decorative Corner Lines */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />

            {/* Content */}
            <div className="flex flex-col items-center text-center z-10 relative">
                <div className="mb-6 relative">
                    <AnimatePresence mode="wait">
                        {scanState === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 text-primary"
                            >
                                <Fingerprint className="w-10 h-10" />
                            </motion.div>
                        )}
                        {scanState === 'scanning' && (
                            <motion.div
                                key="scanning"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.2, opacity: 0 }}
                                className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center relative"
                            >
                                <div className="absolute inset-0 rounded-full border border-primary animate-ping" />
                                <Scan className="w-10 h-10 text-primary animate-pulse" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <h2 className="text-xl font-bold text-white mb-2 tracking-widest uppercase">
                    {scanState === 'scanning' ? 'Verifying Credentials...' : 'Secure Access Point'}
                </h2>

                <p className="text-sm text-primary/60 font-mono mb-8">
                    {scanState === 'scanning' ? 'Biometric handshake tailored...' : 'Identity verification through MaliBot Protocol required.'}
                </p>

                <Button
                    onClick={handleAccessRequest}
                    disabled={isLoading || scanState === 'scanning'}
                    className={`w-full h-14 text-lg font-bold tracking-wider rounded-none relative overflow-hidden transition-all duration-300 ${scanState === 'denied' ? 'bg-destructive hover:bg-destructive text-white' : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50'
                        }`}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {scanState === 'scanning' && <span className="animate-spin">⟳</span>}
                        {scanState === 'idle' && 'INITIALIZE SEQUENCE'}
                        {scanState === 'denied' && (
                            <>
                                <AlertCircle className="w-5 h-5" /> ACCESS DENIED
                            </>
                        )}
                        {scanState === 'granted' && (
                            <>
                                <ShieldCheck className="w-5 h-5" /> ACCESS GRANTED
                            </>
                        )}
                    </span>
                    {scanState === 'idle' && (
                        <div className="absolute inset-0 bg-primary/10 -translate-x-full hover:translate-x-0 transition-transform duration-500" />
                    )}
                </Button>

                <div className="mt-6 flex flex-col gap-1 text-[10px] text-muted-foreground font-mono uppercase">
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                        Connection Secured (TLS 1.3)
                    </span>
                    <span>Access Subject to Admin Approval</span>
                </div>
            </div>
        </div>
    );
}
