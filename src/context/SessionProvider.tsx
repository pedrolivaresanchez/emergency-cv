'use client';

import { User } from '@supabase/auth-js';
import { useSessionManager } from '@/helpers/hooks';
import React, { createContext, ReactNode, useContext } from 'react';

const SessionContext = createContext<UserSession>({ user: null });

type UserSession = { user: User } | { user: null };

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { session } = useSessionManager();

  return <SessionContext.Provider value={{ user: session }}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
