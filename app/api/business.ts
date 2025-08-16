import { http } from './http';
import { Business } from '@/types/business';

export const getBusinesses = async (): Promise<Business[]> => {
  const response = await http.get('/business');
  return response.data;
};

export const createBusiness = async (data: Partial<Business>): Promise<Business> => {
  const response = await http.post('/business', data);
  return response.data;
};

export const getTotalBusinesses = async (): Promise<number> => {
  const response = await http.get('/business/count');
  return response.data;
};
