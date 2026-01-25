import { Customer } from '@/types/customer';
import { http } from './http';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';
import type { CreateCustomerDto, UpdateCustomerDto } from '@loyal-ix/loyalix-shared-types';

export const getCustomers = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Customer>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<Customer>>(
    '/customer',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getCustomer = async (id: string): Promise<Customer> => {
  const response = await http.get<Customer>(`/customer/${id}`);
  return response.data;
};

export const createCustomer = async (
  data: CreateCustomerDto
): Promise<Customer> => {
  const response = await http.post<Customer>('/customer', data);
  return response.data;
};

export const updateCustomer = async (
  id: string,
  data: UpdateCustomerDto
): Promise<Customer> => {
  const response = await http.patch<Customer>(`/customer/${id}`, data);
  return response.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await http.delete(`/customer/${id}`);
};

export const getTotalCustomers = async (): Promise<number> => {
  const response = await http.get<number>('/customer/count');
  return response.data;
};
