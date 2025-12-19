import { http } from './http';
import { LoyaltyProgramType } from '@/types/loyalty-program-type';
import { PaginationParams, PaginatedResponse } from './business';

export const getLoyaltyProgramTypes = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<LoyaltyProgramType>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/loyalty-program-type', {
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
    data: response.data.loyaltyProgramTypes || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const createLoyaltyProgramType = async (
  data: Partial<LoyaltyProgramType>
): Promise<LoyaltyProgramType> => {
  const response = await http.post('/loyalty-program-type', data);
  return response.data;
};

export const updateLoyaltyProgramType = async (
  id: string,
  data: Partial<LoyaltyProgramType>
): Promise<LoyaltyProgramType> => {
  const response = await http.patch(`/loyalty-program-type/${id}`, data);
  return response.data;
};

export const deleteLoyaltyProgramType = async (id: string): Promise<void> => {
  await http.delete(`/loyalty-program-type/${id}`);
};

export const getTotalLoyaltyProgramTypes = async (): Promise<number> => {
  const response = await http.get('/loyalty-program-type/count');
  return response.data;
};
