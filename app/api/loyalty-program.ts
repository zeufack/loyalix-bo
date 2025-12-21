import { http } from './http';
import { LoyaltyProgram } from '@/types/loyalty-program';
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

export const getLoyaltyPrograms = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<LoyaltyProgram>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<LoyaltyProgram>>(
    '/loyality-program',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getLoyaltyProgram = async (id: string): Promise<LoyaltyProgram> => {
  const response = await http.get<LoyaltyProgram>(`/loyality-program/${id}`);
  return response.data;
};

export const createLoyaltyProgram = async (
  data: Partial<LoyaltyProgram>
): Promise<LoyaltyProgram> => {
  const response = await http.post<LoyaltyProgram>('/loyality-program', data);
  return response.data;
};

export const updateLoyaltyProgram = async (
  id: string,
  data: Partial<LoyaltyProgram>
): Promise<LoyaltyProgram> => {
  const response = await http.patch<LoyaltyProgram>(
    `/loyality-program/${id}`,
    data
  );
  return response.data;
};

export const deleteLoyaltyProgram = async (id: string): Promise<void> => {
  await http.delete(`/loyality-program/${id}`);
};

export const getTotalLoyaltyPrograms = async (): Promise<number> => {
  const response = await http.get<number>('/loyality-program/count');
  return response.data;
};
