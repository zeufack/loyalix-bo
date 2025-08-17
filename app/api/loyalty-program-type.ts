import { http } from './http';
import { LoyaltyProgramType } from '@/types/loyalty-program-type';

export const getLoyaltyProgramTypes = async (): Promise<LoyaltyProgramType[]> => {
  const response = await http.get('/loyalty-program-type');
  return response.data;
};

export const createLoyaltyProgramType = async (data: Partial<LoyaltyProgramType>): Promise<LoyaltyProgramType> => {
  const response = await http.post('/loyalty-program-type', data);
  return response.data;
};
