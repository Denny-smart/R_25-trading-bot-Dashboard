import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AccessPortal } from '@/components/landing/AccessPortal';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle, isAuthenticated, isApproved, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isApproved) {
        navigate('/dashboard');
      } else {
        navigate('/pending-approval');
      }
    }
  }, [isAuthenticated, isApproved, authLoading, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: 'Access Denied',
        description: error.message || 'Security Handshake Failed',
        variant: 'destructive',
      });
      setIsLoading(false);
      throw error; // Propagate to AccessPortal for visual feedback
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary font-mono text-sm tracking-widest animate-pulse">ESTABLISHING UPLINK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Cyber Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />

      {/* Scanlines Overlay */}
      <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo / Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black/50 border border-primary/20 text-primary mb-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <Bot className="w-10 h-10 animate-pulse-slow" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">MaliBot</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-primary/60 font-mono text-xs tracking-widest">SYSTEM V2.5 ONLINE</span>
          </div>
        </div>

        {/* Access Portal */}
        <div className="w-full animate-slide-in">
          <AccessPortal onAuth={handleGoogleSignIn} isLoading={isLoading} />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 font-mono">
          <Link to="/" className="text-primary hover:text-white transition-colors hover:underline decoration-primary">
            [ RETURN TO COMMAND ]
          </Link>
        </p>
      </div>
    </div>
  );
}
