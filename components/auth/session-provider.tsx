'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';

function SessionExpirationHandler({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      toast.error('Session expired. Please sign in again.');
      signOut({ callbackUrl: '/login' });
    }
  }, [session?.error]);

  // Check token expiration periodically
  useEffect(() => {
    if (!session?.accessTokenExpires) return;

    const checkExpiration = () => {
      const now = Date.now();
      const expiresAt = session.accessTokenExpires as number;
      const timeUntilExpiry = expiresAt - now;

      // If token expires in less than 1 minute, show warning
      if (timeUntilExpiry > 0 && timeUntilExpiry < 60 * 1000) {
        toast.warning('Your session will expire soon. Please save your work.');
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkExpiration, 30 * 1000);
    checkExpiration();

    return () => clearInterval(interval);
  }, [session?.accessTokenExpires]);

  return <>{children}</>;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <SessionExpirationHandler>{children}</SessionExpirationHandler>
    </NextAuthSessionProvider>
  );
}
