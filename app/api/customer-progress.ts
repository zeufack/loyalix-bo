import { http } from './http';
import { CustomerProgress } from '@/types/customer-progress.type';

export const getCustomerProgress = async (): Promise<CustomerProgress[]> => {
  const response = await http.get('/customer-progress');
  return response.data;
};
