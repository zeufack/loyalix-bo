'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { ReactNode } from 'react';

interface NetworkStatusProviderProps {
  children: ReactNode;
}

/**
 * Provider component that monitors network status and shows toast notifications
 * when the connection is lost or restored.
 */
export function NetworkStatusProvider({ children }: NetworkStatusProviderProps) {
  // This hook handles all the network monitoring and toast notifications
  useNetworkStatus();

  return <>{children}</>;
}
