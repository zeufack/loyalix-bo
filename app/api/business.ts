import { Business, CreateBusinessPayload } from '@/types/business';
import { http } from './http';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BackendPaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Helper to transform backend paginated response to frontend format
 */
function transformPaginatedResponse<T>(
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

export const getBusinesses = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Business>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<Business>>(
    '/business',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getBusiness = async (id: string): Promise<Business> => {
  const response = await http.get<Business>(`/business/${id}`);
  return response.data;
};

export const createBusiness = async (
  data: CreateBusinessPayload
): Promise<Business> => {
  const response = await http.post<Business>('/business', data);
  return response.data;
};

export const updateBusiness = async (
  id: string,
  data: Partial<Business>
): Promise<Business> => {
  const response = await http.patch<Business>(`/business/${id}`, data);
  return response.data;
};

export const deleteBusiness = async (id: string): Promise<void> => {
  await http.delete(`/business/${id}`);
};

export const getTotalBusinesses = async (): Promise<number> => {
  const response = await http.get<number>('/business/count');
  return response.data;
};
