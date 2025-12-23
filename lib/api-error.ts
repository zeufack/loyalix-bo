import { AxiosError } from 'axios';

/**
 * Backend error detail structure (validation errors)
 */
export interface ErrorDetail {
  field: string;
  message: string;
}

/**
 * Backend structured error response
 * Matches the HttpExceptionFilter format from loyalix-backend
 */
export interface BackendError {
  code: string;
  message: string;
  details?: ErrorDetail[];
  documentation_url?: string;
}

/**
 * API Error Response structure from backend
 */
export interface ApiErrorResponse {
  error: BackendError;
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
  code: string;
  category: ErrorCategory;
  statusCode?: number;
  isRetryable: boolean;
  originalError: unknown;
  validationErrors?: ErrorDetail[];
  documentationUrl?: string;
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
  if (!error.response) {
    if (
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      error.message === 'Network Error'
    ) {
      return true;
    }
    if (isBrowser() && !navigator.onLine) {
      return true;
    }
    return true;
  }
  return false;
}

/**
 * Map backend error code to error category
 */
function getCategoryFromErrorCode(code: string): ErrorCategory {
  const upperCode = code.toUpperCase();

  if (upperCode.includes('UNAUTHORIZED') || upperCode.includes('FORBIDDEN')) {
    return ErrorCategory.AUTH;
  }
  if (upperCode.includes('NOT_FOUND')) {
    return ErrorCategory.NOT_FOUND;
  }
  if (upperCode.includes('CONFLICT')) {
    return ErrorCategory.CONFLICT;
  }
  if (upperCode.includes('BAD_REQUEST') || upperCode.includes('VALIDATION')) {
    return ErrorCategory.VALIDATION;
  }
  if (upperCode.includes('TOO_MANY_REQUESTS')) {
    return ErrorCategory.RATE_LIMIT;
  }
  if (upperCode.includes('INTERNAL_SERVER_ERROR') || upperCode.includes('SERVER')) {
    return ErrorCategory.SERVER;
  }
  return ErrorCategory.UNKNOWN;
}

/**
 * Determine error category from status code (fallback)
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
  if (category === ErrorCategory.NETWORK) return true;
  if (category === ErrorCategory.RATE_LIMIT) return true;
  if (category === ErrorCategory.SERVER && statusCode !== 501) return true;
  if (statusCode === 408) return true;
  return false;
}

/**
 * Type guard to check if response data matches backend error format
 */
function isBackendErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as ApiErrorResponse).error === 'object' &&
    (data as ApiErrorResponse).error !== null &&
    typeof (data as ApiErrorResponse).error.message === 'string'
  );
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
        code: 'NETWORK_ERROR',
        category: ErrorCategory.NETWORK,
        isRetryable: true,
        originalError: error,
      };
    }

    const status = error.response?.status;
    const data = error.response?.data;

    // Handle backend structured error format: { error: { code, message, details, documentation_url } }
    if (isBackendErrorResponse(data)) {
      const backendError = data.error;
      const category = getCategoryFromErrorCode(backendError.code);

      return {
        message: backendError.message,
        code: backendError.code,
        category,
        statusCode: status,
        isRetryable: isRetryableError(category, status),
        originalError: error,
        validationErrors: backendError.details,
        documentationUrl: backendError.documentation_url,
      };
    }

    // Fallback for non-standard error responses
    const category = status ? getCategoryFromStatus(status) : ErrorCategory.UNKNOWN;
    let message = ERROR_MESSAGES[category];

    // Try to extract message from various formats
    if (typeof data === 'string') {
      message = data;
    } else if (typeof data === 'object' && data !== null) {
      const legacyData = data as { message?: string | string[]; error?: string };
      if (legacyData.message) {
        message = Array.isArray(legacyData.message)
          ? legacyData.message.join(', ')
          : legacyData.message;
      } else if (legacyData.error && typeof legacyData.error === 'string') {
        message = legacyData.error;
      }
    }

    return {
      message,
      code: category.toUpperCase(),
      category,
      statusCode: status,
      isRetryable: isRetryableError(category, status),
      originalError: error,
    };
  }

  // Handle regular Error objects
  if (error instanceof Error) {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        message: ERROR_MESSAGES[ErrorCategory.NETWORK],
        code: 'NETWORK_ERROR',
        category: ErrorCategory.NETWORK,
        isRetryable: true,
        originalError: error,
      };
    }

    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      category: ErrorCategory.UNKNOWN,
      isRetryable: false,
      originalError: error,
    };
  }

  // Handle unknown errors
  return {
    message: ERROR_MESSAGES[ErrorCategory.UNKNOWN],
    code: 'UNKNOWN_ERROR',
    category: ErrorCategory.UNKNOWN,
    isRetryable: false,
    originalError: error,
  };
}

/**
 * Get user-friendly error message from any error
 */
export function getApiErrorMessage(error: unknown): string {
  return parseApiError(error).message;
}

/**
 * Get error code from any error
 */
export function getApiErrorCode(error: unknown): string {
  return parseApiError(error).code;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  return parseApiError(error).category === ErrorCategory.AUTH;
}

/**
 * Check if error is a network error
 */
export function isNetworkErrorType(error: unknown): boolean {
  return parseApiError(error).category === ErrorCategory.NETWORK;
}

/**
 * Check if error can be retried
 */
export function canRetry(error: unknown): boolean {
  return parseApiError(error).isRetryable;
}

/**
 * Get validation errors array if available
 */
export function getValidationErrors(error: unknown): ErrorDetail[] {
  return parseApiError(error).validationErrors || [];
}

/**
 * Get documentation URL if available
 */
export function getDocumentationUrl(error: unknown): string | undefined {
  return parseApiError(error).documentationUrl;
}
