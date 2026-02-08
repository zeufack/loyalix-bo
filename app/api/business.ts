import { http } from './http';
import { Business } from '@/types/business';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';
import type { CreateBusinessDto, UpdateBusinessDto } from '@loyal-ix/loyalix-shared-types';

export const getBusinesses = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Business>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<Business>>(
    '/business',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getBusiness = async (id: string): Promise<Business> => {
  const response = await http.get<Business>(`/business/${id}`);
  return response.data;
};

export const createBusiness = async (
  data: CreateBusinessDto
): Promise<Business> => {
  const response = await http.post<Business>('/business', data);
  return response.data;
};

export const updateBusiness = async (
  id: string,
  data: UpdateBusinessDto
): Promise<Business> => {
  const response = await http.patch<Business>(`/business/${id}`, data);
  return response.data;
};

export const deleteBusiness = async (id: string): Promise<void> => {
  await http.delete(`/business/${id}`);
};

export const getTotalBusinesses = async (): Promise<number> => {
  const response = await http.get<number>('/business/count');
  return response.data;
};

export const uploadBusinessProfileImage = async (
  id: string,
  file: File
): Promise<Business> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await http.post<Business>(
    `/business/${id}/profile-image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

export const uploadBusinessGalleryImages = async (
  id: string,
  files: File[]
): Promise<Business> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  const response = await http.post<Business>(
    `/business/${id}/images`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

export const deleteBusinessImage = async (
  businessId: string,
  imageId: string
): Promise<void> => {
  await http.delete(`/business/${businessId}/images/${imageId}`);
};
