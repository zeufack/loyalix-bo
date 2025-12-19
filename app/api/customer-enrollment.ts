import { http } from './http';
import {
  CustomerEnrollment,
  CreateCustomerEnrollmentDto
} from '@/types/customer-enrollment';
import { PaginationParams, PaginatedResponse } from './business';

export const getCustomerEnrollments = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<CustomerEnrollment>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/customer-enrollment', {
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
    data: response.data.enrollments || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const getCustomerEnrollment = async (
  id: string
): Promise<CustomerEnrollment> => {
  const response = await http.get(`/customer-enrollment/${id}`);
  return response.data;
};

export const createCustomerEnrollment = async (
  data: CreateCustomerEnrollmentDto
): Promise<CustomerEnrollment> => {
  const response = await http.post('/customer-enrollment', data);
  return response.data;
};

export const updateCustomerEnrollment = async (
  id: string,
  data: Partial<CreateCustomerEnrollmentDto>
): Promise<CustomerEnrollment> => {
  const response = await http.patch(`/customer-enrollment/${id}`, data);
  return response.data;
};

export const deleteCustomerEnrollment = async (id: string): Promise<void> => {
  await http.delete(`/customer-enrollment/${id}`);
};

export const getTotalCustomerEnrollments = async (): Promise<number> => {
  const response = await http.get('/customer-enrollment/count');
  return response.data;
};
