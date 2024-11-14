import { jwtDecode } from 'jwt-decode';
import { exchangeCodeForSession, refreshToken, getSessionUser } from '@/lib/actions';
import { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/auth-js/src/lib/types';
import { UserSession } from '@/context/SessionProvider';

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
