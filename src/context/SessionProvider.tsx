'use client';

import { User } from '@supabase/auth-js';
import { useSessionManager } from '@/helpers/hooks';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getSessionUser } from '@/lib/actions';

const SessionContext = createContext<UserSession>({ user: null });

export type UserSession = { user: User } | { user: null };

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  //const [session, setSession] = useState<UserSession>(() => ({ user: null }));
  const { session } = useSessionManager();
  // useEffect(() => {
  //   const fetchSession = async () => {
  //     const { data } = await getSessionUser();
  //
  //     if (data !== null) {
  //       setSession(data);
  //     }
  //   };
  //   fetchSession();
  // }, []);

  // useEffect(() => {
  //   setSession(manager.session);
  //   debugger;
  // }, [manager.session]);
  
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
