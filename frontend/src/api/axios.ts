import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const raw = window.localStorage.getItem('erp-auth');
    const token = raw ? JSON.parse(raw)?.state?.token : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.localStorage.removeItem('erp-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
