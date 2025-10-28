// User and Authentication Types
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
  is_verified: boolean;
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
  token: string;
  refresh_token?: string;
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

// Job Types
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  company: string;
  location: string;
  salary?: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  category: string;
  experience_level?: string;
  posted_date: string;
  deadline?: string;
  status: 'pending' | 'approved' | 'rejected' | 'closed';
  employer_id: string;
  created_at: string;
  updated_at: string;
  is_featured?: boolean;
  application_count?: number;
  company_info?: {
    logo?: string;
    size?: string;
    industry?: string;
    founded?: string;
    description?: string;
  };
}

export interface JobFilters {
  q?: string;
  category?: string;
  location?: string;
  employment_type?: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  page?: number;
  limit?: number;
  sort_by?: 'relevance' | 'date' | 'salary' | 'rating';
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Application Types
export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  resume: string;
  cover_letter: string;
  status: 'submitted' | 'shortlisted' | 'accepted' | 'rejected';
  applied_at: string;
  updated_at: string;
  job?: Job;
  user?: Partial<User>;
}

export interface ApplyToJobRequest {
  resume: string;
  cover_letter: string;
}

export interface UpdateApplicationStatusRequest {
  status: 'submitted' | 'shortlisted' | 'accepted' | 'rejected';
}

// Report Types
export interface ReportJobRequest {
  reason: string;
}

export interface Report {
  id: string;
  job_id: string;
  user_id: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  updated_at: string;
}

// Employer Types
export interface Employer {
  id: string;
  user_id: string;
  company_name: string;
  company_description?: string;
  company_website?: string;
  company_size?: string;
  industry?: string;
  license_file?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Payment Types
export interface PaymentRequest {
  job_id: string;
  employer_id: string;
  amount: string;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface PaymentResponse {
  checkout_url: string;
  tx_ref: string;
}

export interface PaymentConfirmation {
  tx_ref: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
}

// Generic API Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Form Types
export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  gender?: 'male' | 'female';
  education?: string;
  skills?: string;
  experience?: string;
  preferred_categories?: string;
  preferred_locations?: string;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  employment_type?: string;
  experience_level?: string;
  salary_range?: {
    min?: number;
    max?: number;
  };
  date_posted?: 'today' | 'week' | 'month' | 'all';
  is_featured?: boolean;
}

// Dashboard/Statistics Types
export interface UserStats {
  total_applications: number;
  pending_applications: number;
  shortlisted_applications: number;
  accepted_applications: number;
  rejected_applications: number;
  saved_jobs: number;
  profile_completion: number;
}