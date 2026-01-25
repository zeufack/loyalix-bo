import { http } from './http';
import { CustomerProgress } from '@/types/customer-progress.type';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';

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
