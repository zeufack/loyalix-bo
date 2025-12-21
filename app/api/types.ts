/**
 * API response types that match the backend exactly
 */

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
 * Paginated response from backend
 * Format: { items: T[], meta: { total, page, limit, totalPages } }
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Pagination query parameters for API requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
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
