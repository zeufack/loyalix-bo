import { http } from './http';
import { Role, CreateRoleDto, UpdateRoleDto } from '@/types/role';
import { PaginationParams, PaginatedResponse } from './business';

export const getRoles = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Role>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/role', {
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
    data: response.data.roles || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const getRole = async (id: string): Promise<Role> => {
  const response = await http.get(`/role/${id}`);
  return response.data;
};

export const createRole = async (data: CreateRoleDto): Promise<Role> => {
  const response = await http.post('/role', data);
  return response.data;
};

export const updateRole = async (
  id: string,
  data: UpdateRoleDto
): Promise<Role> => {
  const response = await http.patch(`/role/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  await http.delete(`/role/${id}`);
};

export const getTotalRoles = async (): Promise<number> => {
  const response = await http.get('/role/count');
  return response.data;
};
