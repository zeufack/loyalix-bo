import { http } from './http';
import { Activity } from '@/types/activity';
import { PaginationParams, PaginatedResponse } from './business';

export const getActivities = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Activity>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/activities', {
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
    data: response.data.activities || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};
