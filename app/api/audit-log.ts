import { http } from './http';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse
} from './types';

export interface AuditLog {
  id: string;
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  action: string;
  entityType: string;
  entityId: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  description: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

export interface AuditLogFilters {
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const getAuditLogs = async (
  params: PaginationParams & AuditLogFilters = {}
): Promise<PaginatedResponse<AuditLog>> => {
  const { page = 1, limit = 50, sortBy, sortOrder, ...filters } = params;
  const response = await http.get<BackendPaginatedResponse<AuditLog>>(
    '/audit-logs',
    {
      params: { page, limit, sortBy, sortOrder, ...filters }
    }
  );
  return transformPaginatedResponse(response.data);
};

export const getAuditLog = async (id: string): Promise<AuditLog> => {
  const response = await http.get<AuditLog>(`/audit-logs/${id}`);
  return response.data;
};

export const getEntityHistory = async (
  entityType: string,
  entityId: string,
  params: PaginationParams = {}
): Promise<PaginatedResponse<AuditLog>> => {
  const { page = 1, limit = 50 } = params;
  const response = await http.get<BackendPaginatedResponse<AuditLog>>(
    `/audit-logs/entity/${entityType}/${entityId}`,
    { params: { page, limit } }
  );
  return transformPaginatedResponse(response.data);
};
