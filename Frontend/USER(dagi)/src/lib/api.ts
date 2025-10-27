import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
export const API_CONFIG = {
  // Use relative paths for Vite proxy in development, absolute URLs in production
  BASE_URL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001'),
  AUTH_BASE_URL: import.meta.env.DEV ? '' : (import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:4000'),
  PAYMENT_BASE_URL: import.meta.env.DEV ? '' : (import.meta.env.VITE_PAYMENT_API_BASE_URL || 'http://localhost:8080'),
  TIMEOUT: 30000,
  TOKEN_STORAGE_KEY: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'hirehub_token',
  REFRESH_TOKEN_STORAGE_KEY: import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'hirehub_refresh_token',
};

// Token management utilities
export const tokenManager = {
  get: () => localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY),
  set: (token: string) => localStorage.setItem(API_CONFIG.TOKEN_STORAGE_KEY, token),
  remove: () => localStorage.removeItem(API_CONFIG.TOKEN_STORAGE_KEY),
  getRefresh: () => localStorage.getItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY),
  setRefresh: (token: string) => localStorage.setItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY, token),
  removeRefresh: () => localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY),
  clear: () => {
    tokenManager.remove();
    tokenManager.removeRefresh();
  }
};

// Create API instances
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
    (config) => {
      const token = tokenManager.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log requests in development
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log responses in development
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }
      return response;
    },
    (error: AxiosError) => {
      // Log errors in development
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }

      // Handle 401 errors (unauthorized)
      // Job seekers can browse without login, only show error for protected actions
      if (error.response?.status === 401) {
        const isProtectedAction = error.config?.url?.includes('/apply') || 
                                  error.config?.url?.includes('/applications') ||
                                  error.config?.url?.includes('/profile') ||
                                  error.config?.url?.includes('/save');
        
        if (isProtectedAction) {
          console.warn('⚠️ [USER] Authentication required for this action');
          // DON'T clear token automatically - let component handle redirect
          // tokenManager.clear();
        } else {
          // For browsing, just log and continue
          console.log('ℹ️ [USER] 401 on non-protected endpoint, continuing...');
        }
      }

      // Handle network errors
      if (!error.response) {
        console.error('Network error - API server might be down');
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create specific API clients
export const apiClient = createApiClient(API_CONFIG.BASE_URL);
export const authApiClient = createApiClient(API_CONFIG.AUTH_BASE_URL);
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
  get: async <T>(url: string, client: AxiosInstance = apiClient): Promise<T> => {
    const response = await client.get<ApiResponse<T>>(url);
    return (response.data.data || response.data) as T;
  },

  post: async <T>(url: string, data?: any, client: AxiosInstance = apiClient): Promise<T> => {
    const response = await client.post<ApiResponse<T>>(url, data);
    return (response.data.data || response.data) as T;
  },

  put: async <T>(url: string, data?: any, client: AxiosInstance = apiClient): Promise<T> => {
    const response = await client.put<ApiResponse<T>>(url, data);
    return (response.data.data || response.data) as T;
  },

  delete: async <T>(url: string, client: AxiosInstance = apiClient): Promise<T> => {
    const response = await client.delete<ApiResponse<T>>(url);
    return (response.data.data || response.data) as T;
  },

  // File upload wrapper
  uploadFile: async <T>(
    url: string, 
    file: File, 
    fieldName: string = 'file',
    additionalData?: Record<string, any>,
    client: AxiosInstance = apiClient
  ): Promise<T> => {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return (response.data.data || response.data) as T;
  }
};

// Convenience function for simple API requests
export const apiRequest = async <T = any>(url: string, options?: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  client?: AxiosInstance;
}): Promise<ApiResponse<T>> => {
  const { method = 'GET', data, client = apiClient } = options || {};
  
  let response: AxiosResponse<ApiResponse<T>>;
  
  switch (method) {
    case 'POST':
      response = await client.post<ApiResponse<T>>(url, data);
      break;
    case 'PUT':
      response = await client.put<ApiResponse<T>>(url, data);
      break;
    case 'DELETE':
      response = await client.delete<ApiResponse<T>>(url);
      break;
    default:
      response = await client.get<ApiResponse<T>>(url);
  }
  
  return response.data;
};

// Export default client
export default apiClient;