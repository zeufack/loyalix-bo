import { http } from './http';
import { User } from '@/types/user';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';
import type { CreateUserDto, UpdateUserDto } from '@loyal-ix/loyalix-shared-types';

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

export const createUser = async (data: CreateUserDto): Promise<User> => {
  const response = await http.post<User>('/users', data);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: UpdateUserDto
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
