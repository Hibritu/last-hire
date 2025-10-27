import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

// API Configuration for HireHub Ethiopia Integration
export const API_CONFIG = {
  AUTH_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000',
  JOBS_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000',
  PAYMENT_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000',
  AUTH_HUB_URL: process.env.AUTH_HUB_URL || 'http://localhost:3002',
  TIMEOUT: 30000,
  TOKEN_STORAGE_KEY: 'hirehub_employer_token',
  REFRESH_TOKEN_STORAGE_KEY: 'hirehub_employer_refresh_token',
};

// Token management utilities with SecureStore
export const tokenManager = {
  get: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(API_CONFIG.TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
  
  set: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(API_CONFIG.TOKEN_STORAGE_KEY, token);
      console.log('🔑 [EMPLOYER] Token stored securely');
    } catch (error) {
      console.error('Error storing token:', error);
    }
  },
  
  remove: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(API_CONFIG.TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },
  
  getRefresh: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },
  
  setRefresh: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('Error storing refresh token:', error);
    }
  },
  
  removeRefresh: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing refresh token:', error);
    }
  },
  
  clear: async (): Promise<void> => {
    await tokenManager.remove();
    await tokenManager.removeRefresh();
    console.log('🔑 [EMPLOYER] Tokens cleared');
  }
};

// Authentication status utilities
export const authUtils = {
  isAuthenticated: async (): Promise<boolean> => {
    const token = await tokenManager.get();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      await tokenManager.clear();
      return false;
    }
  },

  getCurrentUserRole: async (): Promise<string | null> => {
    const token = await tokenManager.get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      return null;
    }
  },

  getCurrentUserId: async (): Promise<string | null> => {
    const token = await tokenManager.get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.sub || null;
    } catch (error) {
      return null;
    }
  },

  getCurrentUserEmail: async (): Promise<string | null> => {
    const token = await tokenManager.get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || null;
    } catch (error) {
      return null;
    }
  }
};

// Create API client
export const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    async (config) => {
      const token = await tokenManager.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      console.log(`🚀 [EMPLOYER API] ${config.method?.toUpperCase()} ${config.url}`);
      
      return config;
    },
    (error) => {
      console.error('❌ [EMPLOYER API] Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ [EMPLOYER API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
      return response;
    },
    async (error: AxiosError) => {
      console.error(`❌ [EMPLOYER API] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);

      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401) {
        console.log('🔑 [EMPLOYER] Token expired, clearing tokens');
        await tokenManager.clear();
        // In mobile app, navigate to login screen (handled by navigation)
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create API client instances
export const authApiClient = createApiClient(API_CONFIG.AUTH_BASE_URL);
export const jobsApiClient = createApiClient(API_CONFIG.JOBS_BASE_URL);
export const paymentApiClient = createApiClient(API_CONFIG.PAYMENT_BASE_URL);

// Generic API response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Generic API wrapper functions
export const apiWrapper = {
  get: async <T>(url: string, client: AxiosInstance = authApiClient): Promise<T> => {
    const response = await client.get<ApiResponse<T>>(url);
    return (response.data.data || response.data) as T;
  },

  post: async <T>(url: string, data?: any, client: AxiosInstance = authApiClient): Promise<T> => {
    const response = await client.post<ApiResponse<T>>(url, data);
    return (response.data.data || response.data) as T;
  },

  put: async <T>(url: string, data?: any, client: AxiosInstance = authApiClient): Promise<T> => {
    const response = await client.put<ApiResponse<T>>(url, data);
    return (response.data.data || response.data) as T;
  },

  delete: async <T>(url: string, client: AxiosInstance = authApiClient): Promise<T> => {
    const response = await client.delete<ApiResponse<T>>(url);
    return (response.data.data || response.data) as T;
  },

  patch: async <T>(url: string, data?: any, client: AxiosInstance = authApiClient): Promise<T> => {
    const response = await client.patch<ApiResponse<T>>(url, data);
    return (response.data.data || response.data) as T;
  }
};

// Backend availability checker
export const checkBackendAvailability = async (serviceUrl?: string): Promise<boolean> => {
  try {
    const healthUrl = `${serviceUrl}/health`;
    const response = await axios.get(healthUrl, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.warn(`🔴 [EMPLOYER] Backend service unavailable`);
    return false;
  }
};

export default {
  API_CONFIG,
  tokenManager,
  authUtils,
  authApiClient,
  jobsApiClient,
  paymentApiClient,
  apiWrapper,
  checkBackendAvailability
};


