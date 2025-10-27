import { apiWrapper, jobsApiClient, checkBackendAvailability, API_CONFIG } from '../lib/api';
import { mockJobs, mockApplications, Job, Application } from '../lib/mockData';

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
 * Job Service for Employer Connect Mobile
 * TODO: Remove mock fallbacks when integrating with backend
 */
export class JobService {
  private static isBackendAvailable = false;
  private static localJobs: Job[] = [...mockJobs];
  private static localApplications: Application[] = [...mockApplications];

  /**
   * Check backend availability
   */
  static async checkBackendAvailability(): Promise<void> {
    try {
      this.isBackendAvailable = await checkBackendAvailability(API_CONFIG.JOBS_BASE_URL);
      if (this.isBackendAvailable) {
        console.log('✅ [JOB SERVICE] Backend is available');
      } else {
        console.warn('⚠️ [JOB SERVICE] Backend unavailable, using mock data');
      }
    } catch (error) {
      console.warn('⚠️ [JOB SERVICE] Backend unavailable, using mock data');
      this.isBackendAvailable = false;
    }
  }

  /**
   * Get all jobs for the current employer
   */
  static async getEmployerJobs(): Promise<Job[]> {
    try {
      if (this.isBackendAvailable) {
        const jobs = await apiWrapper.get<Job[]>('/api/jobs/employer', jobsApiClient);
        console.log('✅ [JOB SERVICE] Retrieved jobs from backend:', jobs.length);
        return jobs;
      } else {
        console.log('🎭 [JOB SERVICE] Using mock jobs data');
        return this.localJobs;
      }
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error fetching jobs, using mock data:', error);
      return this.localJobs;
    }
  }

  /**
   * Get a specific job by ID
   */
  static async getJobById(jobId: string): Promise<Job | null> {
    try {
      if (this.isBackendAvailable) {
        const job = await apiWrapper.get<Job>(`/api/jobs/${jobId}`, jobsApiClient);
        return job;
      } else {
        console.log('🎭 [JOB SERVICE] Using mock job data for ID:', jobId);
        return this.localJobs.find(job => job.id === jobId) || null;
      }
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error fetching job, using mock data:', error);
      return this.localJobs.find(job => job.id === jobId) || null;
    }
  }

  /**
   * Create a new job posting
   */
  static async createJob(jobData: JobData): Promise<Job> {
    try {
      if (this.isBackendAvailable) {
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
          status: 'approved',
        }, jobsApiClient);
        
        console.log('✅ [JOB SERVICE] Job created successfully:', newJob.title);
        return newJob;
      } else {
        console.log('🎭 [JOB SERVICE] Creating mock job:', jobData.title);
        
        // Create mock job
        const mockJob: Job = {
          id: 'job_' + Date.now(),
          ...jobData,
          status: 'active',
          employerId: 'employer_001',
          applicationsCount: 0,
          views: 0,
          createdAt: new Date().toISOString()
        };
        
        // Add to local mock data
        this.localJobs.unshift(mockJob);
        
        console.log('✅ [MOCK JOB SERVICE] Mock job created successfully');
        return mockJob;
      }
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
      if (this.isBackendAvailable) {
        const updatedJob = await apiWrapper.put<Job>(`/api/jobs/${jobId}`, updateData, jobsApiClient);
        console.log('✅ [JOB SERVICE] Job updated successfully:', updatedJob.title);
        return updatedJob;
      } else {
        console.log('🎭 [JOB SERVICE] Updating mock job:', jobId);
        
        const jobIndex = this.localJobs.findIndex(job => job.id === jobId);
        if (jobIndex === -1) {
          throw new Error('Job not found');
        }
        
        this.localJobs[jobIndex] = { ...this.localJobs[jobIndex], ...updateData };
        
        console.log('✅ [MOCK JOB SERVICE] Mock job updated successfully');
        return this.localJobs[jobIndex];
      }
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
      if (this.isBackendAvailable) {
        await apiWrapper.delete(`/api/jobs/${jobId}`, jobsApiClient);
        console.log('✅ [JOB SERVICE] Job deleted successfully');
        return true;
      } else {
        console.log('🎭 [JOB SERVICE] Deleting mock job:', jobId);
        
        const jobIndex = this.localJobs.findIndex(job => job.id === jobId);
        if (jobIndex === -1) {
          throw new Error('Job not found');
        }
        
        this.localJobs.splice(jobIndex, 1);
        
        console.log('✅ [MOCK JOB SERVICE] Mock job deleted successfully');
        return true;
      }
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
      if (this.isBackendAvailable) {
        const applications = await apiWrapper.get<Application[]>(`/api/jobs/${jobId}/applications`, jobsApiClient);
        console.log('✅ [JOB SERVICE] Retrieved applications from backend:', applications.length);
        return applications;
      } else {
        console.log('🎭 [JOB SERVICE] Using mock applications data for job:', jobId);
        return this.localApplications.filter(app => app.jobId === jobId);
      }
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error fetching applications, using mock data:', error);
      return this.localApplications.filter(app => app.jobId === jobId);
    }
  }

  /**
   * Get all applications for the employer
   */
  static async getAllApplications(): Promise<Application[]> {
    try {
      if (this.isBackendAvailable) {
        const applications = await apiWrapper.get<Application[]>('/api/applications/employer', jobsApiClient);
        console.log('✅ [JOB SERVICE] Retrieved all applications from backend:', applications.length);
        return applications;
      } else {
        console.log('🎭 [JOB SERVICE] Using mock applications data');
        return this.localApplications;
      }
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error fetching applications, using mock data:', error);
      return this.localApplications;
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
      if (this.isBackendAvailable) {
        const updatedApplication = await apiWrapper.patch<Application>(
          `/api/applications/${applicationId}`, 
          { status }, 
          jobsApiClient
        );
        console.log('✅ [JOB SERVICE] Application status updated successfully');
        return updatedApplication;
      } else {
        console.log('🎭 [JOB SERVICE] Updating mock application status:', applicationId, status);
        
        const appIndex = this.localApplications.findIndex(app => app.id === applicationId);
        if (appIndex === -1) {
          throw new Error('Application not found');
        }
        
        this.localApplications[appIndex].status = status;
        this.localApplications[appIndex].updatedAt = new Date().toISOString();
        
        console.log('✅ [MOCK JOB SERVICE] Mock application status updated successfully');
        return this.localApplications[appIndex];
      }
    } catch (error) {
      console.error('❌ [JOB SERVICE] Error updating application status:', error);
      throw new Error('Failed to update application status');
    }
  }

  /**
   * Get job categories
   */
  static getJobCategories(): string[] {
    return [
      'Technology',
      'Marketing',
      'Sales',
      'Finance',
      'Human Resources',
      'Operations',
      'Customer Service',
      'Engineering',
      'Design',
      'Healthcare',
      'Education',
      'Manufacturing',
      'Retail',
      'Hospitality',
      'Construction',
      'Transportation',
      'Agriculture',
      'Government',
      'Non-Profit',
      'Other'
    ];
  }

  /**
   * Get job locations (Ethiopian cities)
   */
  static getJobLocations(): string[] {
    return [
      'Addis Ababa',
      'Dire Dawa',
      'Mekelle',
      'Gondar',
      'Awassa',
      'Bahir Dar',
      'Jimma',
      'Jijiga',
      'Shashamene',
      'Arba Minch'
    ];
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


