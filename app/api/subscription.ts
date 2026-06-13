import { http } from './http';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';
import type {
  SubscriptionPlanDto,
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
  BusinessSubscriptionDto,
  CreateBusinessSubscriptionDto,
  UpgradeSubscriptionDto,
  InvoiceDto,
  PlanFeatures,
} from '@loyal-ix/loyalix-shared-types';

// Re-export shared types for use by dashboard components
export type {
  SubscriptionPlanDto,
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
  BusinessSubscriptionDto,
  CreateBusinessSubscriptionDto,
  UpgradeSubscriptionDto,
  InvoiceDto,
  PlanFeatures,
};

// ──────────────────────────────────────────
// Subscription Plans (Admin)
// ──────────────────────────────────────────

export const getSubscriptionPlans = async (): Promise<SubscriptionPlanDto[]> => {
  const response = await http.get<SubscriptionPlanDto[]>('/subscription-plans');
  return response.data;
};

export const createSubscriptionPlan = async (
  data: CreateSubscriptionPlanDto
): Promise<SubscriptionPlanDto> => {
  const response = await http.post<SubscriptionPlanDto>('/subscription-plans', data);
  return response.data;
};

export const updateSubscriptionPlan = async (
  id: string,
  data: UpdateSubscriptionPlanDto
): Promise<SubscriptionPlanDto> => {
  const response = await http.patch<SubscriptionPlanDto>(`/subscription-plans/${id}`, data);
  return response.data;
};

// ──────────────────────────────────────────
// Business Subscriptions
// ──────────────────────────────────────────

export const getBusinessSubscription = async (
  businessId: string
): Promise<BusinessSubscriptionDto> => {
  const response = await http.get<BusinessSubscriptionDto>(
    `/subscriptions/business/${businessId}`
  );
  return response.data;
};

export const subscribeBusiness = async (
  data: CreateBusinessSubscriptionDto
): Promise<{
  subscriptionId: string;
  status: string;
  clientSecret?: string;
  message?: string;
}> => {
  const response = await http.post('/subscriptions/subscribe', data);
  return response.data;
};

export const upgradeSubscription = async (
  businessId: string,
  data: UpgradeSubscriptionDto
): Promise<BusinessSubscriptionDto> => {
  const response = await http.patch<BusinessSubscriptionDto>(
    `/subscriptions/business/${businessId}/upgrade`,
    data
  );
  return response.data;
};

export const cancelSubscription = async (
  businessId: string
): Promise<BusinessSubscriptionDto> => {
  const response = await http.post<BusinessSubscriptionDto>(
    `/subscriptions/business/${businessId}/cancel`
  );
  return response.data;
};

// ──────────────────────────────────────────
// Invoices
// ──────────────────────────────────────────

export const getBusinessInvoices = async (
  businessId: string,
  params: PaginationParams = {}
): Promise<PaginatedResponse<InvoiceDto>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<InvoiceDto>>(
    `/invoices/business/${businessId}`,
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getInvoice = async (id: string): Promise<InvoiceDto> => {
  const response = await http.get<InvoiceDto>(`/invoices/${id}`);
  return response.data;
};
