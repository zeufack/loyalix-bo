import { http } from './http';
import { LoyaltyProgramRule } from '@/types/loyalty-program-rule';

export const getLoyaltyProgramRules = async (): Promise<LoyaltyProgramRule[]> => {
  const response = await http.get('/loyalty-program-rule');
  return response.data;
};

export const createLoyaltyProgramRule = async (
  data: Partial<LoyaltyProgramRule>
): Promise<LoyaltyProgramRule> => {
  const response = await http.post('/loyalty-program-rule', data);
  return response.data;
};

export const updateLoyaltyProgramRule = async (
  id: string,
  data: Partial<LoyaltyProgramRule>
): Promise<LoyaltyProgramRule> => {
  const response = await http.put(`/loyalty-program-rule/${id}`, data);
  return response.data;
};

export const deleteLoyaltyProgramRule = async (id: string): Promise<void> => {
  await http.delete(`/loyalty-program-rule/${id}`);
};

export const getTotalLoyaltyProgramRules = async (): Promise<number> => {
  const response = await http.get('/loyalty-program-rule/count');
  return response.data;
};
