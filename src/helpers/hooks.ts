import { jwtDecode } from 'jwt-decode';
import { exchangeCodeForSession, refreshToken } from '@/lib/actions';
import { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/auth-js/src/lib/types';

type CallbackFunction<T extends any[]> = (...args: T) => void;

export function useThrottledFunction<T extends any[]>(callback: CallbackFunction<T>, delayMs: number) {
  const lastExecuted = useRef(0);

  const throttledFunction = (...args: T) => {
    const now = Date.now();

    if (now - lastExecuted.current >= delayMs) {
      callback(...args);
      lastExecuted.current = now;
    }
  };

  return throttledFunction;
}

export function useDebouncedFunction<T extends any[]>(callback: CallbackFunction<T>, delayMs: number) {
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = (...args: T) => {
    // Clear previous timer, if any
    if (timerId.current) clearTimeout(timerId.current);

    // Set up a new timer
    timerId.current = setTimeout(() => {
      callback(...args);
    }, delayMs);
  };

  // Clear the timeout if the component unmounts
  useEffect(() => {
    return () => {
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, []);

  return debouncedFunction;
}

export function useSessionManager() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [session, setSession] = useState<User | null>(null);

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

  const refreshTokenIfNeeded = async () => {
    const { accessToken, refreshToken: currentRefreshToken } = getTokens();

    if (!isRefreshing && isTokenExpired(accessToken) && currentRefreshToken) {
      setIsRefreshing(true);

      try {
        const response = await refreshToken(currentRefreshToken);

        if (response.data?.session) {
          localStorage.setItem('accessToken', response.data.session.access_token);
          localStorage.setItem('refreshToken', response.data.session.refresh_token);

          setSession(response.data.user);

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

          setSession(session.data.user);
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
