import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Configuration for Admin Panel
export const API_CONFIG = {
  AUTH_BASE_URL: (process.env.NEXT_PUBLIC_AUTH_API_BASE_URL as string) || 'http://localhost:4000',
  JOBS_BASE_URL: (process.env.NEXT_PUBLIC_JOBS_API_BASE_URL as string) || 'http://localhost:4000',
  ADMIN_BASE_URL: (process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL as string) || 'http://localhost:4000',
  AUTH_HUB_URL: (process.env.NEXT_PUBLIC_AUTH_HUB_URL as string) || 'http://localhost:8080',
  TIMEOUT: 30000,
  TOKEN_STORAGE_KEY: (process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY as string) || 'hirehub_token',
  REFRESH_TOKEN_STORAGE_KEY: (process.env.NEXT_PUBLIC_REFRESH_TOKEN_STORAGE_KEY as string) || 'hirehub_refresh_token',
};

// Token management utilities
export const tokenManager = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY);
  },
  set: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_CONFIG.TOKEN_STORAGE_KEY, token);
    }
  },
  remove: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(API_CONFIG.TOKEN_STORAGE_KEY);
    }
  },
  getRefresh: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
  },
  setRefresh: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY, token);
    }
  },
  removeRefresh: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
    }
  },
  clear: (): void => {
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
    (config: InternalAxiosRequestConfig) => {
      const token = tokenManager.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log requests in development
      if ((process.env.NEXT_PUBLIC_DEBUG as string) === 'true') {
        console.log(`🚀 [ADMIN] ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        });
      }
      
      return config;
    },
    (error: AxiosError) => {
      console.error('❌ [ADMIN] Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log responses in development
      if ((process.env.NEXT_PUBLIC_DEBUG as string) === 'true') {
        console.log(`✅ [ADMIN] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }
      return response;
    },
    (error: AxiosError) => {
      // Log errors in development
      if ((process.env.NEXT_PUBLIC_DEBUG as string) === 'true') {
        console.error(`❌ [ADMIN] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }

      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401) {
        tokenManager.clear();
        // Redirect to authentication hub
        if (typeof window !== 'undefined') {
          window.location.href = `${API_CONFIG.AUTH_HUB_URL}/login`;
        }
      }

      // Handle network errors
      if (!error.response) {
        console.error('[ADMIN] Network error - Backend API server might be down');
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create API client instances
export const authApiClient = createApiClient(API_CONFIG.AUTH_BASE_URL);
export const jobsApiClient = createApiClient(API_CONFIG.JOBS_BASE_URL);
export const adminApiClient = createApiClient(API_CONFIG.ADMIN_BASE_URL);

// Generic API response types
export interface ApiResponse<T = unknown> {
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

  post: async <T>(url: string, data?: unknown, client: AxiosInstance = authApiClient): Promise<T> => {
    const response = await client.post<ApiResponse<T>>(url, data);
    return (response.data.data || response.data) as T;
  },

  put: async <T>(url: string, data?: unknown, client: AxiosInstance = authApiClient): Promise<T> => {
    const response = await client.put<ApiResponse<T>>(url, data);
    return (response.data.data || response.data) as T;
  },

  delete: async <T>(url: string, client: AxiosInstance = authApiClient): Promise<T> => {
    const response = await client.delete<ApiResponse<T>>(url);
    return (response.data.data || response.data) as T;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = tokenManager.get();
  if (!token) return false;

  try {
    // Basic token validation
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
  } catch (error) {
    // If token is malformed, remove it
    tokenManager.clear();
    return false;
  }
};

// Get current user's role
export const getCurrentUserRole = (): string | null => {
  const token = tokenManager.get();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch (error) {
    return null;
  }
};

// Get current user's ID
export const getCurrentUserId = (): string | null => {
  const token = tokenManager.get();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || payload.sub || null;
  } catch (error) {
    return null;
  }
};

// Redirect to auth hub if not authenticated
export const requireAuth = (): boolean => {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = `${API_CONFIG.AUTH_HUB_URL}/login`;
    }
    return false;
  }
  return true;
};

// Check if current user is an admin
export const requireAdminRole = (): boolean => {
  if (!requireAuth()) return false;
  
  const role = getCurrentUserRole();
  if (role !== 'admin') {
    console.error('[ADMIN] Access denied - user is not an admin');
    if (typeof window !== 'undefined') {
      alert('Access denied. This area is for administrators only.');
      window.location.href = `${API_CONFIG.AUTH_HUB_URL}/login`;
    }
    return false;
  }
  return true;
};

export default authApiClient;