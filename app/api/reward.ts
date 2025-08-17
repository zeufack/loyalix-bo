import { http } from './http';
import { Reward } from '@/types/reward';

export const getRewards = async (): Promise<Reward[]> => {
  const response = await http.get('/rewards');
  return response.data;
};

export const createReward = async (data: Partial<Reward>): Promise<Reward> => {
  const response = await http.post('/rewards', data);
  return response.data;
};

export const updateReward = async (id: string, data: Partial<Reward>): Promise<Reward> => {
  const response = await http.put(`/rewards/${id}`, data);
  return response.data;
};

export const deleteReward = async (id: string): Promise<void> => {
  await http.delete(`/rewards/${id}`);
};

export const getTotalRewards = async (): Promise<number> => {
  const response = await http.get('/rewards/count');
  return response.data;
};
