import { Business } from '@/types/business';
import { http } from './http';

export const getBusinesses = async (): Promise<Business[]> => {
  try {
    const response = await http.get('/business');
    return response.data;
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error; // Re-throw the error so the calling component can handle it
  }
};

export const createBusiness = async (data: Partial<Business>): Promise<Business> => {
  try {
    const response = await http.post('/business', data);
    return response.data;
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }
};

export const updateBusiness = async (id: string, data: Partial<Business>): Promise<Business> => {
  try {
    const response = await http.put(`/business/${id}`, data);
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
