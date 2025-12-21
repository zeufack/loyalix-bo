import { http } from './http';
import { Activity } from '@/types/activity';
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

export const getActivities = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Activity>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<Activity>>(
    '/activities',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getActivity = async (id: string): Promise<Activity> => {
  const response = await http.get<Activity>(`/activities/${id}`);
  return response.data;
};

export const getTotalActivities = async (): Promise<number> => {
  const response = await http.get<number>('/activities/count');
  return response.data;
};
