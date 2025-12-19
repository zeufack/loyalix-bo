import { http } from './http';
import { RewardType } from '@/types/reward-type';
import { PaginationParams, PaginatedResponse } from './business';

export const getRewardTypes = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<RewardType>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/reward-types', {
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
    data: response.data.rewardTypes || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const createRewardType = async (
  data: Partial<RewardType>
): Promise<RewardType> => {
  const response = await http.post('/reward-types', data);
  return response.data;
};

export const updateRewardType = async (
  id: string,
  data: Partial<RewardType>
): Promise<RewardType> => {
  const response = await http.patch(`/reward-types/${id}`, data);
  return response.data;
};

export const deleteRewardType = async (id: string): Promise<void> => {
  await http.delete(`/reward-types/${id}`);
};

export const getTotalRewardTypes = async (): Promise<number> => {
  const response = await http.get('/reward-types/count');
  return response.data;
};
