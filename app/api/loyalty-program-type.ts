import { http } from './http';
import { LoyaltyProgramType } from '@/types/loyalty-program-type';
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

export const getLoyaltyProgramTypes = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<LoyaltyProgramType>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response =
    await http.get<BackendPaginatedResponse<LoyaltyProgramType>>(
      '/loyalty-program-type',
      { params: { page, limit, sortBy, sortOrder } }
    );
  return transformPaginatedResponse(response.data);
};

export const getLoyaltyProgramType = async (
  id: string
): Promise<LoyaltyProgramType> => {
  const response = await http.get<LoyaltyProgramType>(
    `/loyalty-program-type/${id}`
  );
  return response.data;
};

export const createLoyaltyProgramType = async (
  data: Partial<LoyaltyProgramType>
): Promise<LoyaltyProgramType> => {
  const response = await http.post<LoyaltyProgramType>(
    '/loyalty-program-type',
    data
  );
  return response.data;
};

export const updateLoyaltyProgramType = async (
  id: string,
  data: Partial<LoyaltyProgramType>
): Promise<LoyaltyProgramType> => {
  const response = await http.patch<LoyaltyProgramType>(
    `/loyalty-program-type/${id}`,
    data
  );
  return response.data;
};

export const deleteLoyaltyProgramType = async (id: string): Promise<void> => {
  await http.delete(`/loyalty-program-type/${id}`);
};

export const getTotalLoyaltyProgramTypes = async (): Promise<number> => {
  const response = await http.get<number>('/loyalty-program-type/count');
  return response.data;
};
