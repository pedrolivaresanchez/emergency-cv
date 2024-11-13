'use client';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/auth-js';
import { Subscription } from '@supabase/supabase-js';
import { onAuthStateChange, getSessionUser } from '@/lib/actions';

const SessionContext = createContext<UserSession>({ user: null });

type UserSession = { user: User } | { user: null };

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState<UserSession>(() => ({ user: null }));
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    // Fetch initial session
    const fetchSession = async () => {
      const { data } = await getSessionUser();
      setSession(data);

      const { data: authListener } = await onAuthStateChange((event, session) => {
        setSession(() => ({ user: session?.user ?? null })); // Update the session in state
      });
      setSubscription(authListener?.subscription);
    };
    fetchSession();

    // Subscribe to session changes

    // Clean up listener on component unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
