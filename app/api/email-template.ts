import { http } from './http';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse
} from './types';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  description: string;
  templateType: string;
  status: string;
  defaultVariables: Record<string, string> | null;
  createdAt: Date;
  updatedAt: Date;
}

export const getEmailTemplates = async (
  params: PaginationParams & { status?: string; search?: string } = {}
): Promise<PaginatedResponse<EmailTemplate>> => {
  const { page = 1, limit = 10, sortBy, sortOrder, status, search } = params;
  const response = await http.get<BackendPaginatedResponse<EmailTemplate>>(
    '/email-templates',
    {
      params: { page, limit, sortBy, sortOrder, status, search }
    }
  );
  return transformPaginatedResponse(response.data);
};

export const getEmailTemplate = async (id: string): Promise<EmailTemplate> => {
  const response = await http.get<EmailTemplate>(`/email-templates/${id}`);
  return response.data;
};

export const createEmailTemplate = async (
  data: Partial<EmailTemplate>
): Promise<EmailTemplate> => {
  const response = await http.post<EmailTemplate>('/email-templates', data);
  return response.data;
};

export const updateEmailTemplate = async (
  id: string,
  data: Partial<EmailTemplate>
): Promise<EmailTemplate> => {
  const response = await http.patch<EmailTemplate>(
    `/email-templates/${id}`,
    data
  );
  return response.data;
};

export const deleteEmailTemplate = async (
  id: string
): Promise<{ message: string }> => {
  const response = await http.delete<{ message: string }>(
    `/email-templates/${id}`
  );
  return response.data;
};

export const previewEmailTemplate = async (
  id: string,
  variables: Record<string, string>
): Promise<{ subject: string; body: string }> => {
  const response = await http.post<{ subject: string; body: string }>(
    `/email-templates/${id}/preview`,
    { variables }
  );
  return response.data;
};
