import { http } from './http';
import { Promotion } from '@/types/promotion';

export const getPromotions = async (): Promise<Promotion[]> => {
  const response = await http.get('/promotions');
  return response.data;
};

export const createPromotion = async (data: Partial<Promotion>): Promise<Promotion> => {
  const response = await http.post('/promotions', data);
  return response.data;
};

export const updatePromotion = async (id: string, data: Partial<Promotion>): Promise<Promotion> => {
  const response = await http.put(`/promotions/${id}`, data);
  return response.data;
};

export const deletePromotion = async (id: string): Promise<void> => {
  await http.delete(`/promotions/${id}`);
};

export const getTotalPromotions = async (): Promise<number> => {
  const response = await http.get('/promotions/count');
  return response.data;
};
