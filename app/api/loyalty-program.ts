import { LoyaltyProgram } from '../../types/loyalty-programm';
import http from './http';

export const fetchLoyaltyPrograms = async (
  page: number = 1,
  limit: number = 10
): Promise<{ programs: LoyaltyProgram[]; total: number }> => {
  const response = await http.get('http://localhost:3000/loyality-program', {
    params: { page, limit }
  });
  return response.data;
};
