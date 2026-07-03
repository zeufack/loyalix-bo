import { http } from './http';
import { LoyaltyProgramType } from '@/types/loyalty-program-type';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse
} from './types';

const RESOURCE_URL = '/program-type';
export const getLoyaltyProgramTypes = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<LoyaltyProgramType>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<LoyaltyProgramType>>(
    '/program-type',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getLoyaltyProgramType = async (
  id: string
): Promise<LoyaltyProgramType> => {
  const response = await http.get<LoyaltyProgramType>(`/program-type/${id}`);
  return response.data;
};

export const createLoyaltyProgramType = async (
  data: Partial<LoyaltyProgramType>
): Promise<LoyaltyProgramType> => {
  const response = await http.post<LoyaltyProgramType>('/program-type', data);
  return response.data;
};

export const updateLoyaltyProgramType = async (
  id: string,
  data: Partial<LoyaltyProgramType>
): Promise<LoyaltyProgramType> => {
  const response = await http.patch<LoyaltyProgramType>(
    `/program-type/${id}`,
    data
  );
  return response.data;
};

export const deleteLoyaltyProgramType = async (id: string): Promise<void> => {
  await http.delete(`/program-type/${id}`);
};

export const getTotalLoyaltyProgramTypes = async (): Promise<number> => {
  const response = await http.get<number>('/program-type/count');
  return response.data;
};
