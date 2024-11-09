'use client';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/auth-js';
import { supabase } from '@/lib/supabase/client';

const SessionContext = createContext<UserSession>({ user: null, token: null });

type UserSession = { user: User | null; token: string | null };

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState<UserSession>(() => ({ user: null, token: null }));

  useEffect(() => {
    // Fetch initial session
    const fetchSession = async () => {
      const { data } = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();

      setSession({ user: data.user, token: session?.data?.session?.access_token ?? null });
    };
    fetchSession();

    // Subscribe to session changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(() => ({ user: session?.user ?? null, token: session?.access_token ?? null })); // Update the session in state
    });

    // Clean up listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
