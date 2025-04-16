import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY } from './auth';

// Create axios instance
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fix: Don't make interceptor function `async` directly
api.interceptors.request.use(
  (config) => {
    // Return a promise here, since `use()` expects sync return or Promise<Config>
    return AsyncStorage.getItem(AUTH_TOKEN_KEY).then(token => {
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { authService } = await import('./auth');
        const success = await authService.refreshToken();

        if (success) {
          const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);
