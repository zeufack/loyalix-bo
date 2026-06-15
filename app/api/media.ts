import { http } from './http';

export interface MediaImage {
  id: string;
  url: string;
  publicId: string;
  folder: string;
  width: number;
  height: number;
  format: string;
  size: number;
  uploaderId: string;
  createdAt: Date;
}

export const uploadMedia = async (
  file: File,
  folder?: string
): Promise<MediaImage> => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) formData.append('folder', folder);

  const response = await http.post<MediaImage>('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getMedia = async (id: string): Promise<MediaImage> => {
  const response = await http.get<MediaImage>(`/media/${id}`);
  return response.data;
};

export const deleteMedia = async (id: string): Promise<{ message: string }> => {
  const response = await http.delete<{ message: string }>(`/media/${id}`);
  return response.data;
};
