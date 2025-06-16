import { Business } from '../../types/business';
import http from './http';

export const fetchBusiness = async (
  page: number = 1,
  limit: number = 10
): Promise<{ business: Business[]; total: number }> => {
  const response = await http.get('http://localhost:3000/business', {
    params: { page, limit }
  });
  return response.data;
};
