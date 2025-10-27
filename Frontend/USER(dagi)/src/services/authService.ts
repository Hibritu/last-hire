import { authApiClient, tokenManager, apiWrapper } from '../lib/api';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '../types/api';

export class AuthService {
  /**
   * User login
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiWrapper.post<AuthResponse>(
        '/auth/login',
        credentials,
        authApiClient
      );

      // Store tokens
      if (response.token) {
        tokenManager.set(response.token);
        if (response.refresh_token) {
          tokenManager.setRefresh(response.refresh_token);
        }
      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * User registration
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiWrapper.post<AuthResponse>(
        '/auth/register',
        userData,
        authApiClient
      );

      // Store tokens if provided (some apps require email verification first)
      if (response.token) {
        tokenManager.set(response.token);
        if (response.refresh_token) {
          tokenManager.setRefresh(response.refresh_token);
        }
      }

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * User logout
   */
  static async logout(): Promise<void> {
    try {
      console.log('🔓 [USER AUTH] Logging out user...');
      
      // Clear tokens from storage
      tokenManager.clear();
      
      // Optional: Call logout endpoint to invalidate token on server
      // await apiWrapper.post('/auth/logout', {}, authApiClient);
      
      console.log('✅ [USER AUTH] Logout successful, redirecting to auth hub');
      
      // Redirect to centralized auth hub with logout parameter
      window.location.href = 'http://localhost:3002/login?from=logout';
    } catch (error) {
      console.error('❌ [USER AUTH] Logout failed:', error);
      // Even if server logout fails, clear local tokens
      tokenManager.clear();
      window.location.href = 'http://localhost:3002/login?from=logout';
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      return await apiWrapper.post<{ message: string }>(
        '/auth/forgot-password',
        data,
        authApiClient
      );
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      return await apiWrapper.post<{ message: string }>(
        '/auth/reset-password',
        data,
        authApiClient
      );
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  }

  /**
   * Verify email with OTP
   */
  static async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    try {
      return await apiWrapper.post<{ message: string }>(
        '/auth/verify-email',
        data,
        authApiClient
      );
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    try {
      return await apiWrapper.get<User>('/users/me', authApiClient);
    } catch (error) {
      console.error('Get current user failed:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = tokenManager.get();
    if (!token) return false;

    try {
      // Basic token validation (you might want to add expiry check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      // If token is malformed, remove it
      tokenManager.clear();
      return false;
    }
  }

  /**
   * Get current user's role
   */
  static getCurrentUserRole(): string | null {
    const token = tokenManager.get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get current user's ID
   */
  static getCurrentUserId(): string | null {
    const token = tokenManager.get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.sub || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh authentication token (if supported by backend)
   */
  static async refreshToken(): Promise<string> {
    try {
      const refreshToken = tokenManager.getRefresh();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiWrapper.post<{ token: string }>(
        '/auth/refresh',
        { refresh_token: refreshToken },
        authApiClient
      );

      // Update stored token
      tokenManager.set(response.token);
      
      return response.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, user needs to login again
      tokenManager.clear();
      throw error;
    }
  }

  /**
   * Get debug OTP (development only)
   */
  static async getDebugOTP(email: string): Promise<{ otp: string }> {
    if (import.meta.env.VITE_DEBUG !== 'true') {
      throw new Error('Debug OTP is only available in development mode');
    }

    try {
      return await apiWrapper.get<{ otp: string }>(
        `/auth/debug-otp?email=${encodeURIComponent(email)}`,
        authApiClient
      );
    } catch (error) {
      console.error('Get debug OTP failed:', error);
      throw error;
    }
  }

  /**
   * Validate user permissions
   */
  static hasPermission(requiredRole: string | string[]): boolean {
    const userRole = this.getCurrentUserRole();
    if (!userRole) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }

    return userRole === requiredRole;
  }

  /**
   * Get authentication headers for manual API calls
   */
  static getAuthHeaders(): Record<string, string> {
    const token = tokenManager.get();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default AuthService;