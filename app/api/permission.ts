import { http } from './http';
import { Permission } from '@/types/permission';
import { PaginationParams, PaginatedResponse } from './business';

export const getPermissions = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Permission>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/permissions', {
    params: { page, limit, sortBy, sortOrder }
  });
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
    data: response.data.permissions || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const createPermission = async (data: Partial<Permission>): Promise<Permission> => {
  const response = await http.post('/permissions', data);
  return response.data;
};

export const getTotalPermissions = async (): Promise<number> => {
  const response = await http.get('/permissions/count');
  return response.data;
};

export const updatePermission = async (id: string, data: Partial<Permission>): Promise<Permission> => {
  const response = await http.patch(`/permissions/${id}`, data);
  return response.data;
};

export const deletePermission = async (id: string): Promise<void> => {
  await http.delete(`/permissions/${id}`);
};
