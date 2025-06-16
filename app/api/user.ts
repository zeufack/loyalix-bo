import { User } from 'types/user';
import http from './http';

export const fetchUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<{ users: User[]; total: number }> => {
  const response = await http.get('http://localhost:3000/users', {
    params: { page, limit }
  });
  return response.data;
};
