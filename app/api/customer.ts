import { Customer } from 'types/customer';
import http from './http';

export const fetchCustomers = async (
  page: number = 1,
  limit: number = 10
): Promise<{ customers: Customer[]; total: number }> => {
  const response = await http.get('http://localhost:3000/customer', {
    params: { page, limit }
  });
  return response.data;
};
