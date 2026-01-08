
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { wsService } from '@/services/websocket';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
    link?: string;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const { user, role } = useAuth();

    const addNotification = useCallback((data: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: AppNotification = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            read: false,
            ...data,
        };

        setNotifications((prev) => [newNotification, ...prev]);

        // Also show a toast for immediate visibility
        toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.type === 'error' ? 'destructive' : 'default',
        });
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    // Subscribe to WebSocket events (Trade Signals & Results) - Visible to ALL users
    useEffect(() => {
        const handleNewTrade = (data: any) => {
            addNotification({
                title: 'New Trade Signal',
                message: `${data.symbol} ${data.direction} at ${data.entry_price}`,
                type: 'info',
            });
        };

        const handleTradeClosed = (data: any) => {
            const isWin = data.profit > 0;
            addNotification({
                title: isWin ? 'Trade Won' : 'Trade Lost',
                message: `${data.symbol} closed. Profit: ${data.profit}`,
                type: isWin ? 'success' : 'error',
            });
        };

        wsService.on('new_trade', handleNewTrade);
        wsService.on('trade_closed', handleTradeClosed);

        return () => {
            wsService.off('new_trade', handleNewTrade);
            wsService.off('trade_closed', handleTradeClosed);
        };
    }, [addNotification]);

    // Subscribe to New User Signups - Visible ONLY to Admins
    useEffect(() => {
        if (role !== 'admin') return;

        // Check for existing pending users on mount
        const fetchPendingUsers = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('is_approved', false);

            if (data) {
                data.forEach((profile) => {
                    // We avoid adding duplicates if possible, but for simple state, we might just add them if not present.
                    // Ideally, this fetch should just populate a "Pending Approvals" list, but mapping to notifications is also fine.
                    // For now, let's just listen for NEW ones to avoid spamming the notification list on every refresh with old pending users.
                    // Or we can add a persistent notification saying "X users waiting for approval".
                });
                if (data.length > 0) {
                    addNotification({
                        title: 'Pending Approvals',
                        message: `${data.length} users are waiting for approval.`,
                        type: 'warning',
                        link: '/users'
                    })
                }
            }
        };

        fetchPendingUsers();

        const channel = supabase
            .channel('public:profiles')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'profiles',
                },
                (payload) => {
                    addNotification({
                        title: 'New User Signup',
                        message: `New user registered: ${payload.new.email}`,
                        type: 'warning',
                        link: '/users',
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [role, addNotification]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
