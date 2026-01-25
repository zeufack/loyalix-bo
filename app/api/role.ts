import { http } from './http';
import { Role, CreateRoleDto, UpdateRoleDto } from '@/types/role';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';

export const getRoles = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Role>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<Role>>('/role', {
    params: { page, limit, sortBy, sortOrder },
  });
  return transformPaginatedResponse(response.data);
};

export const getRole = async (id: string): Promise<Role> => {
  const response = await http.get<Role>(`/role/${id}`);
  return response.data;
};

export const createRole = async (data: CreateRoleDto): Promise<Role> => {
  const response = await http.post<Role>('/role', data);
  return response.data;
};

export const updateRole = async (
  id: string,
  data: UpdateRoleDto
): Promise<Role> => {
  const response = await http.patch<Role>(`/role/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  await http.delete(`/role/${id}`);
};

export const getTotalRoles = async (): Promise<number> => {
  const response = await http.get<number>('/role/count');
  return response.data;
};
