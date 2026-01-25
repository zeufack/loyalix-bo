import { http } from './http';
import { LoyaltyProgramRule } from '@/types/loyalty-program-rule';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';

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
