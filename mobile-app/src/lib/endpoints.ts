// Central API endpoints for mobile app — keep in sync with USER(dagi) web app.
// Update API_BASE_URL to the origin of the web app (dev or production).

// API Configuration - Match web app structure
const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000',
  AUTH_BASE_URL: process.env.AUTH_API_BASE_URL || 'http://localhost:4000',
  PAYMENT_BASE_URL: process.env.PAYMENT_API_BASE_URL || 'http://localhost:8080',
  JOBS_BASE_URL: process.env.JOBS_API_BASE_URL || 'http://localhost:4001',
};

function build(path: string, baseUrlKey: keyof typeof API_CONFIG = 'BASE_URL') {
  const baseUrl = API_CONFIG[baseUrlKey];
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function buildJobs(path: string) {
  return build(path, 'JOBS_BASE_URL');
}

function buildAuth(path: string) {
  return build(path, 'AUTH_BASE_URL');
}

export const endpoints = {
  // Auth Services
  auth: {
    login: () => buildAuth("/auth/login"),
    register: () => buildAuth("/auth/register"),
    me: () => buildAuth("/users/profile"),
    logout: () => buildAuth("/auth/logout"),
  },

  // User Profile Services
  profile: {
    me: () => build("/users/profile"),
    update: () => build("/users/profile"), // PUT/PATCH
    photoUpload: () => build("/users/profile/picture"), // POST (multipart)
    resumeUpload: () => build("/users/profile/resume"), // POST (multipart)
    dashboard: () => build("/users/dashboard"),
    experience: () => build("/users/profile/experience"),
    education: () => build("/users/profile/education"),
    skills: () => build("/users/profile/skills"),
    certifications: () => build("/users/profile/certifications"),
    completion: () => build("/users/profile/completion"),
  },

  // Job Search and Browsing Services
  jobs: {
    list: () => buildJobs("/api/jobs"),
    featured: () => buildJobs("/api/jobs?limit=10"),
    byCategory: (category: string, limit: number = 20) => buildJobs(`/api/jobs?category=${encodeURIComponent(category)}&limit=${limit}`),
    search: (filters: Record<string, any> = {}) => {
      const queryParams = new URLSearchParams({
        ...filters,
        location: filters.location || 'Ethiopia'
      }).toString();
      return buildJobs(`/api/jobs?${queryParams}`);
    },
    details: (id: string) => buildJobs(`/api/jobs/${id}`),
    categories: () => buildJobs("/api/jobs?limit=100"),
    save: (id: string) => buildJobs(`/api/jobs/${id}/save`),
    unsave: (id: string) => buildJobs(`/api/jobs/${id}/save`),
    saved: () => buildJobs("/api/jobs/saved"),
  },

  // Job Application Services
  applications: {
    list: () => build("/applications/my"),
    mine: () => build("/applications/my"),
    submit: (jobId: string) => buildJobs(`/api/jobs/${jobId}/apply`), // POST
    details: (id: string) => build(`/applications/${id}`),
    update: (id: string) => build(`/applications/${id}`), // PUT
    withdraw: (id: string) => build(`/applications/${id}`), // DELETE
    status: (id: string) => build(`/applications/${id}/status`),
    stats: () => build("/applications/my/stats"),
  },

  // Freelancer Services
  freelancers: {
    list: (filters: Record<string, any> = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      return build(`/freelancers${queryParams ? `?${queryParams}` : ''}`);
    },
    details: (id: string) => build(`/freelancers/${id}`),
    contact: (id: string) => build(`/freelancers/${id}/contact`),
  },

  // Notification Services
  notifications: {
    list: (limit: number = 20) => build(`/users/notifications?limit=${limit}`),
    markAsRead: (id: string) => build(`/users/notifications/${id}/read`),
    markAllAsRead: () => build('/users/notifications/read-all'),
    unreadCount: () => build('/users/notifications/unread-count'),
  },

  // Messaging / Conversations
  messaging: {
    conversations: () => build("/api/conversations"),
    conversation: (id: string) => build(`/api/conversations/${id}`),
    messages: (conversationId: string) => build(`/api/conversations/${conversationId}/messages`),
    sendMessage: (conversationId: string) => build(`/api/conversations/${conversationId}/messages`),
  },

  // Generic helper to build arbitrary paths
  build,
};

export type Endpoints = typeof endpoints;
export default endpoints;
