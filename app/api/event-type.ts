import { http } from './http';
import { EventType } from '@/types/event-type';

export const getEventTypes = async (): Promise<EventType[]> => {
  const response = await http.get('/event-types');
  return response.data;
};

export const createEventType = async (data: Partial<EventType>): Promise<EventType> => {
  const response = await http.post('/event-types', data);
  return response.data;
};

export const updateEventType = async (id: string, data: Partial<EventType>): Promise<EventType> => {
  const response = await http.put(`/event-types/${id}`, data);
  return response.data;
};

export const deleteEventType = async (id: string): Promise<void> => {
  await http.delete(`/event-types/${id}`);
};

export const getTotalEventTypes = async (): Promise<number> => {
  const response = await http.get('/event-types/count');
  return response.data;
};
