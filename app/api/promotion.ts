import { http } from './http';
import { Promotion } from '@/types/promotion';
import { PaginationParams, PaginatedResponse } from './business';

export const getPromotions = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Promotion>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/promotions', {
    params: { page, limit, sortBy, sortOrder }
  });
  // Handle backend response format
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
    data: response.data.promotions || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const createPromotion = async (data: Partial<Promotion>): Promise<Promotion> => {
  const response = await http.post('/promotions', data);
  return response.data;
};

export const updatePromotion = async (id: string, data: Partial<Promotion>): Promise<Promotion> => {
  const response = await http.patch(`/promotions/${id}`, data);
  return response.data;
};

export const deletePromotion = async (id: string): Promise<void> => {
  await http.delete(`/promotions/${id}`);
};

export const getTotalPromotions = async (): Promise<number> => {
  const response = await http.get('/promotions/count');
  return response.data;
};
