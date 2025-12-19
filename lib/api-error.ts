import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message[0];
      }
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    if (error.response?.status === 401) {
      return 'Unauthorized. Please login again.';
    }

    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (error.response?.status === 404) {
      return 'Resource not found.';
    }

    if (error.response?.status === 409) {
      return 'A resource with this data already exists.';
    }

    if (error.response?.status === 500) {
      return 'Internal server error. Please try again later.';
    }

    return error.message || 'An unexpected error occurred.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}
