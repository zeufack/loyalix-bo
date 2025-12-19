import { http } from './http';
import { LoyaltyProgram } from '@/types/loyalty-program';
import { PaginationParams, PaginatedResponse } from './business';

export const getLoyaltyPrograms = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<LoyaltyProgram>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/loyality-program', {
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
    data: response.data.loyaltyPrograms || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const createLoyaltyProgram = async (
  data: Partial<LoyaltyProgram>
): Promise<LoyaltyProgram> => {
  const response = await http.post('/loyality-program', data);
  return response.data;
};

export const updateLoyaltyProgram = async (
  id: string,
  data: Partial<LoyaltyProgram>
): Promise<LoyaltyProgram> => {
  const response = await http.patch(`/loyality-program/${id}`, data);
  return response.data;
};

export const deleteLoyaltyProgram = async (id: string): Promise<void> => {
  await http.delete(`/loyality-program/${id}`);
};

export const getTotalLoyaltyPrograms = async (): Promise<number> => {
  const response = await http.get('/loyality-program/count');
  return response.data;
};
