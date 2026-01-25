import { http } from './http';
import { EventType } from '@/types/event-type';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';

export const getEventTypes = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<EventType>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get<BackendPaginatedResponse<EventType>>(
    '/event-types',
    { params: { page, limit, sortBy, sortOrder } }
  );
  return transformPaginatedResponse(response.data);
};

export const getEventType = async (id: string): Promise<EventType> => {
  const response = await http.get<EventType>(`/event-types/${id}`);
  return response.data;
};

export const createEventType = async (
  data: Partial<EventType>
): Promise<EventType> => {
  const response = await http.post<EventType>('/event-types', data);
  return response.data;
};

export const updateEventType = async (
  id: string,
  data: Partial<EventType>
): Promise<EventType> => {
  const response = await http.patch<EventType>(`/event-types/${id}`, data);
  return response.data;
};

export const deleteEventType = async (id: string): Promise<void> => {
  await http.delete(`/event-types/${id}`);
};

export const getTotalEventTypes = async (): Promise<number> => {
  const response = await http.get<number>('/event-types/count');
  return response.data;
};
