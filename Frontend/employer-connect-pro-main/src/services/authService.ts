import { apiWrapper, authApiClient, tokenManager, authUtils, API_CONFIG, checkBackendAvailability } from '../lib/api';

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  first_name?: string;
  last_name?: string;
  profileType?: 'individual' | 'company';
  verified: boolean;
  created_at?: string;
  updated_at?: string;
}

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
 * Centralized Authentication Service for Employer Connect Pro
 * Integrates with HireHub Ethiopia's centralized authentication system
 */
export class EmployerAuthService {
  private static isBackendAvailable = true;

  /**
   * Check backend availability and set flag
   */
  static async checkBackendAvailability(): Promise<void> {
    try {
      this.isBackendAvailable = await checkBackendAvailability(API_CONFIG.AUTH_BASE_URL);
      if (this.isBackendAvailable) {
        console.log('✅ [EMPLOYER AUTH] Backend is available');
      } else {
        console.warn('⚠️ [EMPLOYER AUTH] Backend unavailable, enabling mock fallback');
      }
    } catch (error) {
      console.warn('⚠️ [EMPLOYER AUTH] Backend unavailable, enabling mock fallback');
      this.isBackendAvailable = false;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return authUtils.isAuthenticated();
  }

  /**
   * Get current user role
   */
  static getCurrentUserRole(): string | null {
    return authUtils.getCurrentUserRole();
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      if (this.isBackendAvailable && this.isAuthenticated()) {
        // Employers should use /users/me (it works for all roles)
        const response = await apiWrapper.get<any>('/users/me', authApiClient);
        console.log('✅ [EMPLOYER AUTH] Current user loaded from backend:', response);
        
        // Transform backend response to match User interface
        const user: User = {
          id: response.id,
          email: response.email,
          role: response.role,
          name: `${response.first_name || ''} ${response.last_name || ''}`.trim() || response.email.split('@')[0],
          first_name: response.first_name,
          last_name: response.last_name,
          verified: response.is_verified || false,
          created_at: response.created_at,
          updated_at: response.updated_at
        };
        
        console.log('✅ [EMPLOYER AUTH] User transformed:', user);
        return user;
      } else {
        // Return user data from token for development
        const token = tokenManager.get();
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('🔧 [EMPLOYER AUTH] Loading user from token:', payload);
            return {
              id: payload.id || payload.user_id || payload.userId || 'unknown',
              email: payload.email || 'employer@hirehub.et',
              role: payload.role || 'employer',
              name: payload.name || (payload.first_name && payload.last_name ? `${payload.first_name} ${payload.last_name}` : 'Employer'),
              first_name: payload.first_name || payload.firstName || '',
              last_name: payload.last_name || payload.lastName || '',
              profileType: 'company',
              verified: payload.is_verified !== undefined ? payload.is_verified : true,
              created_at: payload.created_at || new Date().toISOString(),
              updated_at: payload.updated_at || new Date().toISOString()
            };
          } catch (e) {
            console.error('❌ [EMPLOYER AUTH] Failed to parse token:', e);
            return null;
          }
        }
        return null;
      }
    } catch (error) {
      console.error('❌ [EMPLOYER AUTH] Get user error:', error);
      // Fallback to token data on error
      const token = tokenManager.get();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔧 [EMPLOYER AUTH] Fallback: Loading user from token');
          return {
            id: payload.id || payload.user_id || payload.userId || 'unknown',
            email: payload.email || 'employer@hirehub.et',
            role: payload.role || 'employer',
            name: payload.name || (payload.first_name && payload.last_name ? `${payload.first_name} ${payload.last_name}` : 'Employer'),
            first_name: payload.first_name || payload.firstName || '',
            last_name: payload.last_name || payload.lastName || '',
            profileType: 'company',
            verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        } catch (e) {
          return null;
        }
      }
      return null;
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
          tokenManager.set(response.token);
          if (response.refresh_token) {
            tokenManager.setRefresh(response.refresh_token);
          }
        }

        console.log('✅ [EMPLOYER AUTH] Login successful');
        return response;
      } else {
        // Mock authentication for development
        console.log('🎭 [EMPLOYER AUTH] Using mock authentication');
        return this.mockLogin(credentials);
      }
    } catch (error) {
      console.error('❌ [EMPLOYER AUTH] Login error, falling back to mock:', error);
      return this.mockLogin(credentials);
    }
  }

  /**
   * Mock login for development/testing
   */
  private static mockLogin(credentials: LoginRequest): AuthResponse {
    console.log('🎭 [MOCK AUTH] Simulating employer login for:', credentials.email);

    // Generate mock JWT token
    const mockToken = this.generateMockToken(credentials.email, 'employer');
    tokenManager.set(mockToken);

    const mockResponse: AuthResponse = {
      token: mockToken,
      refresh_token: 'mock_refresh_token_' + Date.now(),
      user: {
        id: 'mock_employer_' + Date.now(),
        email: credentials.email,
        role: 'employer',
        name: credentials.email.split('@')[0],
        first_name: 'Mock',
        last_name: 'Employer',
        profileType: 'company',
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      message: 'Mock login successful - Backend unavailable'
    };

    console.log('✅ [MOCK AUTH] Mock login successful for employer');
    return mockResponse;
  }

  /**
   * Generate mock JWT token for testing (public method)
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
   * Logout user and redirect to auth hub
   */
  static async logout(): Promise<void> {
    try {
      console.log('🔓 [EMPLOYER AUTH] Logging out user...');

      if (this.isBackendAvailable && this.isAuthenticated()) {
        await apiWrapper.post('/auth/logout', {}, authApiClient);
      }
    } catch (error) {
      console.error('❌ [EMPLOYER AUTH] Logout error:', error);
    } finally {
      // Always clear local tokens
      tokenManager.clear();

      // Redirect to centralized auth hub with logout parameter
      console.log('🔄 [EMPLOYER AUTH] Redirecting to auth hub...');
      window.location.href = `${API_CONFIG.AUTH_HUB_URL}/login?from=logout`;
    }
  }

  /**
   * Check if user has access to employer features
   */
  static hasEmployerAccess(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'employer' || role === 'admin';
  }

  /**
   * Get authentication headers for manual API calls
   */
  static getAuthHeaders(): Record<string, string> {
    const token = tokenManager.get();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = tokenManager.getRefresh();
      if (!refreshToken || !this.isBackendAvailable) {
        return false;
      }

      const response = await apiWrapper.post<{ token: string }>('/auth/refresh', {
        refresh_token: refreshToken
      }, authApiClient);

      if (response.token) {
        tokenManager.set(response.token);
        console.log('✅ [EMPLOYER AUTH] Token refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ [EMPLOYER AUTH] Token refresh failed:', error);
      tokenManager.clear();
      return false;
    }
  }

  /**
   * Initialize authentication service
   */
  static async initialize(): Promise<void> {
    await this.checkBackendAvailability();
    
    // Check if user is already authenticated
    if (this.isAuthenticated()) {
      const role = this.getCurrentUserRole();
      if (role !== 'employer' && role !== 'admin') {
        console.warn('⚠️ [EMPLOYER AUTH] User does not have employer access, redirecting...');
        window.location.href = `${API_CONFIG.AUTH_HUB_URL}/login?from=unauthorized`;
      } else {
        console.log('✅ [EMPLOYER AUTH] User authenticated with employer access');
      }
    } else {
      console.log('⚠️ [EMPLOYER AUTH] User not authenticated, redirecting to auth hub...');
      window.location.href = `${API_CONFIG.AUTH_HUB_URL}/login?from=app`;
    }
  }
}

export default EmployerAuthService;