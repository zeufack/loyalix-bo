import { http } from './http';
import { Activity } from '@/types/activity';

export const getActivities = async (): Promise<Activity[]> => {
  const response = await http.get('/activities');
  return response.data;
};
