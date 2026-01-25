'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    setProgress(0);

    // Animate progress
    const steps = [
      { delay: 0, value: 20 },
      { delay: 100, value: 40 },
      { delay: 200, value: 60 },
      { delay: 400, value: 80 },
    ];

    const timers: NodeJS.Timeout[] = [];
    steps.forEach(({ delay, value }) => {
      timers.push(setTimeout(() => setProgress(value), delay));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const completeNavigation = useCallback(() => {
    setProgress(100);
    const timer = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Track URL changes
    const cleanup = startNavigation();

    // Complete after a short delay (content loaded)
    const completeTimer = setTimeout(completeNavigation, 300);

    return () => {
      cleanup();
      clearTimeout(completeTimer);
    };
  }, [pathname, searchParams, startNavigation, completeNavigation]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-primary/10">
      <div
        className="h-full bg-primary transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: progress > 0 ? '0 0 10px var(--primary), 0 0 5px var(--primary)' : 'none'
        }}
      />
    </div>
  );
}
