import { authApiClient, tokenManager, roleRedirector, apiWrapper } from '../lib/api';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  UserRole,
  APP_REDIRECTS,
  ResendOtpRequest,
  DebugOtpResponse
} from '../types/auth';

export class CentralizedAuthService {
  /**
   * User login with automatic role-based redirect
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 [AUTH HUB] Starting login process for:', credentials.email);
    
    try {
      const response = await apiWrapper.post<AuthResponse>(
        '/auth/login',
        credentials,
        authApiClient
      );

      if (response.token) {
        tokenManager.set(response.token);
        if (response.refresh_token) {
          tokenManager.setRefresh(response.refresh_token);
        }
      }

      console.log('✅ [AUTH HUB] Backend login successful for user:', response.user.email);
      console.log('👤 [AUTH HUB] User role:', response.user.role);

      // Trigger role-based redirect
      this.handleRoleBasedRedirect(response.user.role as UserRole);

      return response;
    } catch (error: any) {
      console.error('❌ [AUTH HUB] Login failed:', error);
      throw error;
    }
  }

  /**
   * User registration
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('📝 [AUTH HUB] Starting registration process...');
      
      const response = await apiWrapper.post<AuthResponse>(
        '/auth/register',
        userData,
        authApiClient
      );

      // Don't store tokens on registration - user must verify email first
      console.log('✅ [AUTH HUB] Registration successful, verification required');
      
      return response;
    } catch (error) {
      console.error('❌ [AUTH HUB] Registration failed:', error);
      throw error;
    }
  }

  /**
   * Verify email with OTP
   */
  static async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    try {
      console.log('📨 [AUTH HUB] Verifying email...');
      
      const response = await apiWrapper.post<{ message: string }>(
        '/auth/verify-email',
        data,
        authApiClient
      );

      console.log('✅ [AUTH HUB] Email verification successful');
      return response;
    } catch (error) {
      console.error('❌ [AUTH HUB] Email verification failed:', error);
      throw error;
    }
  }

  /**
   * Resend OTP for email verification
   */
  static async resendOtp(data: ResendOtpRequest): Promise<{ message: string }> {
    try {
      console.log('🔄 [AUTH HUB] Resending OTP to:', data.email);
      
      const response = await apiWrapper.post<{ message: string }>(
        '/auth/resend-otp',
        data,
        authApiClient
      );

      console.log('✅ [AUTH HUB] OTP resent successfully');
      return response;
    } catch (error) {
      console.error('❌ [AUTH HUB] Resend OTP failed:', error);
      throw error;
    }
  }

  /**
   * Get debug OTP (development only)
   */
  static async getDebugOTP(email: string): Promise<DebugOtpResponse> {
    if (import.meta.env.VITE_DEBUG !== 'true') {
      throw new Error('Debug OTP is only available in development mode');
    }

    try {
      console.log('🔍 [AUTH HUB] Getting debug OTP for:', email);
      
      const response = await apiWrapper.get<DebugOtpResponse>(
        `/auth/debug-otp?email=${encodeURIComponent(email)}`,
        authApiClient
      );

      console.log('✅ [AUTH HUB] Debug OTP retrieved');
      return response;
    } catch (error) {
      console.error('❌ [AUTH HUB] Get debug OTP failed:', error);
      throw error;
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      console.log('📧 [AUTH HUB] Sending password reset email...');
      
      const response = await apiWrapper.post<{ message: string }>(
        '/auth/forgot-password',
        data,
        authApiClient
      );

      console.log('✅ [AUTH HUB] Password reset email sent');
      return response;
    } catch (error) {
      console.error('❌ [AUTH HUB] Forgot password failed:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      console.log('🔑 [AUTH HUB] Resetting password...');
      
      const response = await apiWrapper.post<{ message: string }>(
        '/auth/reset-password',
        data,
        authApiClient
      );

      console.log('✅ [AUTH HUB] Password reset successful');
      return response;
    } catch (error) {
      console.error('❌ [AUTH HUB] Reset password failed:', error);
      throw error;
    }
  }

  /**
   * Handle role-based redirect after successful authentication
   */
  static handleRoleBasedRedirect(role: UserRole): void {
    const redirectConfig = APP_REDIRECTS[role];
    
    if (!redirectConfig) {
      console.error('❌ [AUTH HUB] Unknown role for redirect:', role);
      return;
    }

    console.log(`🚀 [AUTH HUB] Redirecting ${role} to ${redirectConfig.appName}...`);
    console.log(`🌐 [AUTH HUB] Target URL: ${redirectConfig.url}`);

    const delay = parseInt(import.meta.env.VITE_REDIRECT_DELAY || '1500');
    roleRedirector.redirect(role, delay);
  }

  /**
   * User logout with cleanup
   */
  static async logout(): Promise<void> {
    try {
      console.log('🔓 [AUTH HUB] Logging out user...');
      tokenManager.clear();
      console.log('✅ [AUTH HUB] Logout successful');
    } catch (error) {
      console.error('❌ [AUTH HUB] Logout failed:', error);
      tokenManager.clear();
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
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
  }

  /**
   * Get current user's role
   */
  static getCurrentUserRole(): UserRole | null {
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
   * Check authentication and redirect if already authenticated
   */
  static checkAuthAndRedirect(): void {
    if (this.isAuthenticated()) {
      const role = this.getCurrentUserRole();
      if (role) {
        console.log('🔄 [AUTH HUB] User already authenticated, redirecting...');
        this.handleRoleBasedRedirect(role);
      }
    }
  }
}

export default CentralizedAuthService;
