import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { ErrorCategory, parseApiError } from '@/lib/api-error';

/**
 * Extended request config with retry metadata
 */
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

/**
 * HTTP client configuration
 */
const HTTP_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_NESTJS_API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 2,
  retryDelay: 1000, // 1 second base delay
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

/**
 * Axios HTTP client instance
 * - Automatically attaches JWT token from session
 * - Handles authentication errors
 * - Implements retry logic for transient failures
 * - Provides comprehensive error handling
 */
export const http = axios.create(HTTP_CONFIG);

/**
 * Calculate delay for retry with exponential backoff
 */
function getRetryDelay(retryCount: number, status?: number): number {
  // For rate limiting (429), use longer delay
  if (status === 429) {
    return RETRY_CONFIG.retryDelay * Math.pow(2, retryCount + 1);
  }
  // Exponential backoff for other errors
  return RETRY_CONFIG.retryDelay * Math.pow(2, retryCount);
}

/**
 * Check if request should be retried
 */
function shouldRetry(error: AxiosError, config: RetryConfig): boolean {
  const retryCount = config._retryCount || 0;

  // Don't retry if max retries exceeded
  if (retryCount >= RETRY_CONFIG.maxRetries) {
    return false;
  }

  // Don't retry POST/PUT/PATCH/DELETE by default (not idempotent)
  // Exception: can retry if server error and request hadn't started processing
  const method = config.method?.toUpperCase();
  if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    // Only retry on network errors (request never reached server)
    if (error.response) {
      return false;
    }
  }

  // Retry on network errors
  if (!error.response) {
    return true;
  }

  // Retry on specific status codes
  const status = error.response.status;
  return RETRY_CONFIG.retryableStatuses.includes(status);
}

/**
 * Sleep utility for retry delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Request interceptor - attach JWT token
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      // Log but don't fail the request
      console.warn('Failed to get session for request:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors and retry logic
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;

    if (!config) {
      return Promise.reject(error);
    }

    // Parse the error for categorization
    const parsedError = parseApiError(error);

    // Handle authentication errors - sign out user
    if (parsedError.category === ErrorCategory.AUTH && error.response?.status === 401) {
      // Avoid redirect loops
      if (!config._retry) {
        config._retry = true;
        try {
          await signOut({ redirect: true, callbackUrl: '/login' });
        } catch {
          // If signOut fails, still reject the original error
        }
      }
      return Promise.reject(error);
    }

    // Handle retry logic for transient errors
    if (shouldRetry(error, config)) {
      config._retryCount = (config._retryCount || 0) + 1;

      const delay = getRetryDelay(config._retryCount, error.response?.status);

      console.info(
        `Retrying request (${config._retryCount}/${RETRY_CONFIG.maxRetries}):`,
        config.url,
        `in ${delay}ms`
      );

      await sleep(delay);

      return http.request(config);
    }

    return Promise.reject(error);
  }
);

/**
 * Create a request with custom timeout
 */
export function withTimeout<T>(
  request: Promise<T>,
  timeoutMs: number = HTTP_CONFIG.timeout
): Promise<T> {
  return Promise.race([
    request,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
}

/**
 * Check if currently online (browser only)
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true; // Assume online on server
  }
  return navigator.onLine;
}

export default http;
