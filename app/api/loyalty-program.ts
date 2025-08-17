import { http } from './http';
import { LoyaltyProgram } from '@/types/loyalty-program';

export const getLoyaltyPrograms = async (): Promise<LoyaltyProgram[]> => {
  const response = await http.get('/loyality-program');
  return response.data;
};

export const createLoyaltyProgram = async (data: Partial<LoyaltyProgram>): Promise<LoyaltyProgram> => {
  const response = await http.post('/loyality-program', data);
  return response.data;
};

export const updateLoyaltyProgram = async (
  id: string,
  data: Partial<LoyaltyProgram>
): Promise<LoyaltyProgram> => {
  const response = await http.put(`/loyality-program/${id}`, data);
  return response.data;
};

export const deleteLoyaltyProgram = async (id: string): Promise<void> => {
  await http.delete(`/loyality-program/${id}`);
};

export const getTotalLoyaltyPrograms = async (): Promise<number> => {
  const response = await http.get('/loyality-program/count');
  return response.data;
};
