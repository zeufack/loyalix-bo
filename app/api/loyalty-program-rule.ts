import { http } from './http';
import {
  LoyaltyProgramRule,
  CreateLoyaltyProgramRulePayload,
  UpdateLoyaltyProgramRulePayload
} from '@/types/loyalty-program-rule';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse
} from './types';

export const getLoyaltyProgramRules = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<LoyaltyProgramRule>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<LoyaltyProgramRule>>(
    '/program-rule',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getLoyaltyProgramRule = async (
  id: string
): Promise<LoyaltyProgramRule> => {
  const response = await http.get<LoyaltyProgramRule>(
    `/program-rule/${id}`
  );
  return response.data;
};

export const createLoyaltyProgramRule = async (
  data: CreateLoyaltyProgramRulePayload
): Promise<LoyaltyProgramRule> => {
  const response = await http.post<LoyaltyProgramRule>(
    '/program-rule',
    data
  );
  return response.data;
};

export const updateLoyaltyProgramRule = async (
  id: string,
  data: UpdateLoyaltyProgramRulePayload
): Promise<LoyaltyProgramRule> => {
  const response = await http.patch<LoyaltyProgramRule>(
    `/program-rule/${id}`,
    data
  );
  return response.data;
};

export const deleteLoyaltyProgramRule = async (id: string): Promise<void> => {
  await http.delete(`/program-rule/${id}`);
};

export const getTotalLoyaltyProgramRules = async (): Promise<number> => {
  const response = await http.get<number>('/program-rule/count');
  return response.data;
};
