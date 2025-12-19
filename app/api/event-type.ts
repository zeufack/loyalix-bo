import { http } from './http';
import { EventType } from '@/types/event-type';
import { PaginationParams, PaginatedResponse } from './business';

export const getEventTypes = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<EventType>> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = params;
  const response = await http.get('/event-types', {
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
    data: response.data.eventTypes || response.data.data || [],
    total: response.data.total || 0,
    page,
    limit,
    totalPages: Math.ceil((response.data.total || 0) / limit)
  };
};

export const createEventType = async (data: Partial<EventType>): Promise<EventType> => {
  const response = await http.post('/event-types', data);
  return response.data;
};

export const updateEventType = async (id: string, data: Partial<EventType>): Promise<EventType> => {
  const response = await http.patch(`/event-types/${id}`, data);
  return response.data;
};

export const deleteEventType = async (id: string): Promise<void> => {
  await http.delete(`/event-types/${id}`);
};

export const getTotalEventTypes = async (): Promise<number> => {
  const response = await http.get('/event-types/count');
  return response.data;
};
