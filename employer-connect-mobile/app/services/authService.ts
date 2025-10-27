import { apiWrapper, authApiClient, tokenManager, authUtils, API_CONFIG, checkBackendAvailability } from '../lib/api';
import { User, mockCurrentUser } from '../lib/mockData';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refresh_token?: string;
  user: User;
  message: string;
}

/**
 * Authentication Service for Employer Connect Mobile
 * TODO: Remove mock fallbacks when integrating with backend
 */
export class AuthService {
  private static isBackendAvailable = false;

  /**
   * Check backend availability
   */
  static async checkBackendAvailability(): Promise<void> {
    try {
      this.isBackendAvailable = await checkBackendAvailability(API_CONFIG.AUTH_BASE_URL);
      if (this.isBackendAvailable) {
        console.log('✅ [AUTH] Backend is available');
      } else {
        console.warn('⚠️ [AUTH] Backend unavailable, using mock data');
      }
    } catch (error) {
      console.warn('⚠️ [AUTH] Backend unavailable, using mock data');
      this.isBackendAvailable = false;
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    return await authUtils.isAuthenticated();
  }

  /**
   * Get current user role
   */
  static async getCurrentUserRole(): Promise<string | null> {
    return await authUtils.getCurrentUserRole();
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      if (this.isBackendAvailable && await this.isAuthenticated()) {
        const response = await apiWrapper.get<User>('/users/me', authApiClient);
        return response;
      } else {
        // Return mock user data
        console.log('🎭 [AUTH] Using mock user data');
        return mockCurrentUser;
      }
    } catch (error) {
      console.error('❌ [AUTH] Get user error:', error);
      return mockCurrentUser;
    }
  }

  /**
   * Login user (primarily used for token validation)
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      if (this.isBackendAvailable) {
        const response = await apiWrapper.post<AuthResponse>('/auth/login', {
          ...credentials,
          role: 'employer'
        }, authApiClient);

        if (response.token) {
          await tokenManager.set(response.token);
          if (response.refresh_token) {
            await tokenManager.setRefresh(response.refresh_token);
          }
        }

        console.log('✅ [AUTH] Login successful');
        return response;
      } else {
        // Mock authentication
        return this.mockLogin(credentials);
      }
    } catch (error) {
      console.error('❌ [AUTH] Login error, falling back to mock:', error);
      return this.mockLogin(credentials);
    }
  }

  /**
   * Mock login for development/testing
   * TODO: Remove when backend is integrated
   */
  private static async mockLogin(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🎭 [MOCK AUTH] Simulating employer login for:', credentials.email);

    // Generate mock JWT token
    const mockToken = this.generateMockToken(credentials.email, 'employer');
    await tokenManager.set(mockToken);

    const mockResponse: AuthResponse = {
      token: mockToken,
      refresh_token: 'mock_refresh_token_' + Date.now(),
      user: {
        ...mockCurrentUser,
        email: credentials.email
      },
      message: 'Mock login successful - Backend unavailable'
    };

    console.log('✅ [MOCK AUTH] Mock login successful');
    return mockResponse;
  }

  /**
   * Generate mock JWT token for testing
   */
  static generateMockToken(email: string, role: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      user_id: 'mock_employer_' + Date.now(),
      email: email,
      role: role,
      name: email.split('@')[0],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = 'mock_signature_employer';

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      console.log('🔓 [AUTH] Logging out user...');

      if (this.isBackendAvailable && await this.isAuthenticated()) {
        await apiWrapper.post('/auth/logout', {}, authApiClient);
      }
    } catch (error) {
      console.error('❌ [AUTH] Logout error:', error);
    } finally {
      // Always clear local tokens
      await tokenManager.clear();
      console.log('✅ [AUTH] Logout successful');
    }
  }

  /**
   * Check if user has employer access
   */
  static async hasEmployerAccess(): Promise<boolean> {
    const role = await this.getCurrentUserRole();
    return role === 'employer' || role === 'admin';
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await tokenManager.getRefresh();
      if (!refreshToken || !this.isBackendAvailable) {
        return false;
      }

      const response = await apiWrapper.post<{ token: string }>('/auth/refresh', {
        refresh_token: refreshToken
      }, authApiClient);

      if (response.token) {
        await tokenManager.set(response.token);
        console.log('✅ [AUTH] Token refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ [AUTH] Token refresh failed:', error);
      await tokenManager.clear();
      return false;
    }
  }

  /**
   * Initialize authentication service
   */
  static async initialize(): Promise<void> {
    await this.checkBackendAvailability();
    console.log('✅ [AUTH] Authentication service initialized');
  }
}

export default AuthService;


