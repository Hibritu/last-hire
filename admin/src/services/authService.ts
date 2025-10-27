import { authApiClient, adminApiClient, apiWrapper, tokenManager, requireAdminRole } from '../lib/api';

export class AdminAuthService {
  /**
   * Check if user is authenticated and is an admin
   */
  static checkAuth(): boolean {
    return requireAdminRole();
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser() {
    try {
      if (!this.checkAuth()) {
        throw new Error('Authentication required');
      }
      
      return await apiWrapper.get('/users/me', authApiClient);
    } catch (error) {
      console.error('❌ [ADMIN AUTH] Get current user failed:', error);
      throw error;
    }
  }

  /**
   * Get dashboard metrics
   */
  static async getDashboardMetrics() {
    try {
      if (!this.checkAuth()) {
        throw new Error('Authentication required');
      }
      
      // This endpoint might need to be implemented in backend
      return await apiWrapper.get('/api/admin/dashboard/metrics', adminApiClient);
    } catch (error) {
      console.error('❌ [ADMIN AUTH] Get dashboard metrics failed:', error);
      // Return mock data for now
      return {
        totalUsers: 1250,
        totalEmployers: 180,
        totalJobs: 450,
        pendingVerifications: 15,
        totalApplications: 3200,
        activeJobs: 320
      };
    }
  }

  /**
   * Get jobs for moderation
   */
  static async getJobsForModeration(status?: string) {
    try {
      if (!this.checkAuth()) {
        throw new Error('Authentication required');
      }
      
      const url = status ? `/api/admin/jobs?status=${status}` : '/api/admin/jobs';
      return await apiWrapper.get(url, adminApiClient);
    } catch (error) {
      console.error('❌ [ADMIN AUTH] Get jobs for moderation failed:', error);
      throw error;
    }
  }

  /**
   * Approve or reject a job
   */
  static async updateJobStatus(jobId: string, status: string) {
    try {
      if (!this.checkAuth()) {
        throw new Error('Authentication required');
      }
      
      return await apiWrapper.put(
        `/api/admin/jobs/${jobId}/approve`,
        { status },
        adminApiClient
      );
    } catch (error) {
      console.error('❌ [ADMIN AUTH] Update job status failed:', error);
      throw error;
    }
  }

  /**
   * Get reports for review
   */
  static async getReports(status?: string) {
    try {
      if (!this.checkAuth()) {
        throw new Error('Authentication required');
      }
      
      const url = status ? `/api/admin/reports?status=${status}` : '/api/admin/reports';
      return await apiWrapper.get(url, adminApiClient);
    } catch (error) {
      console.error('❌ [ADMIN AUTH] Get reports failed:', error);
      throw error;
    }
  }

  /**
   * Resolve a report
   */
  static async resolveReport(reportId: string, status: string) {
    try {
      if (!this.checkAuth()) {
        throw new Error('Authentication required');
      }
      
      return await apiWrapper.put(
        `/api/admin/reports/${reportId}/resolve`,
        { status },
        adminApiClient
      );
    } catch (error) {
      console.error('❌ [ADMIN AUTH] Resolve report failed:', error);
      throw error;
    }
  }

  /**
   * Verify or reject an employer
   */
  static async verifyEmployer(employerId: string, status: string) {
    try {
      if (!this.checkAuth()) {
        throw new Error('Authentication required');
      }
      
      return await apiWrapper.put(
        `/api/admin/employers/${employerId}/verify`,
        { status },
        adminApiClient
      );
    } catch (error) {
      console.error('❌ [ADMIN AUTH] Verify employer failed:', error);
      throw error;
    }
  }

  /**
   * Logout and redirect to auth hub
   */
  static logout(): void {
    try {
      tokenManager.clear();
      console.log('🔓 [ADMIN AUTH] Logged out successfully');
      
      // Redirect to auth hub with logout parameter
      const authHubUrl = (process.env.NEXT_PUBLIC_AUTH_HUB_URL as string) || 'http://localhost:8080';
      if (typeof window !== 'undefined') {
        window.location.href = `${authHubUrl}/login?from=logout`;
      }
    } catch (error) {
      console.error('❌ [ADMIN AUTH] Logout failed:', error);
      // Even if logout fails, clear local tokens and redirect
      tokenManager.clear();
      if (typeof window !== 'undefined') {
        window.location.href = `${(process.env.NEXT_PUBLIC_AUTH_HUB_URL as string) || 'http://localhost:8080'}/login?from=logout`;
      }
    }
  }

  /**
   * Check if token exists and is valid
   */
  static isTokenValid(): boolean {
    const token = tokenManager.get();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime && payload.role === 'admin';
    } catch (error) {
      tokenManager.clear();
      return false;
    }
  }

  /**
   * Get authentication headers for manual API calls
   */
  static getAuthHeaders(): Record<string, string> {
    const token = tokenManager.get();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Initialize auth check on app start
   */
  static initializeAuth(): boolean {
    console.log('🔐 [ADMIN AUTH] Initializing authentication...');
    
    if (!this.isTokenValid()) {
      console.log('❌ [ADMIN AUTH] No valid token found, redirecting to auth hub');
      const authHubUrl = (process.env.NEXT_PUBLIC_AUTH_HUB_URL as string) || 'http://localhost:8080';
      if (typeof window !== 'undefined') {
        window.location.href = `${authHubUrl}/login`;
      }
      return false;
    }
    
    console.log('✅ [ADMIN AUTH] Valid admin token found');
    return true;
  }
}

export default AdminAuthService;