import { useEffect, useRef, useState } from 'react';
import { debounce } from 'es-toolkit';

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

export function useDebouncedValue<T>(value: T, delay: number, options?: { signal: AbortSignal }): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const debounced = debounce(
      () => {
        setDebouncedValue(value);
      },
      delay,
      options,
    );
    debounced();

    // Return a cleanup function that will be called every time ...
    // ... useEffect is re-called. useEffect will only be re-called ...
    // ... if value changes (see the inputs array below).
    // This is how we prevent debouncedValue from changing if value is ...
    // ... changed within the delay period. Timeout gets cleared and restarted.
    // To put it in context, if the user is typing within our app's ...
    // ... search box, we don't want the debouncedValue to update until ...
    // ... they've stopped typing for more than 500ms.
    return () => {
      debounced.cancel();
    };
  }, [delay, options, value]); // ... need to be able to change that dynamically. // You could also add the "delay" var to inputs array if you ... // Only re-call effect if value changes

  return debouncedValue;
}
