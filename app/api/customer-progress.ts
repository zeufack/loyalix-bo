import { http } from './http';
import { CustomerProgress } from '@/types/customer-progress.type';
import { PaginationParams, PaginatedResponse } from './business';

export const getCustomerProgress = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<CustomerProgress>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/customer-progress', {
    params: { page, limit, sortBy, sortOrder }
  });
  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      total: response.data.length,
      page: 1,
      limit: response.data.length,
      totalPages: 1
    };
  }
  return {
    data: response.data.progress || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};
