import { http } from './http';
import { Activity } from '@/types/activity';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';

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
