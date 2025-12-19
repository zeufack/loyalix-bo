import { Business } from '@/types/business';
import { http } from './http';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getBusinesses = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Business>> => {
  try {
    const { page = 1, limit = 10, sortBy, sortOrder } = params;
    const response = await http.get('/business', {
      params: { page, limit, sortBy, sortOrder }
    });
    // Handle both array response and paginated response
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        page: 1,
        limit: response.data.length,
        totalPages: 1
      };
    }
    // Backend returns { business: [], total: number }
    return {
      data: response.data.business || response.data.data || [],
      total: response.data.total || 0,
      page,
      limit,
      totalPages: Math.ceil((response.data.total || 0) / limit)
    };
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
};

export const createBusiness = async (
  data: Partial<Business>
): Promise<Business> => {
  try {
    const response = await http.post('/business', data);
    return response.data;
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }
};

export const updateBusiness = async (
  id: string,
  data: Partial<Business>
): Promise<Business> => {
  try {
    const response = await http.patch(`/business/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating business:', error);
    throw error;
  }
};

export const deleteBusiness = async (id: string): Promise<void> => {
  try {
    await http.delete(`/business/${id}`);
  } catch (error) {
    console.error('Error deleting business:', error);
    throw error;
  }
};

export const getTotalBusinesses = async (): Promise<number> => {
  try {
    const response = await http.get('/business/count');
    return response.data;
  } catch (error) {
    console.error('Error fetching total businesses:', error);
    throw error;
  }
};
