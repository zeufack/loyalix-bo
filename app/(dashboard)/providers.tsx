'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { NetworkStatusProvider } from '@/components/network-status-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <NetworkStatusProvider>
        {children}
      </NetworkStatusProvider>
    </TooltipProvider>
  );
}
