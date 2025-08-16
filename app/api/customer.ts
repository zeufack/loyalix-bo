import { Customer } from '@/types/customer';
import { http } from './http';

export const fetchCustomers = async (
  page: number = 1,
  limit: number = 10
): Promise<{ customers: Customer[]; total: number }> => {
  const response = await http.get('/customer', {
    params: { page, limit }
  });
  return response.data;
};

export const createCustomer = async (data: Partial<Customer>): Promise<Customer> => {
  const response = await http.post('/customer', data);
  return response.data;
};

export const getTotalCustomers = async (): Promise<number> => {
  const response = await http.get('/customer/count');
  return response.data;
};
