import { AxiosError } from 'axios';

/**
 * API Error Response structure from backend
 */
export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Error categories for different handling strategies
 */
export enum ErrorCategory {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Structured API error with category and metadata
 */
export interface ApiError {
  message: string;
  category: ErrorCategory;
  statusCode?: number;
  isRetryable: boolean;
  originalError: unknown;
  validationErrors?: string[];
}

/**
 * User-friendly messages for each error category
 */
const ERROR_MESSAGES: Record<ErrorCategory, string> = {
  [ErrorCategory.NETWORK]: 'Unable to connect. Please check your internet connection.',
  [ErrorCategory.AUTH]: 'Your session has expired. Please login again.',
  [ErrorCategory.VALIDATION]: 'Please check your input and try again.',
  [ErrorCategory.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCategory.CONFLICT]: 'This resource already exists or conflicts with existing data.',
  [ErrorCategory.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
  [ErrorCategory.SERVER]: 'Server error. Please try again later.',
  [ErrorCategory.UNKNOWN]: 'An unexpected error occurred.',
};

/**
 * Check if running in browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
}

/**
 * Check if the error is a network/connectivity error
 */
function isNetworkError(error: AxiosError): boolean {
  // No response means network issue
  if (!error.response) {
    // Check for known network error codes
    if (
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      error.message === 'Network Error'
    ) {
      return true;
    }
    // Check navigator.onLine only in browser
    if (isBrowser() && !navigator.onLine) {
      return true;
    }
    return true; // No response generally means network issue
  }
  return false;
}

/**
 * Determine error category from status code
 */
function getCategoryFromStatus(status: number): ErrorCategory {
  if (status === 401 || status === 403) return ErrorCategory.AUTH;
  if (status === 404) return ErrorCategory.NOT_FOUND;
  if (status === 409) return ErrorCategory.CONFLICT;
  if (status === 422 || status === 400) return ErrorCategory.VALIDATION;
  if (status === 429) return ErrorCategory.RATE_LIMIT;
  if (status >= 500) return ErrorCategory.SERVER;
  return ErrorCategory.UNKNOWN;
}

/**
 * Check if error is retryable
 */
function isRetryableError(category: ErrorCategory, statusCode?: number): boolean {
  // Network errors are retryable
  if (category === ErrorCategory.NETWORK) return true;
  // Rate limit errors are retryable after waiting
  if (category === ErrorCategory.RATE_LIMIT) return true;
  // Server errors (5xx) except 501 are retryable
  if (category === ErrorCategory.SERVER && statusCode !== 501) return true;
  // 408 Request Timeout is retryable
  if (statusCode === 408) return true;
  return false;
}

/**
 * Extract validation errors from response
 */
function extractValidationErrors(data: ApiErrorResponse): string[] {
  if (Array.isArray(data.message)) {
    return data.message;
  }
  return [];
}

/**
 * Parse error into structured ApiError
 */
export function parseApiError(error: unknown): ApiError {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    // Network errors (no response)
    if (isNetworkError(error)) {
      return {
        message: ERROR_MESSAGES[ErrorCategory.NETWORK],
        category: ErrorCategory.NETWORK,
        isRetryable: true,
        originalError: error,
      };
    }

    const status = error.response?.status;
    const data = error.response?.data as ApiErrorResponse | undefined;
    const category = status ? getCategoryFromStatus(status) : ErrorCategory.UNKNOWN;

    // Extract message from response
    let message = ERROR_MESSAGES[category];
    if (data?.message) {
      message = Array.isArray(data.message) ? data.message[0] : data.message;
    } else if (data?.error) {
      message = data.error;
    }

    return {
      message,
      category,
      statusCode: status,
      isRetryable: isRetryableError(category, status),
      originalError: error,
      validationErrors: category === ErrorCategory.VALIDATION ? extractValidationErrors(data || { message: '' }) : undefined,
    };
  }

  // Handle regular Error objects
  if (error instanceof Error) {
    // Check for network-related error messages
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        message: ERROR_MESSAGES[ErrorCategory.NETWORK],
        category: ErrorCategory.NETWORK,
        isRetryable: true,
        originalError: error,
      };
    }

    return {
      message: error.message,
      category: ErrorCategory.UNKNOWN,
      isRetryable: false,
      originalError: error,
    };
  }

  // Handle unknown errors
  return {
    message: ERROR_MESSAGES[ErrorCategory.UNKNOWN],
    category: ErrorCategory.UNKNOWN,
    isRetryable: false,
    originalError: error,
  };
}

/**
 * Get user-friendly error message from any error
 * @deprecated Use parseApiError() for more control, or getApiErrorMessage() for simple cases
 */
export function getApiErrorMessage(error: unknown): string {
  return parseApiError(error).message;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  const parsed = parseApiError(error);
  return parsed.category === ErrorCategory.AUTH;
}

/**
 * Check if error is a network error
 */
export function isNetworkErrorType(error: unknown): boolean {
  const parsed = parseApiError(error);
  return parsed.category === ErrorCategory.NETWORK;
}

/**
 * Check if error can be retried
 */
export function canRetry(error: unknown): boolean {
  const parsed = parseApiError(error);
  return parsed.isRetryable;
}

/**
 * Get validation errors array if available
 */
export function getValidationErrors(error: unknown): string[] {
  const parsed = parseApiError(error);
  return parsed.validationErrors || [];
}
