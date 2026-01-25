import { http } from './http';
import { LoyaltyProgram } from '@/types/loyalty-program';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';
import type { CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto } from '@loyal-ix/loyalix-shared-types';

export const getLoyaltyPrograms = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<LoyaltyProgram>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<LoyaltyProgram>>(
    '/loyalty-program',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getLoyaltyProgram = async (id: string): Promise<LoyaltyProgram> => {
  const response = await http.get<LoyaltyProgram>(`/loyalty-program/${id}`);
  return response.data;
};

export const createLoyaltyProgram = async (
  data: CreateLoyaltyProgramDto
): Promise<LoyaltyProgram> => {
  const response = await http.post<LoyaltyProgram>('/loyalty-program', data);
  return response.data;
};

export const updateLoyaltyProgram = async (
  id: string,
  data: UpdateLoyaltyProgramDto
): Promise<LoyaltyProgram> => {
  const response = await http.patch<LoyaltyProgram>(
    `/loyalty-program/${id}`,
    data
  );
  return response.data;
};

export const deleteLoyaltyProgram = async (id: string): Promise<void> => {
  await http.delete(`/loyalty-program/${id}`);
};

export const getTotalLoyaltyPrograms = async (): Promise<number> => {
  const response = await http.get<number>('/loyalty-program/count');
  return response.data;
};
