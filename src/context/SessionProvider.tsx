'use client';
import React, { createContext, ReactNode, useContext } from 'react';
import { Session } from '@supabase/supabase-js';

const SessionContext = createContext<Session | null>(null);

type SessionProviderProps = {
  children: ReactNode;
  session: Session | null;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children, session }) => {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
