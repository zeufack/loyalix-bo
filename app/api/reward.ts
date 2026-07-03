import { http } from './http';
import {
  Reward,
  CreateRewardPayload,
  UpdateRewardPayload
} from '@/types/reward';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse
} from './types';
export const getRewards = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Reward>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<Reward>>(
    '/rewards',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const searchRewards = async (
  params: PaginationParams
): Promise<PaginatedResponse<Reward>> => {
  const { page = 1, limit = 10, sortBy, sortOrder, q } = params;
  const response = await http.get<BackendPaginatedResponse<Reward>>(
    '/rewards/search',
    { params: { q, page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getReward = async (id: string): Promise<Reward> => {
  const response = await http.get<Reward>(`/rewards/${id}`);
  return response.data;
};

export const createReward = async (
  data: CreateRewardPayload
): Promise<Reward> => {
  const response = await http.post<Reward>('/rewards', data);
  return response.data;
};

export const updateReward = async (
  id: string,
  data: UpdateRewardPayload
): Promise<Reward> => {
  const response = await http.patch<Reward>(`/rewards/${id}`, data);
  return response.data;
};

export const deleteReward = async (id: string): Promise<void> => {
  await http.delete(`/rewards/${id}`);
};

export const getTotalRewards = async (): Promise<number> => {
  const response = await http.get<number>('/rewards/count');
  return response.data;
};
