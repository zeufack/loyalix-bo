import { http } from './http';
import { Reward } from '@/types/reward';
import { PaginationParams, PaginatedResponse } from './business';

export const getRewards = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Reward>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/rewards', {
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
    data: response.data.rewards || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const createReward = async (data: Partial<Reward>): Promise<Reward> => {
  const response = await http.post('/rewards', data);
  return response.data;
};

export const updateReward = async (id: string, data: Partial<Reward>): Promise<Reward> => {
  const response = await http.patch(`/rewards/${id}`, data);
  return response.data;
};

export const deleteReward = async (id: string): Promise<void> => {
  await http.delete(`/rewards/${id}`);
};

export const getTotalRewards = async (): Promise<number> => {
  const response = await http.get('/rewards/count');
  return response.data;
};
