import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration for Centralized Auth
export const API_CONFIG = {
  AUTH_BASE_URL: import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:4000',
  JOBS_BASE_URL: import.meta.env.VITE_JOBS_API_BASE_URL || 'http://localhost:4000',
  PAYMENT_BASE_URL: import.meta.env.VITE_PAYMENT_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
  TOKEN_STORAGE_KEY: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'hirehub_token',
  REFRESH_TOKEN_STORAGE_KEY: import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'hirehub_refresh_token',
};

// Frontend App URLs for Role-based Redirects
export const APP_URLS = {
  USER_APP: import.meta.env.VITE_USER_APP_URL || 'http://localhost:8081',
  EMPLOYER_APP: import.meta.env.VITE_EMPLOYER_APP_URL || 'http://localhost:3000',
  ADMIN_APP: import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:3001',
};

// Token management utilities with cross-app SSO support
export const tokenManager = {
  get: () => localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY),
  set: (token: string) => {
    localStorage.setItem(API_CONFIG.TOKEN_STORAGE_KEY, token);
    // If SSO is enabled, propagate token to other domains (future enhancement)
    if (import.meta.env.VITE_ENABLE_SSO === 'true') {
      console.log('SSO token set for cross-app authentication');
    }
  },
  remove: () => localStorage.removeItem(API_CONFIG.TOKEN_STORAGE_KEY),
  getRefresh: () => localStorage.getItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY),
  setRefresh: (token: string) => localStorage.setItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY, token),
  removeRefresh: () => localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_STORAGE_KEY),
  clear: () => {
    tokenManager.remove();
    tokenManager.removeRefresh();
  }
};

// Role-based redirect utility
export const roleRedirector = {
  redirect: (role: string, delay: number = 1000) => {
    if (import.meta.env.VITE_REDIRECT_AFTER_LOGIN !== 'true') {
      console.log('Auto-redirect is disabled');
      return;
    }

    let targetUrl: string;
    
    switch (role.toLowerCase()) {
      case 'job_seeker':
        targetUrl = APP_URLS.USER_APP;
        console.log('Redirecting job seeker to User App:', targetUrl);
        break;
      case 'employer':
        targetUrl = APP_URLS.EMPLOYER_APP;
        console.log('Redirecting employer to Employer App:', targetUrl);
        break;
      case 'admin':
        targetUrl = APP_URLS.ADMIN_APP;
        console.log('Redirecting admin to Admin App:', targetUrl);
        break;
      default:
        console.warn('Unknown role, no redirect:', role);
        return;
    }

    // Add ?from=auth parameter and token to help target app recognize auth redirect
    const token = tokenManager.get();
    const separator = targetUrl.includes('?') ? '&' : '?';
    const fullUrl = `${targetUrl}${separator}from=auth${token ? `&token=${encodeURIComponent(token)}` : ''}`;
    
    console.log('Full redirect URL (with token):', fullUrl.replace(token || '', '[TOKEN]'));

    // Add a delay for better UX
    setTimeout(() => {
      window.location.href = fullUrl;
    }, delay);
  },

  getRedirectUrl: (role: string): string => {
    switch (role.toLowerCase()) {
      case 'job_seeker':
        return APP_URLS.USER_APP;
      case 'employer':
        return APP_URLS.EMPLOYER_APP;
      case 'admin':
        return APP_URLS.ADMIN_APP;
      default:
        return '/';
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
        console.log(`🚀 [AUTH HUB] ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ [AUTH HUB] Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log responses in development
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log(`✅ [AUTH HUB] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }
      return response;
    },
    (error: AxiosError) => {
      // Log errors in development
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.error(`❌ [AUTH HUB] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }

      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401) {
        tokenManager.clear();
        console.log('Token expired, redirecting to login');
        // Stay on current page since this IS the login page
      }

      // Handle network errors
      if (!error.response) {
        console.error('Network error - Backend API server might be down');
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create API client instances
export const authApiClient = createApiClient(API_CONFIG.AUTH_BASE_URL);

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
  }
};

export default authApiClient;