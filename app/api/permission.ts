import { http } from './http';
import { Permission } from '@/types/permission';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';

export const getPermissions = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Permission>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<Permission>>(
    '/permissions',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getPermission = async (id: string): Promise<Permission> => {
  const response = await http.get<Permission>(`/permissions/${id}`);
  return response.data;
};

export const createPermission = async (
  data: Partial<Permission>
): Promise<Permission> => {
  const response = await http.post<Permission>('/permissions', data);
  return response.data;
};

export const updatePermission = async (
  id: string,
  data: Partial<Permission>
): Promise<Permission> => {
  const response = await http.patch<Permission>(`/permissions/${id}`, data);
  return response.data;
};

export const deletePermission = async (id: string): Promise<void> => {
  await http.delete(`/permissions/${id}`);
};

export const getTotalPermissions = async (): Promise<number> => {
  const response = await http.get<number>('/permissions/count');
  return response.data;
};
