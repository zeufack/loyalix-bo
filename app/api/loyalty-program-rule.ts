import { http } from './http';
import { LoyaltyProgramRule } from '@/types/loyalty-program-rule';
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

export const getLoyaltyProgramRules = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<LoyaltyProgramRule>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response =
    await http.get<BackendPaginatedResponse<LoyaltyProgramRule>>(
      '/loyalty-program-rule',
      { params: { page, limit, sortBy, sortOrder } }
    );
  return transformPaginatedResponse(response.data);
};

export const getLoyaltyProgramRule = async (
  id: string
): Promise<LoyaltyProgramRule> => {
  const response = await http.get<LoyaltyProgramRule>(
    `/loyalty-program-rule/${id}`
  );
  return response.data;
};

export const createLoyaltyProgramRule = async (
  data: Partial<LoyaltyProgramRule>
): Promise<LoyaltyProgramRule> => {
  const response = await http.post<LoyaltyProgramRule>(
    '/loyalty-program-rule',
    data
  );
  return response.data;
};

export const updateLoyaltyProgramRule = async (
  id: string,
  data: Partial<LoyaltyProgramRule>
): Promise<LoyaltyProgramRule> => {
  const response = await http.patch<LoyaltyProgramRule>(
    `/loyalty-program-rule/${id}`,
    data
  );
  return response.data;
};

export const deleteLoyaltyProgramRule = async (id: string): Promise<void> => {
  await http.delete(`/loyalty-program-rule/${id}`);
};

export const getTotalLoyaltyProgramRules = async (): Promise<number> => {
  const response = await http.get<number>('/loyalty-program-rule/count');
  return response.data;
};
