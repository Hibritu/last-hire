import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration for HireHub Ethiopia Integration
export const API_CONFIG = {
  // Use relative paths in development to leverage Vite proxy, absolute URLs in production
  AUTH_BASE_URL: import.meta.env.DEV ? '' : (import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:4000'),
  JOBS_BASE_URL: import.meta.env.DEV ? '' : (import.meta.env.VITE_JOBS_API_BASE_URL || 'http://localhost:4000'),
  PAYMENT_BASE_URL: import.meta.env.DEV ? '' : (import.meta.env.VITE_PAYMENT_API_BASE_URL || 'http://localhost:4000'),
  AUTH_HUB_URL: import.meta.env.VITE_AUTH_HUB_URL || 'http://localhost:3002',
  TIMEOUT: 30000,
  TOKEN_STORAGE_KEY: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'hirehub_token',
  REFRESH_TOKEN_STORAGE_KEY: import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'hirehub_refresh_token',
};

// Token management utilities with centralized auth support
export const tokenManager = {
  get: () => localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY),
  set: (token: string) => {
    localStorage.setItem(API_CONFIG.TOKEN_STORAGE_KEY, token);
    console.log('🔑 [EMPLOYER] Token stored for centralized auth');
  },
  remove: () => localStorage.removeItem(API_CONFIG.TOKEN_STORAGE_KEY),
  getRefresh: () => localStorage.getItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY),
  setRefresh: (token: string) => localStorage.setItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY, token),
  removeRefresh: () => localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY),
  clear: () => {
    tokenManager.remove();
    tokenManager.removeRefresh();
    console.log('🔑 [EMPLOYER] Tokens cleared');
  }
};

// Authentication status utilities
export const authUtils = {
  isAuthenticated: (): boolean => {
    const token = tokenManager.get();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      tokenManager.clear();
      return false;
    }
  },

  getCurrentUserRole: (): string | null => {
    const token = tokenManager.get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      return null;
    }
  },

  getCurrentUserId: (): string | null => {
    const token = tokenManager.get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.sub || null;
    } catch (error) {
      return null;
    }
  },

  getCurrentUserEmail: (): string | null => {
    const token = tokenManager.get();
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
    (config) => {
      const token = tokenManager.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log requests in development
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log(`🚀 [EMPLOYER API] ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        });
      }
      
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
      // Log responses in development
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log(`✅ [EMPLOYER API] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }
      return response;
    },
    (error: AxiosError) => {
      // Log errors in development
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.error(`❌ [EMPLOYER API] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }

      // Handle 401 errors (unauthorized) - only logout for token validation failures
      if (error.response?.status === 401) {
        const errorData = error.response?.data as any;
        const isTokenError = errorData?.error === 'Invalid token' || 
                            errorData?.error === 'No token provided' ||
                            errorData?.error === 'Token expired' ||
                            error.config?.url?.includes('/auth/login');
        
        if (isTokenError) {
          console.log('🔑 [EMPLOYER] Token invalid/expired, redirecting to auth hub');
          tokenManager.clear();
          window.location.href = `${API_CONFIG.AUTH_HUB_URL}/login?from=session-expired`;
        } else {
          console.warn('⚠️ [EMPLOYER] 401 error (not token related):', error.config?.url, errorData);
        }
        return Promise.reject(error);
      }

      // Handle network errors
      if (!error.response) {
        console.warn('🌐 [EMPLOYER] Network error - Backend API server might be down');
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

// Generic API wrapper functions with intelligent fallback
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
    // In development, use relative path to leverage Vite proxy
    const healthUrl = import.meta.env.DEV ? '/health' : `${serviceUrl}/health`;
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