'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

/**
 * Hook to monitor network connectivity status
 * Shows toast notifications when connection is lost/restored
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOffline: false,
  });

  const handleOnline = useCallback(() => {
    setStatus((prev) => {
      // Only show toast if we were previously offline
      if (!prev.isOnline || prev.wasOffline) {
        toast.success('Connection restored', {
          description: 'You are back online.',
          duration: 3000,
        });
      }
      return { isOnline: true, wasOffline: false };
    });
  }, []);

  const handleOffline = useCallback(() => {
    setStatus({ isOnline: false, wasOffline: true });
    toast.error('Connection lost', {
      description: 'Please check your internet connection.',
      duration: Infinity, // Keep showing until online
      id: 'offline-toast', // Prevent duplicates
    });
  }, []);

  useEffect(() => {
    // Set initial state
    if (typeof navigator !== 'undefined') {
      setStatus({
        isOnline: navigator.onLine,
        wasOffline: !navigator.onLine,
      });
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return status;
}

/**
 * Hook to check if online before performing an action
 * Returns a wrapper function that checks network status first
 */
export function useOnlineAction() {
  const { isOnline } = useNetworkStatus();

  const executeIfOnline = useCallback(
    <T>(action: () => Promise<T>): Promise<T> => {
      if (!isOnline) {
        toast.error('No internet connection', {
          description: 'Please check your connection and try again.',
        });
        return Promise.reject(new Error('No internet connection'));
      }
      return action();
    },
    [isOnline]
  );

  return { isOnline, executeIfOnline };
}
