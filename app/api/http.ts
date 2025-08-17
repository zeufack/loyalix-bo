import axios from 'axios';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { getSession } from 'next-auth/react';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NESTJS_API_URL
});

http.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default http;
