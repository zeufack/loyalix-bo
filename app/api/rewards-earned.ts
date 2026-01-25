import { http } from './http';
import { RewardEarned, CreateRewardEarnedDto } from '@/types/rewards-earned';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';

interface RewardsEarnedParams extends PaginationParams {
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const getRewardsEarned = async (
  params: RewardsEarnedParams = {}
): Promise<PaginatedResponse<RewardEarned>> => {
  const {
    page = 1,
    limit = 10,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    status,
  } = params;
  const response = await http.get<BackendPaginatedResponse<RewardEarned>>(
    '/rewards-earned',
    { params: { page, limit, sortBy, sortOrder, startDate, endDate, status } }
  );
  return transformPaginatedResponse(response.data);
};

export const getRewardEarned = async (id: string): Promise<RewardEarned> => {
  const response = await http.get<RewardEarned>(`/rewards-earned/${id}`);
  return response.data;
};

export const createRewardEarned = async (
  data: CreateRewardEarnedDto
): Promise<RewardEarned> => {
  const response = await http.post<RewardEarned>('/rewards-earned', data);
  return response.data;
};

export const updateRewardEarned = async (
  id: string,
  data: Partial<RewardEarned>
): Promise<RewardEarned> => {
  const response = await http.patch<RewardEarned>(
    `/rewards-earned/${id}`,
    data
  );
  return response.data;
};

export const deleteRewardEarned = async (id: string): Promise<void> => {
  await http.delete(`/rewards-earned/${id}`);
};

export const redeemReward = async (id: string): Promise<RewardEarned> => {
  const response = await http.post<RewardEarned>(`/rewards-earned/${id}/redeem`);
  return response.data;
};

export const verifyRedemptionCode = async (
  code: string
): Promise<RewardEarned> => {
  const response = await http.get<RewardEarned>(`/rewards-earned/verify/${code}`);
  return response.data;
};

export const redeemByCode = async (
  code: string,
  notes?: string
): Promise<RewardEarned> => {
  const response = await http.post<RewardEarned>(
    `/rewards-earned/redeem-by-code/${code}`,
    { notes }
  );
  return response.data;
};

export const getTotalRewardsEarned = async (): Promise<number> => {
  const response = await http.get<number>('/rewards-earned/count');
  return response.data;
};
