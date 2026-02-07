import {
  BusinessType,
  CreateBusinessTypePayload,
  UpdateBusinessTypePayload
} from '@/types/business-type';
import { http } from './http';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse
} from './types';

export const getBusinessTypes = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<BusinessType>> => {
  const { page = 1, limit = 100, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<BusinessType>>(
    '/business-types',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getBusinessType = async (id: string): Promise<BusinessType> => {
  const response = await http.get<BusinessType>(`/business-types/${id}`);
  return response.data;
};

export const createBusinessType = async (
  data: CreateBusinessTypePayload
): Promise<BusinessType> => {
  const response = await http.post<BusinessType>('/business-types', data);
  return response.data;
};

export const updateBusinessType = async (
  id: string,
  data: UpdateBusinessTypePayload
): Promise<BusinessType> => {
  const response = await http.patch<BusinessType>(
    `/business-types/${id}`,
    data
  );
  return response.data;
};

export const deleteBusinessType = async (id: string): Promise<void> => {
  await http.delete(`/business-types/${id}`);
};

export const getTotalBusinessTypes = async (): Promise<number> => {
  const response = await http.get<number>('/business-types/count');
  return response.data;
};

export const uploadBusinessTypeIcon = async (
  id: string,
  file: File
): Promise<BusinessType> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await http.post<BusinessType>(
    `/business-types/${id}/icon`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};
