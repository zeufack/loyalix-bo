import { http } from './http';
import { Promotion } from '@/types/promotion';
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

export const getPromotions = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Promotion>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<Promotion>>(
    '/promotions',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getPromotion = async (id: string): Promise<Promotion> => {
  const response = await http.get<Promotion>(`/promotions/${id}`);
  return response.data;
};

export const createPromotion = async (
  data: Partial<Promotion>
): Promise<Promotion> => {
  const response = await http.post<Promotion>('/promotions', data);
  return response.data;
};

export const updatePromotion = async (
  id: string,
  data: Partial<Promotion>
): Promise<Promotion> => {
  const response = await http.patch<Promotion>(`/promotions/${id}`, data);
  return response.data;
};

export const deletePromotion = async (id: string): Promise<void> => {
  await http.delete(`/promotions/${id}`);
};

export const getTotalPromotions = async (): Promise<number> => {
  const response = await http.get<number>('/promotions/count');
  return response.data;
};
