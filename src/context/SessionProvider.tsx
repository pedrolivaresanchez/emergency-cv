'use client';

import { User } from '@supabase/auth-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { exchangeCodeForSession, getSessionUser, refreshToken } from '@/lib/actions';
import { jwtDecode } from 'jwt-decode';

type Session = {
  user: User | null;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
};

const SessionContext = createContext<Session>({ user: null, setSession: () => {} });

export type UserSession = { user: User } | { user: null };

type SessionProviderProps = {
  children: ReactNode;
};

function useSessionManager() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [session, setSession] = useState<UserSession>({ user: null });

  const getTokens = () => {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  };

  const isTokenExpired = (token: string | null) => {
    if (!token) return true;

    try {
      const decoded = jwtDecode<User & { exp: number }>(token);
      // Check if token will expire in the next 15 minutes
      const expirationBuffer = 15 * 60; // 15 minutes in seconds
      return decoded.exp < Date.now() / 1000 + expirationBuffer;
    } catch {
      return true;
    }
  };

  const refreshSession = async () => {
    const { data } = await getSessionUser();

    if (data !== null) {
      setSession(data);
    }
  };

  const refreshTokenIfNeeded = async () => {
    const { accessToken, refreshToken: currentRefreshToken } = getTokens();

    if (!isRefreshing && isTokenExpired(accessToken) && currentRefreshToken) {
      setIsRefreshing(true);

      try {
        const response = await refreshToken(currentRefreshToken);

        if (response.data?.session) {
          localStorage.setItem('accessToken', response.data.session.access_token);
          localStorage.setItem('refreshToken', response.data.session.refresh_token);

          setSession(response.data);

          return true;
        }
      } catch (error) {
        // Clear tokens if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return false;
      } finally {
        setIsRefreshing(false);
      }
    }
    return !isTokenExpired(accessToken);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    refreshTokenIfNeeded();

    const checkInterval = setInterval(refreshTokenIfNeeded, 60 * 1000); // Check every minute
    return () => clearInterval(checkInterval);
  }, []);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { accessToken } = getTokens();
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (code && isTokenExpired(accessToken)) {
        const session = await exchangeCodeForSession(code);

        const accessToken = session.data.session?.access_token;
        const refreshToken = session.data.session?.refresh_token;

        if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          setSession(session.data);
        }
      }
    };

    handleOAuthCallback();
  }, []);

  return {
    session,
    setSession,
    getTokens,
    isTokenExpired,
    refreshTokenIfNeeded,
  };
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { session, setSession } = useSessionManager();
  return <SessionContext.Provider value={{ user: session.user, setSession }}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
