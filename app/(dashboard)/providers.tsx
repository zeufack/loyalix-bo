'use client';

import { Suspense } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NetworkStatusProvider } from '@/components/network-status-provider';
import { NavigationProgress } from '@/components/navigation-progress';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <NetworkStatusProvider>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </NetworkStatusProvider>
    </TooltipProvider>
  );
}
