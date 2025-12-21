import { http } from './http';
import { RuleType } from '@/types/rule-type';
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

export const getRuleTypes = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<RuleType>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<RuleType>>(
    '/rule-types',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getRuleType = async (id: string): Promise<RuleType> => {
  const response = await http.get<RuleType>(`/rule-types/${id}`);
  return response.data;
};

export const createRuleType = async (
  data: Partial<RuleType>
): Promise<RuleType> => {
  const response = await http.post<RuleType>('/rule-types', data);
  return response.data;
};

export const updateRuleType = async (
  id: string,
  data: Partial<RuleType>
): Promise<RuleType> => {
  const response = await http.patch<RuleType>(`/rule-types/${id}`, data);
  return response.data;
};

export const deleteRuleType = async (id: string): Promise<void> => {
  await http.delete(`/rule-types/${id}`);
};

export const getTotalRuleTypes = async (): Promise<number> => {
  const response = await http.get<number>('/rule-types/count');
  return response.data;
};
