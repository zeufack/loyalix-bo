import { http } from './http';
import { Permission } from '@/types/permission';

export const getPermissions = async (): Promise<{ permissions: Permission[]; total: number }> => {
  const response = await http.get('/permissions');
  console.log(response);
  return response.data;
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
  const response = await http.put(`/permissions/${id}`, data);
  return response.data;
};
