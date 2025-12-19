import { Customer, CreateCustomerDto } from '@/types/customer';
import { http } from './http';
import { PaginationParams, PaginatedResponse } from './business';

export const getCustomers = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Customer>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/customer', {
    params: { page, limit, sortBy, sortOrder }
  });
  // Handle backend response format
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
    data: response.data.customers || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const createCustomer = async (
  data: CreateCustomerDto
): Promise<Customer> => {
  const response = await http.post('/customer', data);
  return response.data;
};

export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
): Promise<Customer> => {
  const response = await http.patch(`/customer/${id}`, data);
  return response.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await http.delete(`/customer/${id}`);
};

export const getTotalCustomers = async (): Promise<number> => {
  const response = await http.get('/customer/count');
  return response.data;
};
