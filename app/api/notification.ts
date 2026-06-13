import { http } from './http';
import {
  PaginationParams,
  PaginatedResponse,
  BackendPaginatedResponse,
  transformPaginatedResponse,
} from './types';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: Date | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export const getNotifications = async (
  params: PaginationParams & { status?: 'read' | 'unread' } = {}
): Promise<PaginatedResponse<Notification>> => {
  const { page = 1, limit = 10, sortBy, sortOrder, status } = params;
  const response = await http.get<BackendPaginatedResponse<Notification>>('/notifications/me', {
    params: { page, limit, sortBy, sortOrder, status },
  });
  return transformPaginatedResponse(response.data);
};

export const getNotification = async (id: string): Promise<Notification> => {
  const response = await http.get<Notification>(`/notifications/${id}`);
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await http.get<number>('/notifications/me/unread-count');
  return response.data;
};

export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await http.patch<Notification>(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async (): Promise<{ updated: number }> => {
  const response = await http.patch<{ updated: number }>('/notifications/me/read-all');
  return response.data;
};

export const deleteNotification = async (id: string): Promise<{ message: string }> => {
  const response = await http.delete<{ message: string }>(`/notifications/${id}`);
  return response.data;
};
