'use client';
import { createContext, useContext } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children, session }) => {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
