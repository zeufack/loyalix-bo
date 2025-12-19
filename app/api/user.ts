import { http } from './http';
import { User } from '@/types/user';
import { PaginationParams, PaginatedResponse } from './business';

export const getUsers = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<User>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/users', {
    params: { page, limit, sortBy, sortOrder }
  });
  // Handle backend response format
  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      total: response.data.length,
      page: 1,
      limit: response.data.length,
      totalPages: 1
    };
  }
  return {
    data: response.data.users || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const getUser = async (id: string): Promise<User> => {
  const response = await http.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await http.post('/users', data);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const response = await http.patch(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await http.delete(`/users/${id}`);
};

export const getTotalUsers = async (): Promise<number> => {
  const response = await http.get('/users/count');
  return response.data;
};
