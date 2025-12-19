import { http } from './http';
import { RewardEarned, CreateRewardEarnedDto } from '@/types/rewards-earned';
import { PaginationParams, PaginatedResponse } from './business';

interface RewardsEarnedParams extends PaginationParams {
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const getRewardsEarned = async (
  params: RewardsEarnedParams = {}
): Promise<PaginatedResponse<RewardEarned>> => {
  const { page = 1, limit = 10, sortBy, sortOrder, startDate, endDate, status } = params;
  const response = await http.get('/rewards-earned', {
    params: { page, limit, sortBy, sortOrder, startDate, endDate, status }
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

export const getRewardEarned = async (id: string): Promise<RewardEarned> => {
  const response = await http.get(`/rewards-earned/${id}`);
  return response.data;
};

export const createRewardEarned = async (
  data: CreateRewardEarnedDto
): Promise<RewardEarned> => {
  const response = await http.post('/rewards-earned', data);
  return response.data;
};

export const updateRewardEarned = async (
  id: string,
  data: Partial<RewardEarned>
): Promise<RewardEarned> => {
  const response = await http.patch(`/rewards-earned/${id}`, data);
  return response.data;
};

export const deleteRewardEarned = async (id: string): Promise<void> => {
  await http.delete(`/rewards-earned/${id}`);
};

export const redeemReward = async (id: string): Promise<RewardEarned> => {
  const response = await http.post(`/rewards-earned/${id}/redeem`);
  return response.data;
};

export const verifyRedemptionCode = async (
  code: string
): Promise<RewardEarned> => {
  const response = await http.get(`/rewards-earned/verify/${code}`);
  return response.data;
};

export const redeemByCode = async (
  code: string,
  notes?: string
): Promise<RewardEarned> => {
  const response = await http.post(`/rewards-earned/redeem-by-code/${code}`, {
    notes
  });
  return response.data;
};

export const getTotalRewardsEarned = async (): Promise<number> => {
  const response = await http.get('/rewards-earned/count');
  return response.data;
};
