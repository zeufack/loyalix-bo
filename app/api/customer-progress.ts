import { http } from './http';
import { CustomerProgress } from '@/types/customer-progress.type';
import { PaginationParams, PaginatedResponse } from './business';

interface BackendPaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

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

export const getCustomerProgress = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<CustomerProgress>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<CustomerProgress>>(
    '/customer-progress',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getCustomerProgressById = async (
  id: string
): Promise<CustomerProgress> => {
  const response = await http.get<CustomerProgress>(`/customer-progress/${id}`);
  return response.data;
};

export const getTotalCustomerProgress = async (): Promise<number> => {
  const response = await http.get<number>('/customer-progress/count');
  return response.data;
};
