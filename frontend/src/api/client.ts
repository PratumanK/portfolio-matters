import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Resolve base URL from environment; defaults to relative path so Vite proxy handles it in dev
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const TOKEN_STORAGE_KEY = 'portfolio_matters_jwt';
export const USER_STORAGE_KEY = 'portfolio_matters_user';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Attach JWT token to requests if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Gracefully handle 401 Unauthorized (expired or invalid token)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: any }>) => {
    if (error.response?.status === 401) {
      // Clear token and user on 401 if it's not a login attempt
      const isAuthEndpoint = error.config?.url?.includes('/auth/login');
      if (!isAuthEndpoint) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        // Only redirect if in browser and not already on an auth page
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) {
      return data.message;
    }
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map((e: any) => e.message || 'Validation error').join(', ');
    }
    if (error.response?.statusText) {
      return `${error.response.status}: ${error.response.statusText}`;
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
};
