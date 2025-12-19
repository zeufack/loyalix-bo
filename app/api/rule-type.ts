import { http } from './http';
import { RuleType } from '@/types/rule-type';
import { PaginationParams, PaginatedResponse } from './business';

export const getRuleTypes = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<RuleType>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/rule-types', {
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
    data: response.data.ruleTypes || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const createRuleType = async (data: Partial<RuleType>): Promise<RuleType> => {
  const response = await http.post('/rule-types', data);
  return response.data;
};

export const updateRuleType = async (id: string, data: Partial<RuleType>): Promise<RuleType> => {
  const response = await http.patch(`/rule-types/${id}`, data);
  return response.data;
};

export const deleteRuleType = async (id: string): Promise<void> => {
  await http.delete(`/rule-types/${id}`);
};

export const getTotalRuleTypes = async (): Promise<number> => {
  const response = await http.get('/rule-types/count');
  return response.data;
};
