'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

const CHANNEL_NAME = 'career_store_sync';
const LOCAL_EVENT = 'store-sync';

// Module-level event bus for intra-tab synchronization (works in jsdom and all browsers)
const localBus = typeof window !== 'undefined' ? new EventTarget() : null;

export function useStore<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item) return JSON.parse(item);
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const bcRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Intra-tab sync via module-level EventTarget
    const handleLocal = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.key === key) {
        setStoredValue(detail.value);
      }
    };
    localBus?.addEventListener(LOCAL_EVENT, handleLocal);

    // Cross-tab sync via BroadcastChannel
    if ('BroadcastChannel' in window) {
      bcRef.current = new BroadcastChannel(CHANNEL_NAME);
      bcRef.current.onmessage = (event) => {
        if (event.data?.key === key) {
          setStoredValue(event.data.value);
        }
      };
    }

    // Cross-tab fallback via storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // ignore parse error
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      localBus?.removeEventListener(LOCAL_EVENT, handleLocal);
      bcRef.current?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      let base = prev;
      if (typeof window !== 'undefined') {
        try {
          const latest = window.localStorage.getItem(key);
          if (latest !== null) {
            base = JSON.parse(latest);
          }
        } catch {
          // ignore parse error, fall back to prev
        }
      }
      const next = value instanceof Function ? value(base) : value;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(next));

        // Notify other hooks in the same tab
        localBus?.dispatchEvent(
          new CustomEvent(LOCAL_EVENT, { detail: { key, value: next } })
        );

        // Notify other tabs
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel(CHANNEL_NAME);
          bc.postMessage({ key, value: next });
          bc.close();
        }
      }
      return next;
    });
  }, [key]);

  return [storedValue, setValue];
}
