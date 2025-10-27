import { apiWrapper, jobsApiClient, authApiClient, checkBackendAvailability, API_CONFIG } from '../lib/api';

// Type definitions
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary: string | number;
  category: string;
  location: string;
  expiryDate?: string;
  expiry_date?: string;
  listingType?: string;
  listing_type?: string;
  employmentType?: string;
  employment_type?: string;
  status: string;
  employerId?: string;
  employer_id?: string;
  applicationsCount?: number;
  createdAt?: string;
  created_at?: string;
}

export interface Application {
  id: string;
  jobId?: string;
  job_id?: string;
  applicantName?: string;
  applicant_name?: string;
  email?: string;
  status: string;
  appliedDate?: string;
  applied_date?: string;
  resume?: string;
  coverLetter?: string;
  cover_letter?: string;
}

export interface JobData {
  title: string;
  description: string;
  requirements: string;
  salary: string;
  category: string;
  location: string;
  expiryDate: string;
  listingType: string;
  employmentType?: string;
}

export interface JobUpdateData extends Partial<JobData> {
  status?: 'active' | 'expired' | 'pending';
}

/**
 * Job Service for Employer Connect Pro
 * Handles job CRUD operations with backend API
 */
export class JobService {
  /**
   * Check backend availability
   */
  static async checkBackendAvailability(): Promise<void> {
    try {
      const isAvailable = await checkBackendAvailability(API_CONFIG.JOBS_BASE_URL);
      if (isAvailable) {
        console.log('✅ [JOB SERVICE] Jobs backend is available');
      } else {
        console.warn('⚠️ [JOB SERVICE] Jobs backend unavailable');
      }
    } catch (error) {
      console.warn('⚠️ [JOB SERVICE] Jobs backend unavailable');
    }
  }

  /**
   * Get all jobs for the current employer
   */
  static async getEmployerJobs(): Promise<Job[]> {
    try {
      const jobs = await apiWrapper.get<Job[]>('/api/jobs/employer', jobsApiClient);
      console.log('✅ [JOB SERVICE] Retrieved jobs from backend:', jobs.length);
      return jobs;
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error fetching jobs:', error);
      throw error;
    }
  }

  /**
   * Get a specific job by ID
   */
  static async getJobById(jobId: string): Promise<Job | null> {
    try {
      const job = await apiWrapper.get<Job>(`/api/jobs/${jobId}`, jobsApiClient);
      return job;
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error fetching job:', error);
      throw error;
    }
  }

  /**
   * Create a new job posting
   */
  static async createJob(jobData: JobData): Promise<Job> {
    try {
      // Map frontend camelCase to backend snake_case
      const newJob = await apiWrapper.post<Job>('/api/jobs', {
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements,
        salary: jobData.salary ? parseFloat(jobData.salary) : null,
        category: jobData.category,
        location: jobData.location,
        expiry_date: jobData.expiryDate,
        employment_type: jobData.employmentType || 'full_time',
        listing_type: jobData.listingType || 'free',
        status: 'approved', // Auto-approved (payment skipped)
      }, jobsApiClient);
      
      console.log('✅ [JOB SERVICE] Job created successfully:', newJob.title);
      return newJob;
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error creating job:', error);
      throw new Error('Failed to create job posting');
    }
  }

  /**
   * Update an existing job
   */
  static async updateJob(jobId: string, updateData: JobUpdateData): Promise<Job> {
    try {
      const updatedJob = await apiWrapper.put<Job>(`/api/jobs/${jobId}`, updateData, jobsApiClient);
      console.log('✅ [JOB SERVICE] Job updated successfully:', updatedJob.title);
      return updatedJob;
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error updating job:', error);
      throw new Error('Failed to update job posting');
    }
  }

  /**
   * Delete a job posting
   */
  static async deleteJob(jobId: string): Promise<boolean> {
    try {
      await apiWrapper.delete(`/api/jobs/${jobId}`, jobsApiClient);
      console.log('✅ [JOB SERVICE] Job deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error deleting job:', error);
      throw new Error('Failed to delete job posting');
    }
  }

  /**
   * Get applications for a specific job
   */
  static async getJobApplications(jobId: string): Promise<Application[]> {
    try {
      const applications = await apiWrapper.get<Application[]>(`/api/jobs/${jobId}/applications`, jobsApiClient);
      console.log('✅ [JOB SERVICE] Retrieved applications from backend:', applications.length);
      return applications;
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error fetching applications:', error);
      throw error;
    }
  }

  /**
   * Get all applications for the employer
   */
  static async getAllApplications(): Promise<Application[]> {
    try {
      const response = await apiWrapper.get<any>('/api/applications', jobsApiClient);
      console.log('✅ [JOB SERVICE] Retrieved applications from backend:', response);
      
      // Backend returns { applications: [...] }
      const applications = response.applications || [];
      console.log('✅ [JOB SERVICE] Total applications:', applications.length);
      
      // Transform backend snake_case to frontend camelCase
      const transformedApplications = applications.map((app: any) => ({
        id: app.id,
        jobId: app.job_id,
        job_id: app.job_id,
        candidateName: app.applicant_name || 'Unknown',
        applicant_name: app.applicant_name,
        candidateEmail: app.applicant_email || '',
        email: app.applicant_email,
        applicant_email: app.applicant_email,
        status: app.status,
        appliedAt: app.applied_at || app.applied_date,
        applied_date: app.applied_at,
        appliedDate: app.applied_at,
        resume: app.resume,
        coverLetter: app.cover_letter,
        cover_letter: app.cover_letter,
        jobTitle: app.job_title,
        job_title: app.job_title
      }));
      
      console.log('✅ [JOB SERVICE] Transformed applications:', transformedApplications);
      return transformedApplications;
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error fetching applications:', error);
      throw error;
    }
  }

  /**
   * Update application status
   */
  static async updateApplicationStatus(
    applicationId: string, 
    status: 'pending' | 'shortlisted' | 'accepted' | 'rejected'
  ): Promise<Application> {
    try {
      const updatedApplication = await apiWrapper.patch<Application>(
        `/api/applications/${applicationId}`, 
        { status }, 
        jobsApiClient
      );
      console.log('✅ [JOB SERVICE] Application status updated successfully');
      return updatedApplication;
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error updating application status:', error);
      throw new Error('Failed to update application status');
    }
  }

  /**
   * Get job categories
   */
  static async getJobCategories(): Promise<string[]> {
    try {
      const categories = await apiWrapper.get<string[]>('/api/jobs/categories', jobsApiClient);
      return categories;
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get job locations (Ethiopian cities)
   */
  static getJobLocations(): string[] {
    const locations = import.meta.env.VITE_DEFAULT_LOCATIONS || 
      'Addis Ababa,Dire Dawa,Mekelle,Gondar,Awassa,Bahir Dar,Jimma,Jijiga,Shashamene,Arba Minch';
    
    return locations.split(',').map(location => location.trim());
  }

  /**
   * Initialize job service
   */
  static async initialize(): Promise<void> {
    await this.checkBackendAvailability();
    console.log('✅ [JOB SERVICE] Job service initialized');
  }
}

export default JobService;