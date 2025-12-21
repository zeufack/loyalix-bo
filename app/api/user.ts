import { http } from './http';
import { User } from '@/types/user';
import { PaginationParams, PaginatedResponse } from './business';

interface BackendPaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function transformPaginatedResponse<T>(
  response: BackendPaginatedResponse<T>
): PaginatedResponse<T> {
  return {
    data: response.items,
    total: response.meta.total,
    page: response.meta.page,
    limit: response.meta.limit,
    totalPages: response.meta.totalPages,
  };
}

export const getUsers = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<User>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<User>>('/users', {
    params: { page, limit, sortBy, sortOrder },
  });
  return transformPaginatedResponse(response.data);
};

export const getUser = async (id: string): Promise<User> => {
  const response = await http.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await http.post<User>('/users', data);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const response = await http.patch<User>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await http.delete(`/users/${id}`);
};

export const getTotalUsers = async (): Promise<number> => {
  const response = await http.get<number>('/users/count');
  return response.data;
};
