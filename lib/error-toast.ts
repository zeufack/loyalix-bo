import { toast } from 'sonner';
import { parseApiError, ErrorCategory, ApiError } from './api-error';

/**
 * Toast options for different error categories
 */
const TOAST_CONFIG: Record<ErrorCategory, { duration: number; action?: boolean }> = {
  [ErrorCategory.NETWORK]: { duration: Infinity, action: true },
  [ErrorCategory.AUTH]: { duration: 5000 },
  [ErrorCategory.VALIDATION]: { duration: 5000 },
  [ErrorCategory.NOT_FOUND]: { duration: 4000 },
  [ErrorCategory.CONFLICT]: { duration: 5000 },
  [ErrorCategory.RATE_LIMIT]: { duration: 6000 },
  [ErrorCategory.SERVER]: { duration: 5000, action: true },
  [ErrorCategory.UNKNOWN]: { duration: 5000 },
};

/**
 * Show error toast with appropriate styling and actions
 */
export function showErrorToast(
  error: unknown,
  options?: {
    title?: string;
    onRetry?: () => void;
  }
): void {
  const parsed = parseApiError(error);
  const config = TOAST_CONFIG[parsed.category];

  const toastOptions: Parameters<typeof toast.error>[1] = {
    description: parsed.message,
    duration: config.duration,
  };

  // Add retry action for retryable errors
  if (parsed.isRetryable && options?.onRetry) {
    toastOptions.action = {
      label: 'Retry',
      onClick: options.onRetry,
    };
  }

  toast.error(options?.title || getDefaultTitle(parsed), toastOptions);
}

/**
 * Get default title based on error category
 */
function getDefaultTitle(error: ApiError): string {
  switch (error.category) {
    case ErrorCategory.NETWORK:
      return 'Connection Error';
    case ErrorCategory.AUTH:
      return 'Authentication Error';
    case ErrorCategory.VALIDATION:
      return 'Validation Error';
    case ErrorCategory.NOT_FOUND:
      return 'Not Found';
    case ErrorCategory.CONFLICT:
      return 'Conflict';
    case ErrorCategory.RATE_LIMIT:
      return 'Too Many Requests';
    case ErrorCategory.SERVER:
      return 'Server Error';
    default:
      return 'Error';
  }
}

/**
 * Show success toast
 */
export function showSuccessToast(
  title: string,
  description?: string
): void {
  toast.success(title, {
    description,
    duration: 3000,
  });
}

/**
 * Show loading toast that can be updated
 */
export function showLoadingToast(message: string): string | number {
  return toast.loading(message);
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(toastId: string | number): void {
  toast.dismiss(toastId);
}

/**
 * Update a toast (useful for loading -> success/error transitions)
 */
export function updateToast(
  toastId: string | number,
  type: 'success' | 'error',
  title: string,
  description?: string
): void {
  if (type === 'success') {
    toast.success(title, { id: toastId, description, duration: 3000 });
  } else {
    toast.error(title, { id: toastId, description, duration: 5000 });
  }
}

/**
 * Show validation errors from API
 */
export function showValidationErrors(errors: string[]): void {
  if (errors.length === 0) return;

  if (errors.length === 1) {
    toast.error('Validation Error', {
      description: errors[0],
      duration: 5000,
    });
    return;
  }

  // Multiple errors - show as list
  toast.error('Validation Errors', {
    description: errors.slice(0, 3).join('\n') + (errors.length > 3 ? `\n...and ${errors.length - 3} more` : ''),
    duration: 7000,
  });
}
