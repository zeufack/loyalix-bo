'use client';

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { SessionProvider } from '@/components/auth/session-provider';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { parseApiError, ErrorCategory } from '@/lib/api-error';

/**
 * Create QueryClient with global error handling
 */
function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        const parsed = parseApiError(error);

        // Don't show toast for auth errors (handled by HTTP interceptor)
        if (parsed.category === ErrorCategory.AUTH) {
          return;
        }

        // Don't show toast if query has its own error handling
        if (query.meta?.skipGlobalErrorHandler) {
          return;
        }

        // Show error toast for failed queries
        toast.error('Failed to load data', {
          description: parsed.message,
        });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        const parsed = parseApiError(error);

        // Don't show toast for auth errors (handled by HTTP interceptor)
        if (parsed.category === ErrorCategory.AUTH) {
          return;
        }

        // Don't show toast if mutation has its own error handling
        if (mutation.meta?.skipGlobalErrorHandler) {
          return;
        }

        // Show error toast for failed mutations
        toast.error('Operation failed', {
          description: parsed.message,
        });
      },
    }),
    defaultOptions: {
      queries: {
        // Retry configuration
        retry: (failureCount, error) => {
          const parsed = parseApiError(error);

          // Don't retry auth errors
          if (parsed.category === ErrorCategory.AUTH) {
            return false;
          }

          // Don't retry validation errors
          if (parsed.category === ErrorCategory.VALIDATION) {
            return false;
          }

          // Don't retry not found errors
          if (parsed.category === ErrorCategory.NOT_FOUND) {
            return false;
          }

          // Retry up to 2 times for retryable errors
          return parsed.isRetryable && failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Stale time - data is fresh for 5 minutes
        staleTime: 5 * 60 * 1000,

        // Garbage collection time - keep unused data for 10 minutes
        gcTime: 10 * 60 * 1000,

        // Refetch behavior
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        // Don't retry mutations by default
        retry: false,
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // Create QueryClient once per component instance
  // Using useState ensures it's not recreated on re-renders
  const [queryClient] = useState(() => createQueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}

// Type augmentation for query/mutation meta
declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      skipGlobalErrorHandler?: boolean;
    };
    mutationMeta: {
      skipGlobalErrorHandler?: boolean;
    };
  }
}
