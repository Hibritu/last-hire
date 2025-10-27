import { apiWrapper } from '../lib/api';

// Job Seeker API services following Ethiopian context requirements

/**
 * Authentication Services
 * Uses centralized auth from nodejs(Hibr) service on port 4000
 */
export const authService = {
  // Login job seeker
  login: async (email: string, password: string) => {
    return apiWrapper.post('/auth/login', { 
      email, 
      password, 
      role: 'job_seeker' 
    });
  },

  // Register new job seeker
  register: async (userData: any) => {
    return apiWrapper.post('/auth/register', {
      ...userData,
      role: 'job_seeker'
    });
  },

  // Get current user profile
  getProfile: async () => {
    return apiWrapper.get('/users/profile');
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    return apiWrapper.put('/users/profile', profileData);
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File) => {
    return apiWrapper.uploadFile('/users/profile/picture', file, 'picture');
  },

  // Upload resume
  uploadResume: async (file: File) => {
    return apiWrapper.uploadFile('/users/profile/resume', file, 'resume');
  }
};

/**
 * Job Search and Browsing Services
 * Uses NodeJS service on port 4001
 */
export const jobService = {
  // Search and browse jobs
  searchJobs: async (filters: any = {}) => {
    const queryParams = new URLSearchParams({
      ...filters,
      // Default to Ethiopian locations if not specified
      location: filters.location || 'Ethiopia'
    }).toString();
    return apiWrapper.get(`/api/jobs/search?${queryParams}`);
  },

  // Get job details
  getJobById: async (jobId: string) => {
    return apiWrapper.get(`/api/jobs/${jobId}`);
  },

  // Get featured jobs
  getFeaturedJobs: async (limit: number = 10) => {
    return apiWrapper.get(`/api/jobs/featured?limit=${limit}`);
  },

  // Get jobs by category
  getJobsByCategory: async (category: string, limit: number = 20) => {
    return apiWrapper.get(`/api/jobs/category/${category}?limit=${limit}`);
  },

  // Get job categories with Ethiopian context
  getJobCategories: async () => {
    return apiWrapper.get('/api/jobs/categories');
  },

  // Save job to favorites
  saveJob: async (jobId: string) => {
    return apiWrapper.post(`/api/jobs/${jobId}/save`);
  },

  // Remove job from favorites
  unsaveJob: async (jobId: string) => {
    return apiWrapper.delete(`/api/jobs/${jobId}/save`);
  },

  // Get saved jobs
  getSavedJobs: async () => {
    return apiWrapper.get('/api/jobs/saved');
  }
};

/**
 * Job Application Services
 */
export const applicationService = {
  // Submit job application with cover letter
  applyToJob: async (jobId: string, applicationData: any) => {
    return apiWrapper.post(`/api/jobs/${jobId}/apply`, {
      ...applicationData,
      applied_at: new Date().toISOString()
    });
  },

  // Get user's applications
  getMyApplications: async (filters: any = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiWrapper.get(`/api/applications/me${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get application status
  getApplicationStatus: async (applicationId: string) => {
    return apiWrapper.get(`/api/applications/${applicationId}/status`);
  },

  // Update application (if allowed)
  updateApplication: async (applicationId: string, applicationData: any) => {
    return apiWrapper.put(`/api/applications/${applicationId}`, applicationData);
  },

  // Withdraw application
  withdrawApplication: async (applicationId: string) => {
    return apiWrapper.delete(`/api/applications/${applicationId}`);
  },

  // Get application statistics
  getApplicationStats: async () => {
    return apiWrapper.get('/api/applications/my/stats');
  }
};

/**
 * User Profile and Dashboard Services
 */
export const profileService = {
  // Get user dashboard data
  getDashboardData: async () => {
    return apiWrapper.get('/users/dashboard');
  },

  // Update work experience
  updateExperience: async (experienceData: any[]) => {
    return apiWrapper.put('/users/profile/experience', { experience: experienceData });
  },

  // Update education
  updateEducation: async (educationData: any[]) => {
    return apiWrapper.put('/users/profile/education', { education: educationData });
  },

  // Update skills
  updateSkills: async (skills: string[]) => {
    return apiWrapper.put('/users/profile/skills', { skills });
  },

  // Update certifications
  updateCertifications: async (certifications: any[]) => {
    return apiWrapper.put('/users/profile/certifications', { certifications });
  },

  // Get profile completion percentage
  getProfileCompletion: async () => {
    return apiWrapper.get('/users/profile/completion');
  }
};

/**
 * Freelancer Services (for freelance marketplace)
 */
export const freelancerService = {
  // Get freelancer profiles
  getFreelancers: async (filters: any = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiWrapper.get(`/freelancers${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get freelancer profile
  getFreelancerById: async (freelancerId: string) => {
    return apiWrapper.get(`/freelancers/${freelancerId}`);
  },

  // Contact freelancer
  contactFreelancer: async (freelancerId: string, message: string) => {
    return apiWrapper.post(`/freelancers/${freelancerId}/contact`, { message });
  }
};

/**
 * Notification Services
 */
export const notificationService = {
  // Get user notifications
  getNotifications: async (limit: number = 20) => {
    return apiWrapper.get(`/users/notifications?limit=${limit}`);
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    return apiWrapper.put(`/users/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return apiWrapper.put('/users/notifications/read-all');
  },

  // Get unread notification count
  getUnreadCount: async () => {
    return apiWrapper.get('/users/notifications/unread-count');
  }
};

/**
 * Mock Data Fallback Services
 */
export const mockService = {
  // Check if backend is available
  checkBackendAvailability: async () => {
    try {
      // Use Jobs Service health check (will be proxied by Vite in dev)
      const healthUrl = import.meta.env.DEV ? '/health' : `${import.meta.env.VITE_API_BASE_URL}/health`;
      const response = await fetch(healthUrl);
      return response.ok;
    } catch (error) {
      console.warn('[USER] Backend unavailable, using mock data fallback');
      return false;
    }
  },

  // Get mock job seeker data (DEPRECATED - all mock data removed)
  getMockData: async () => {
    console.warn('[USER] Mock data is no longer available. Using real backend.');
    return {
      jobs: [],
      applications: [],
      profile: null,
      categories: []
    };
  }
};

// Export all services as a single object for easy importing
export default {
  auth: authService,
  jobs: jobService,
  applications: applicationService,
  profile: profileService,
  freelancers: freelancerService,
  notifications: notificationService,
  mock: mockService
};