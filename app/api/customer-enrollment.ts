import { http } from './http';
import {
  CustomerEnrollment,
  CreateCustomerEnrollmentDto,
} from '@/types/customer-enrollment';
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

export const getCustomerEnrollments = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<CustomerEnrollment>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<CustomerEnrollment>>(
    '/customer-enrollment',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getCustomerEnrollment = async (
  id: string
): Promise<CustomerEnrollment> => {
  const response = await http.get<CustomerEnrollment>(
    `/customer-enrollment/${id}`
  );
  return response.data;
};

export const createCustomerEnrollment = async (
  data: CreateCustomerEnrollmentDto
): Promise<CustomerEnrollment> => {
  const response = await http.post<CustomerEnrollment>(
    '/customer-enrollment',
    data
  );
  return response.data;
};

export const updateCustomerEnrollment = async (
  id: string,
  data: Partial<CreateCustomerEnrollmentDto>
): Promise<CustomerEnrollment> => {
  const response = await http.patch<CustomerEnrollment>(
    `/customer-enrollment/${id}`,
    data
  );
  return response.data;
};

export const deleteCustomerEnrollment = async (id: string): Promise<void> => {
  await http.delete(`/customer-enrollment/${id}`);
};

export const getTotalCustomerEnrollments = async (): Promise<number> => {
  const response = await http.get<number>('/customer-enrollment/count');
  return response.data;
};
