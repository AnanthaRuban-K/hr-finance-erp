export interface JobPosting {
  jobPostingId: string;
  jobCode: string;
  jobTitle: string;
  status: string;
  departmentName?: string;
  totalApplications: number;
  totalViews: number;
  publishedDate: string | null;
  createdAt: string;
  minSalary?: number;
  maxSalary?: number;
  currency: string;
  employmentType: string;
  workArrangement: string;
  numberOfVacancies: number;
}

export interface CreateJobPostingData {
  jobTitle: string;
  departmentId?: string;
  jobDescription: string;
  employmentType: string;
  workArrangement: string;
  numberOfVacancies: number;
  minSalary?: number;
  maxSalary?: number;
  currency: string;
  requiredSkills?: string[];
  qualifications?: string[];
  isPublished: boolean;
}

export const recruitmentApi = {
  // Job Postings
  async getJobPostings(filters: any = {}) {
    const params = new URLSearchParams({
      page: filters.page?.toString() || '1',
      limit: filters.limit?.toString() || '10',
      ...(filters.status && { status: filters.status }),
      ...(filters.search && { search: filters.search })
    });

    const response = await fetch(`/api/recruitment/jobs?${params}`);
    if (!response.ok) throw new Error('Failed to fetch job postings');
    return response.json();
  },

  async createJobPosting(data: CreateJobPostingData) {
    const response = await fetch('/api/recruitment/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create job posting');
    return response.json();
  },

  async getJobPosting(id: string) {
    const response = await fetch(`/api/recruitment/jobs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch job posting');
    return response.json();
  },

  async updateJobPosting(id: string, data: Partial<CreateJobPostingData>) {
    const response = await fetch(`/api/recruitment/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update job posting');
    return response.json();
  },

  // Dashboard
  async getDashboardStats() {
    const response = await fetch('/api/recruitment/dashboard');
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  // Applications
  async getApplications(filters: any = {}) {
    const params = new URLSearchParams({
      page: filters.page?.toString() || '1',
      limit: filters.limit?.toString() || '10',
      ...(filters.status && { status: filters.status }),
      ...(filters.search && { search: filters.search })
    });

    const response = await fetch(`/api/recruitment/applications?${params}`);
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },

  async updateApplicationStatus(id: string, status: string, notes?: string) {
    const response = await fetch(`/api/recruitment/applications/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!response.ok) throw new Error('Failed to update application status');
    return response.json();
  }
};