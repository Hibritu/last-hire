// User and Authentication Types for Centralized Auth Hub
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'job_seeker' | 'employer' | 'admin';
  gender?: 'male' | 'female';
  education?: string;
  skills?: string;
  experience?: string;
  preferred_categories?: string;
  preferred_locations?: string;
  profile_picture?: string;
  resume?: string;
  created_at: string;
  updated_at: string;
  verified?: boolean;
  is_verified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'job_seeker' | 'employer';
}

export interface AuthResponse {
  user: User;
  token?: string;
  refresh_token?: string;
  message?: string;  // ✅ Added for backend messages
  needsVerification?: boolean;  // ✅ Added for signup flow
  emailSent?: boolean;  // ✅ Added for OTP email status
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

// ✅ NEW: Resend OTP request type
export interface ResendOtpRequest {
  email: string;
}

// ✅ NEW: Debug OTP response type
export interface DebugOtpResponse {
  otp: string;
  expires_at: string;
}

// Role-based redirect types
export type UserRole = 'job_seeker' | 'employer' | 'admin';

export interface RedirectConfig {
  role: UserRole;
  url: string;
  appName: string;
}

export const APP_REDIRECTS: Record<UserRole, RedirectConfig> = {
  job_seeker: {
    role: 'job_seeker',
    url: import.meta.env.VITE_USER_APP_URL || 'http://localhost:8081',
    appName: 'Job Seeker Dashboard'
  },
  employer: {
    role: 'employer', 
    url: import.meta.env.VITE_EMPLOYER_APP_URL || 'http://localhost:3000',
    appName: 'Employer Dashboard'
  },
  admin: {
    role: 'admin',
    url: import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:3001', 
    appName: 'Admin Panel'
  }
};

// Auth state for centralized auth
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  redirecting: boolean;
  targetApp?: string;
}

// Auth actions
export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'START_REDIRECT'; payload: { role: UserRole; appName: string } }
  | { type: 'COMPLETE_REDIRECT' };

// Login form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role: 'job_seeker' | 'employer';
  termsAccepted: boolean;
}

// Generic API types
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  error?: string;
  needsVerification?: boolean;
  email?: string;
}

// Validation schemas (for use with zod or similar)
export interface ValidationError {
  field: string;
  message: string;
}
