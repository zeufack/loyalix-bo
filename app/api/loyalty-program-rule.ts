import { http } from './http';
import { LoyaltyProgramRule } from '@/types/loyalty-program-rule';

export const getLoyaltyProgramRules = async (): Promise<LoyaltyProgramRule[]> => {
  const response = await http.get('/program-rule');
  return response.data;
};

export const createLoyaltyProgramRule = async (data: Partial<LoyaltyProgramRule>): Promise<LoyaltyProgramRule> => {
  const response = await http.post('/program-rule', data);
  return response.data;
};
