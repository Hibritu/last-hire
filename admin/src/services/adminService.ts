import { adminApiClient, apiWrapper } from '../lib/api';

/**
 * Admin Service
 * Handles all admin operations: fetching stats, managing users, moderating content
 */
export class AdminService {
  /**
   * Get dashboard metrics
   */
  static async getDashboardMetrics() {
    try {
      return await apiWrapper.get('/api/admin/dashboard/metrics', adminApiClient);
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Get dashboard metrics failed:', error);
      throw error;
    }
  }

  /**
   * Get all users with filtering
   */
  static async getAllUsers(params?: { role?: string; status?: string; search?: string; limit?: number; offset?: number }) {
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `/api/admin/users${queryParams ? `?${queryParams}` : ''}`;
      return await apiWrapper.get(url, adminApiClient);
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Get users failed:', error);
      throw error;
    }
  }

  /**
   * Update user status (suspend, activate, verify)
   */
  static async updateUserStatus(userId: string, status: string, reason?: string) {
    try {
      return await apiWrapper.put(
        `/api/admin/users/${userId}/status`,
        { status, reason },
        adminApiClient
      );
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Update user status failed:', error);
      throw error;
    }
  }

  /**
   * Get all employers with filtering
   */
  static async getAllEmployers(params?: { status?: string; search?: string; limit?: number; offset?: number }) {
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `/api/admin/employers${queryParams ? `?${queryParams}` : ''}`;
      return await apiWrapper.get(url, adminApiClient);
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Get employers failed:', error);
      throw error;
    }
  }

  /**
   * Verify or reject employer
   */
  static async verifyEmployer(employerId: string, status: string, reason?: string) {
    try {
      return await apiWrapper.put(
        `/api/admin/employers/${employerId}/verify`,
        { status, reason },
        adminApiClient
      );
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Verify employer failed:', error);
      throw error;
    }
  }

  /**
   * Get all jobs for moderation
   */
  static async getAllJobs(params?: { status?: string; search?: string; limit?: number; offset?: number }) {
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `/api/admin/jobs${queryParams ? `?${queryParams}` : ''}`;
      return await apiWrapper.get(url, adminApiClient);
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Get jobs failed:', error);
      throw error;
    }
  }

  /**
   * Approve, reject, or flag a job
   */
  static async approveJob(jobId: string, status: string, reason?: string) {
    try {
      return await apiWrapper.put(
        `/api/admin/jobs/${jobId}/approve`,
        { status, reason },
        adminApiClient
      );
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Approve job failed:', error);
      throw error;
    }
  }

  /**
   * Delete a job posting
   */
  static async deleteJob(jobId: string) {
    try {
      return await apiWrapper.delete(`/api/admin/jobs/${jobId}`, adminApiClient);
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Delete job failed:', error);
      throw error;
    }
  }

  /**
   * Get all applications
   */
  static async getAllApplications(params?: { status?: string; limit?: number; offset?: number }) {
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `/api/admin/applications${queryParams ? `?${queryParams}` : ''}`;
      return await apiWrapper.get(url, adminApiClient);
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Get applications failed:', error);
      throw error;
    }
  }

  /**
   * Get platform analytics
   */
  static async getAnalytics(period: number = 30) {
    try {
      return await apiWrapper.get(`/api/admin/analytics?period=${period}`, adminApiClient);
    } catch (error) {
      console.error('❌ [ADMIN SERVICE] Get analytics failed:', error);
      throw error;
    }
  }
}

export default AdminService;

