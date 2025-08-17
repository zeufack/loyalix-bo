import { http } from './http';
import { RuleType } from '@/types/rule-type';

export const getRuleTypes = async (): Promise<RuleType[]> => {
  const response = await http.get('/rule-types');
  return response.data;
};

export const createRuleType = async (data: Partial<RuleType>): Promise<RuleType> => {
  const response = await http.post('/rule-types', data);
  return response.data;
};

export const updateRuleType = async (id: string, data: Partial<RuleType>): Promise<RuleType> => {
  const response = await http.put(`/rule-types/${id}`, data);
  return response.data;
};

export const deleteRuleType = async (id: string): Promise<void> => {
  await http.delete(`/rule-types/${id}`);
};

export const getTotalRuleTypes = async (): Promise<number> => {
  const response = await http.get('/rule-types/count');
  return response.data;
};
