import { BusinessType, CreateBusinessTypePayload, UpdateBusinessTypePayload } from '@/types/business-type';
import { http } from './http';
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
  const response = await http.patch<BusinessType>(`/business-types/${id}`, data);
  return response.data;
};

export const deleteBusinessType = async (id: string): Promise<void> => {
  await http.delete(`/business-types/${id}`);
};

export const getTotalBusinessTypes = async (): Promise<number> => {
  const response = await http.get<number>('/business-types/count');
  return response.data;
};
