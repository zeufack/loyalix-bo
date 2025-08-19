import { http } from './http';
import { User } from '@/types/user';

export const getUsers = async (): Promise<{ users: User[]; total: number }> => {
  const response = await http.get('/users');
  return response.data;
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await http.post('/users', data);
  return response.data;
};

export const getTotalUsers = async (): Promise<number> => {
  const response = await http.get('/users/count');
  return response.data;
};
