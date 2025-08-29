import { createId } from '@paralleldrive/cuid2';

// Helper function to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

// Interfaces for the recruitment system
export interface JobPosting {
  jobPostingId: string;
  tenantId: string;
  jobCode: string;
  jobTitle: string;
  departmentId?: string;
  jobDescription: string;
  keyResponsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  qualifications: string[];
  employmentType: string;
  workArrangement: string;
  numberOfVacancies: number;
  minSalary?: number;
  maxSalary?: number;
  currency: string;
  applicationDeadline?: string;
  status: string;
  allowCoverLetter: boolean;
  requireCoverLetter: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  applicationId: string;
  jobPostingId: string;
  applicationCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
  appliedAt: Date;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface JobPostingFilters {
  page: number;
  limit: number;
  status?: string;
  department?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApplicationFilters {
  page: number;
  limit: number;
  status?: string;
  jobPostingId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class RecruitmentService {
  // In-memory storage for demo purposes
  private jobPostings: Map<string, JobPosting> = new Map();
  private applications: Map<string, Application> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Create sample job posting
    const sampleJobPosting: JobPosting = {
      jobPostingId: createId(),
      tenantId: 'tenant-1',
      jobCode: 'JOB-2024-001',
      jobTitle: 'Software Engineer',
      departmentId: 'dept-it',
      jobDescription: 'We are looking for a skilled Software Engineer to join our dynamic development team.',
      keyResponsibilities: [
        'Develop and maintain web applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code'
      ],
      requiredSkills: ['JavaScript', 'React', 'Node.js'],
      preferredSkills: ['TypeScript', 'AWS'],
      qualifications: ['Bachelor\'s degree in Computer Science', '3+ years experience'],
      employmentType: 'permanent',
      workArrangement: 'hybrid',
      numberOfVacancies: 2,
      minSalary: 5000,
      maxSalary: 7000,
      currency: 'SGD',
      applicationDeadline: '2024-12-31',
      status: 'published',
      allowCoverLetter: true,
      requireCoverLetter: false,
      createdBy: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.jobPostings.set(sampleJobPosting.jobPostingId, sampleJobPosting);

    // Create sample application
    const sampleApplication: Application = {
      applicationId: createId(),
      jobPostingId: sampleJobPosting.jobPostingId,
      applicationCode: 'APP-2024-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+65 9876 5432',
      status: 'received',
      appliedAt: new Date(),
      resumeUrl: 'https://example.com/resume.pdf',
      coverLetter: 'I am excited to apply for this position...'
    };

    this.applications.set(sampleApplication.applicationId, sampleApplication);
  }

  // ========================================================================
  // JOB POSTING METHODS
  // ========================================================================

  async createJobPosting(tenantId: string, jobData: any, createdBy: string): Promise<JobPosting> {
    try {
      const jobCode = await this.generateJobCode(tenantId);
      this.validateJobPostingData(jobData);

      const jobPosting: JobPosting = {
        jobPostingId: createId(),
        tenantId,
        jobCode,
        jobTitle: jobData.jobTitle,
        departmentId: jobData.departmentId,
        jobDescription: jobData.jobDescription,
        keyResponsibilities: jobData.keyResponsibilities || [],
        requiredSkills: jobData.requiredSkills || [],
        preferredSkills: jobData.preferredSkills || [],
        qualifications: jobData.qualifications || [],
        employmentType: jobData.employmentType || 'permanent',
        workArrangement: jobData.workArrangement || 'office',
        numberOfVacancies: jobData.numberOfVacancies || 1,
        minSalary: jobData.minSalary,
        maxSalary: jobData.maxSalary,
        currency: jobData.currency || 'SGD',
        applicationDeadline: jobData.applicationDeadline,
        status: jobData.isPublished ? 'published' : 'draft',
        allowCoverLetter: jobData.allowCoverLetter || false,
        requireCoverLetter: jobData.requireCoverLetter || false,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.jobPostings.set(jobPosting.jobPostingId, jobPosting);
      return jobPosting;

    } catch (error) {
      throw new Error(`Failed to create job posting: ${getErrorMessage(error)}`);
    }
  }

  async getJobPostings(tenantId: string, filters: JobPostingFilters) {
    try {
      let jobPostings = Array.from(this.jobPostings.values())
        .filter(jp => jp.tenantId === tenantId);

      // Apply filters
      if (filters.status) {
        jobPostings = jobPostings.filter(jp => jp.status === filters.status);
      }

      if (filters.department) {
        jobPostings = jobPostings.filter(jp => jp.departmentId === filters.department);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        jobPostings = jobPostings.filter(jp => 
          jp.jobTitle.toLowerCase().includes(searchLower) ||
          jp.jobCode.toLowerCase().includes(searchLower) ||
          jp.jobDescription.toLowerCase().includes(searchLower)
        );
      }

      // Sort
      const sortBy = (filters.sortBy || 'createdAt') as keyof JobPosting;
      const sortOrder = filters.sortOrder || 'desc';
      
      jobPostings.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === 'desc' ? bValue.getTime() - aValue.getTime() : aValue.getTime() - bValue.getTime();
        }
        
        const aStr = String(aValue);
        const bStr = String(bValue);
        return sortOrder === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
      });

      // Paginate
      const total = jobPostings.length;
      const startIndex = (filters.page - 1) * filters.limit;
      const endIndex = startIndex + filters.limit;
      const paginatedResults = jobPostings.slice(startIndex, endIndex);

      return {
        jobPostings: paginatedResults,
        total
      };

    } catch (error) {
      throw new Error('Failed to fetch job postings');
    }
  }

  async getJobPostingById(jobPostingId: string, tenantId: string): Promise<JobPosting | null> {
    try {
      const jobPosting = this.jobPostings.get(jobPostingId);
      
      if (!jobPosting || jobPosting.tenantId !== tenantId) {
        return null;
      }

      return jobPosting;

    } catch (error) {
      throw new Error('Failed to fetch job posting');
    }
  }

  async updateJobPosting(jobPostingId: string, tenantId: string, updateData: any, updatedBy: string): Promise<JobPosting> {
    try {
      const existingJobPosting = this.jobPostings.get(jobPostingId);
      
      if (!existingJobPosting || existingJobPosting.tenantId !== tenantId) {
        throw new Error('Job posting not found');
      }

      const updatedJobPosting: JobPosting = {
        ...existingJobPosting,
        ...updateData,
        updatedAt: new Date()
      };

      this.jobPostings.set(jobPostingId, updatedJobPosting);
      return updatedJobPosting;

    } catch (error) {
      throw new Error(`Failed to update job posting: ${getErrorMessage(error)}`);
    }
  }

  async publishJobPosting(jobPostingId: string, tenantId: string, publishedBy: string): Promise<JobPosting> {
    try {
      const jobPosting = this.jobPostings.get(jobPostingId);
      
      if (!jobPosting || jobPosting.tenantId !== tenantId) {
        throw new Error('Job posting not found');
      }

      const publishedJobPosting: JobPosting = {
        ...jobPosting,
        status: 'published',
        updatedAt: new Date()
      };

      this.jobPostings.set(jobPostingId, publishedJobPosting);
      return publishedJobPosting;

    } catch (error) {
      throw new Error('Failed to publish job posting');
    }
  }

  async closeJobPosting(jobPostingId: string, tenantId: string, closedBy: string): Promise<JobPosting> {
    try {
      const jobPosting = this.jobPostings.get(jobPostingId);
      
      if (!jobPosting || jobPosting.tenantId !== tenantId) {
        throw new Error('Job posting not found');
      }

      const closedJobPosting: JobPosting = {
        ...jobPosting,
        status: 'closed',
        updatedAt: new Date()
      };

      this.jobPostings.set(jobPostingId, closedJobPosting);
      return closedJobPosting;

    } catch (error) {
      throw new Error('Failed to close job posting');
    }
  }

  // ========================================================================
  // APPLICATION METHODS
  // ========================================================================

  async getApplications(tenantId: string, filters: ApplicationFilters) {
    try {
      const tenantJobPostingIds = Array.from(this.jobPostings.values())
        .filter(jp => jp.tenantId === tenantId)
        .map(jp => jp.jobPostingId);

      let applications = Array.from(this.applications.values())
        .filter(app => tenantJobPostingIds.includes(app.jobPostingId));

      // Apply filters
      if (filters.status) {
        applications = applications.filter(app => app.status === filters.status);
      }

      if (filters.jobPostingId) {
        applications = applications.filter(app => app.jobPostingId === filters.jobPostingId);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        applications = applications.filter(app => 
          app.firstName.toLowerCase().includes(searchLower) ||
          app.lastName.toLowerCase().includes(searchLower) ||
          app.email.toLowerCase().includes(searchLower) ||
          app.applicationCode.toLowerCase().includes(searchLower)
        );
      }

      // Sort
      const sortBy = (filters.sortBy || 'appliedAt') as keyof Application;
      const sortOrder = filters.sortOrder || 'desc';
      
      applications.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === 'desc' ? bValue.getTime() - aValue.getTime() : aValue.getTime() - bValue.getTime();
        }
        
        const aStr = String(aValue);
        const bStr = String(bValue);
        return sortOrder === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
      });

      // Paginate
      const total = applications.length;
      const startIndex = (filters.page - 1) * filters.limit;
      const endIndex = startIndex + filters.limit;
      const paginatedResults = applications.slice(startIndex, endIndex);

      return {
        applications: paginatedResults,
        total
      };

    } catch (error) {
      throw new Error('Failed to fetch applications');
    }
  }

  async getApplicationById(applicationId: string, tenantId: string): Promise<Application | null> {
    try {
      const application = this.applications.get(applicationId);
      
      if (!application) {
        return null;
      }

      // Check if application belongs to a job posting of this tenant
      const jobPosting = this.jobPostings.get(application.jobPostingId);
      if (!jobPosting || jobPosting.tenantId !== tenantId) {
        return null;
      }

      return application;

    } catch (error) {
      throw new Error('Failed to fetch application');
    }
  }

  async shortlistApplication(applicationId: string, tenantId: string, shortlistedBy: string, notes?: string): Promise<Application> {
    try {
      const application = await this.getApplicationById(applicationId, tenantId);
      
      if (!application) {
        throw new Error('Application not found');
      }

      const updatedApplication: Application = {
        ...application,
        status: 'shortlisted'
      };

      this.applications.set(applicationId, updatedApplication);
      return updatedApplication;

    } catch (error) {
      throw new Error('Failed to shortlist application');
    }
  }

  async rejectApplication(applicationId: string, tenantId: string, rejectedBy: string, reason?: string, notes?: string): Promise<Application> {
    try {
      const application = await this.getApplicationById(applicationId, tenantId);
      
      if (!application) {
        throw new Error('Application not found');
      }

      const updatedApplication: Application = {
        ...application,
        status: 'rejected'
      };

      this.applications.set(applicationId, updatedApplication);
      return updatedApplication;

    } catch (error) {
      throw new Error('Failed to reject application');
    }
  }

  // ========================================================================
  // ANALYTICS METHODS
  // ========================================================================

  async getRecruitmentAnalytics(tenantId: string, filters?: { startDate?: Date; endDate?: Date }) {
    try {
      const tenantJobPostings = Array.from(this.jobPostings.values())
        .filter(jp => jp.tenantId === tenantId);

      const tenantJobPostingIds = tenantJobPostings.map(jp => jp.jobPostingId);
      const tenantApplications = Array.from(this.applications.values())
        .filter(app => tenantJobPostingIds.includes(app.jobPostingId));

      const activeJobPostings = tenantJobPostings.filter(jp => jp.status === 'published').length;
      const totalApplications = tenantApplications.length;
      const pendingInterviews = 0;
      const offersExtended = tenantApplications.filter(app => app.status === 'offer_extended').length;

      const applicationsByStatus = this.calculateApplicationsByStatus(tenantApplications);

      const applicationsBySource = [
        { source: 'company_website', count: Math.floor(totalApplications * 0.4), percentage: 40 },
        { source: 'job_boards', count: Math.floor(totalApplications * 0.35), percentage: 35 },
        { source: 'referrals', count: Math.floor(totalApplications * 0.15), percentage: 15 },
        { source: 'social_media', count: Math.floor(totalApplications * 0.1), percentage: 10 }
      ];

      return {
        activeJobPostings,
        totalApplications,
        pendingInterviews,
        offersExtended,
        newApplicationsToday: Math.floor(Math.random() * 10),
        interviewsThisWeek: Math.floor(Math.random() * 20),
        averageTimeToHire: 15,
        applicationsByStatus,
        applicationsBySource
      };

    } catch (error) {
      throw new Error('Failed to fetch recruitment analytics');
    }
  }

  // ========================================================================
  // PUBLIC METHODS FOR CAREERS PAGE
  // ========================================================================

  async getPublishedJobPostings(tenantId?: string) {
    try {
      let jobPostings = Array.from(this.jobPostings.values())
        .filter(jp => jp.status === 'published');

      if (tenantId) {
        jobPostings = jobPostings.filter(jp => jp.tenantId === tenantId);
      }

      return jobPostings.map(job => ({
        jobPostingId: job.jobPostingId,
        jobCode: job.jobCode,
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        employmentType: job.employmentType,
        workArrangement: job.workArrangement,
        numberOfVacancies: job.numberOfVacancies,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        currency: job.currency,
        applicationDeadline: job.applicationDeadline,
        publishedDate: job.createdAt
      }));

    } catch (error) {
      throw new Error('Failed to fetch job postings');
    }
  }

  async getPublishedJobPostingById(jobPostingId: string) {
    try {
      const jobPosting = this.jobPostings.get(jobPostingId);
      
      if (!jobPosting || jobPosting.status !== 'published') {
        return null;
      }

      return {
        jobPostingId: jobPosting.jobPostingId,
        jobCode: jobPosting.jobCode,
        jobTitle: jobPosting.jobTitle,
        jobDescription: jobPosting.jobDescription,
        keyResponsibilities: jobPosting.keyResponsibilities,
        requiredSkills: jobPosting.requiredSkills,
        preferredSkills: jobPosting.preferredSkills,
        qualifications: jobPosting.qualifications,
        employmentType: jobPosting.employmentType,
        workArrangement: jobPosting.workArrangement,
        numberOfVacancies: jobPosting.numberOfVacancies,
        minSalary: jobPosting.minSalary,
        maxSalary: jobPosting.maxSalary,
        currency: jobPosting.currency,
        applicationDeadline: jobPosting.applicationDeadline,
        allowCoverLetter: jobPosting.allowCoverLetter,
        requireCoverLetter: jobPosting.requireCoverLetter,
        publishedDate: jobPosting.createdAt
      };

    } catch (error) {
      throw new Error('Failed to fetch job posting');
    }
  }

  // ========================================================================
  // PLACEHOLDER METHODS
  // ========================================================================

  async scheduleInterview(tenantId: string, interviewData: any, scheduledBy: string) {
    return {
      interviewId: createId(),
      ...interviewData,
      status: 'scheduled',
      scheduledBy,
      createdAt: new Date()
    };
  }

  async getInterviews(tenantId: string, filters: any) {
    return {
      interviews: [],
      total: 0
    };
  }

  async getInterviewById(interviewId: string, tenantId: string) {
    return null;
  }

  async submitInterviewFeedback(interviewId: string, tenantId: string, interviewerId: string, feedbackData: any) {
    return {
      feedbackId: createId(),
      interviewId,
      interviewerId,
      ...feedbackData,
      submittedAt: new Date()
    };
  }

  async updateInterview(interviewId: string, tenantId: string, updateData: any, updatedBy: string) {
    return {
      interviewId,
      ...updateData,
      updatedBy,
      updatedAt: new Date()
    };
  }

  async getRecruitmentPipelineReport(tenantId: string, filters: any) {
    return {
      pipelineStages: [
        { stage: 'Applied', count: 50 },
        { stage: 'Screening', count: 30 },
        { stage: 'Interview', count: 15 },
        { stage: 'Offer', count: 5 }
      ]
    };
  }

  async getTimeToHireReport(tenantId: string, filters: any) {
    return {
      averageTimeToHire: 15,
      byDepartment: [
        { department: 'IT', averageDays: 12 },
        { department: 'HR', averageDays: 18 },
        { department: 'Finance', averageDays: 20 }
      ]
    };
  }

  async performBulkAction(tenantId: string, action: string, applicationIds: string[], data: any, performedBy: string) {
    let successCount = 0;
    const results = [];

    for (const applicationId of applicationIds) {
      try {
        switch (action) {
          case 'shortlist':
            await this.shortlistApplication(applicationId, tenantId, performedBy, data?.notes);
            break;
          case 'reject':
            await this.rejectApplication(applicationId, tenantId, performedBy, data?.reason, data?.notes);
            break;
          default:
            throw new Error(`Unsupported action: ${action}`);
        }
        
        successCount++;
        results.push({ applicationId, status: 'success' });
      } catch (error) {
        results.push({ applicationId, status: 'error', error: getErrorMessage(error) });
      }
    }

    return {
      action,
      total: applicationIds.length,
      successful: successCount,
      failed: applicationIds.length - successCount,
      results
    };
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  private async generateJobCode(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();
    const existingCodes = Array.from(this.jobPostings.values())
      .filter(jp => jp.tenantId === tenantId && jp.jobCode.includes(year.toString()))
      .length;
    
    const nextNumber = (existingCodes + 1).toString().padStart(3, '0');
    return `JOB-${year}-${nextNumber}`;
  }

  private calculateApplicationsByStatus(applications: Application[]) {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = applications.length || 1;

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }

  private validateJobPostingData(jobData: any): void {
    if (!jobData.jobTitle || jobData.jobTitle.length < 3) {
      throw new Error('Job title must be at least 3 characters long');
    }

    if (!jobData.jobDescription || jobData.jobDescription.length < 50) {
      throw new Error('Job description must be at least 50 characters long');
    }

    if (jobData.maxSalary && jobData.minSalary && jobData.maxSalary <= jobData.minSalary) {
      throw new Error('Maximum salary must be greater than minimum salary');
    }
  }
}