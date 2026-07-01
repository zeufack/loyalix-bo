import { http } from './http';
import { LoyaltyProgramTemplate } from '@/types/loyalty-program-template';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse
} from './types';
import type {
  InstantiateTemplateDto,
  InstantiatedProgramResponseDto,
  CreateLoyaltyProgramTemplateDto,
  UpdateLoyaltyProgramTemplateDto
} from '@loyal-ix/loyalix-shared-types';

export interface LoyaltyProgramTemplateQueryParams
  extends Omit<PaginationParams, 'q'> {
  businessTypeName?: string;
  isActive?: boolean;
}

export const getLoyaltyProgramTemplates = async (
  params: LoyaltyProgramTemplateQueryParams = {}
): Promise<PaginatedResponse<LoyaltyProgramTemplate>> => {
  const { page = 1, limit = 10, sortBy, sortOrder, businessTypeName, isActive } =
    params;
  const response = await http.get<BackendPaginatedResponse<LoyaltyProgramTemplate>>(
    '/loyalty-program-templates',
    { params: { page, limit, sortBy, sortOrder, businessTypeName, isActive } }
  );
  return transformPaginatedResponse(response.data);
};

export const getLoyaltyProgramTemplate = async (
  id: string
): Promise<LoyaltyProgramTemplate> => {
  const response = await http.get<LoyaltyProgramTemplate>(
    `/loyalty-program-templates/${id}`
  );
  return response.data;
};

export const createLoyaltyProgramTemplate = async (
  data: CreateLoyaltyProgramTemplateDto
): Promise<LoyaltyProgramTemplate> => {
  const response = await http.post<LoyaltyProgramTemplate>(
    '/loyalty-program-templates',
    data
  );
  return response.data;
};

export const updateLoyaltyProgramTemplate = async (
  id: string,
  data: UpdateLoyaltyProgramTemplateDto
): Promise<LoyaltyProgramTemplate> => {
  const response = await http.patch<LoyaltyProgramTemplate>(
    `/loyalty-program-templates/${id}`,
    data
  );
  return response.data;
};

export const deleteLoyaltyProgramTemplate = async (id: string): Promise<void> => {
  await http.delete(`/loyalty-program-templates/${id}`);
};

export const instantiateLoyaltyProgramTemplate = async (
  id: string,
  data: InstantiateTemplateDto
): Promise<InstantiatedProgramResponseDto> => {
  const response = await http.post<InstantiatedProgramResponseDto>(
    `/loyalty-program-templates/${id}/instantiate`,
    data
  );
  return response.data;
};
