import { http } from './http';
import { RewardType } from '@/types/reward-type';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';

export const getRewardTypes = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<RewardType>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<RewardType>>(
    '/reward-types',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getRewardType = async (id: string): Promise<RewardType> => {
  const response = await http.get<RewardType>(`/reward-types/${id}`);
  return response.data;
};

export const createRewardType = async (
  data: Partial<RewardType>
): Promise<RewardType> => {
  const response = await http.post<RewardType>('/reward-types', data);
  return response.data;
};

export const updateRewardType = async (
  id: string,
  data: Partial<RewardType>
): Promise<RewardType> => {
  const response = await http.patch<RewardType>(`/reward-types/${id}`, data);
  return response.data;
};

export const deleteRewardType = async (id: string): Promise<void> => {
  await http.delete(`/reward-types/${id}`);
};

export const getTotalRewardTypes = async (): Promise<number> => {
  const response = await http.get<number>('/reward-types/count');
  return response.data;
};
