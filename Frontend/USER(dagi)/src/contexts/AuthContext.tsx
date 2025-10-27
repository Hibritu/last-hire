import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types/api';
import AuthService from '../services/authService';
import { toast } from '../hooks/use-toast';

// Authentication state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Authentication actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // Changed to false to allow immediate access to public pages
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

// Context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated and fetch user data
  const checkAuth = async (): Promise<void> => {
    try {
      if (AuthService.isAuthenticated()) {
        dispatch({ type: 'AUTH_START' });
        const user = await AuthService.getCurrentUser();
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        // No token - this is fine for browsing public pages
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.log('ℹ️ [AUTH] Auth check failed (this is normal if not logged in):', error);
      // Silently fail auth check - user can still browse public pages
      dispatch({ type: 'LOGOUT' });
      // Clear invalid tokens
      AuthService.logout();
    }
  };

  // Login function
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await AuthService.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${response.user.first_name}!`,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await AuthService.register(userData);
      
      // Some apps might require email verification before login
      if (response.token) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
        toast({
          title: 'Registration Successful',
          description: `Welcome to HireHub, ${response.user.first_name}!`,
        });
      } else {
        dispatch({ type: 'LOGOUT' });
        toast({
          title: 'Registration Successful',
          description: 'Please verify your email address to continue.',
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      dispatch({ type: 'LOGOUT' });
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await AuthService.forgotPassword({ email });
      
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your email for password reset instructions.',
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to send reset email';
      
      toast({
        title: 'Failed to Send Reset Email',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (token: string, password: string): Promise<void> => {
    try {
      await AuthService.resetPassword({ token, password });
      
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been reset. Please login with your new password.',
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Password reset failed';
      
      toast({
        title: 'Password Reset Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error;
    }
  };

  // Verify email function
  const verifyEmail = async (email: string, otp: string): Promise<void> => {
    try {
      await AuthService.verifyEmail({ email, otp });
      
      toast({
        title: 'Email Verified Successfully',
        description: 'Your email has been verified. You can now access all features.',
      });
      
      // Refresh user data after verification
      await checkAuth();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Email verification failed';
      
      toast({
        title: 'Email Verification Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error;
    }
  };

  // Update user function
  const updateUser = (userData: Partial<User>): void => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateUser,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for authentication requirement
interface RequireAuthProps {
  children: ReactNode;
  requiredRole?: string | string[];
  fallback?: ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  requiredRole,
  fallback = <div>Access denied</div>
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    // Redirect to login will be handled by protected routes
    return null;
  }

  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;
    
    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export default AuthContext;