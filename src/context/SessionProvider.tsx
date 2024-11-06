'use client';
import React, { createContext, ReactNode, useContext } from 'react';
import { User } from '@supabase/auth-js';

const SessionContext = createContext<UserSession>({ user: null });

type UserSession = { user: User } | { user: null };

type SessionProviderProps = {
  children: ReactNode;
  session: UserSession;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({ children, session }) => {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
