/**
 * Shared API types and utilities for all API modules
 * Import from here instead of duplicating in each file
 */

/**
 * Pagination query parameters for API requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination metadata from backend
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Backend paginated response format
 * Format: { items: T[], meta: { total, page, limit, totalPages } }
 */
export interface BackendPaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Frontend paginated response format (transformed)
 * Format: { data: T[], total, page, limit, totalPages }
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Transform backend paginated response to frontend format
 */
export function transformPaginatedResponse<T>(
  response: BackendPaginatedResponse<T>
): PaginatedResponse<T> {
  return {
    data: response.items,
    total: response.meta.total,
    page: response.meta.page,
    limit: response.meta.limit,
    totalPages: response.meta.totalPages,
  };
}

/**
 * API error response structure
 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

/**
 * Delete operation response
 */
export interface DeleteResponse {
  message: string;
}
