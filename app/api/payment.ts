import { http } from './http';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';

export interface Payment {
  id: string;
  businessId: string;
  business?: {
    id: string;
    name: string;
  };
  subscriptionId: string | null;
  amount: number;
  currency: string;
  status: string;
  providerType: string;
  providerPaymentId: string;
  failureReason: string | null;
  refundedAmount: number;
  metadata: Record<string, unknown> | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const getPayments = async (
  params: PaginationParams & { status?: string; dateFrom?: string; dateTo?: string } = {}
): Promise<PaginatedResponse<Payment>> => {
  const { page = 1, limit = 10, sortBy, sortOrder, ...filters } = params;
  const response = await http.get<BackendPaginatedResponse<Payment>>('/payments', {
    params: { page, limit, sortBy, sortOrder, ...filters },
  });
  return transformPaginatedResponse(response.data);
};

export const getPayment = async (id: string): Promise<Payment> => {
  const response = await http.get<Payment>(`/payments/${id}`);
  return response.data;
};
