import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { RecruitmentService } from '../services/recruitment.service';

const app = new Hono();
const recruitmentService = new RecruitmentService();

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

// ========================================================================
// PUBLIC CAREERS ROUTES (No Authentication Required)
// ========================================================================

/**
 * GET /jobs
 * Get all published job postings for public careers page
 */
app.get('/jobs', async (c) => {
  try {
    const { tenantId, search, department, employmentType, workArrangement } = c.req.query();

    // Get published job postings
    let jobPostings = await recruitmentService.getPublishedJobPostings(tenantId);

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      jobPostings = jobPostings.filter(job => 
        job.jobTitle.toLowerCase().includes(searchLower) ||
        job.jobDescription.toLowerCase().includes(searchLower)
      );
    }

    if (employmentType) {
      jobPostings = jobPostings.filter(job => job.employmentType === employmentType);
    }

    if (workArrangement) {
      jobPostings = jobPostings.filter(job => job.workArrangement === workArrangement);
    }

    return c.json({
      success: true,
      data: jobPostings,
      total: jobPostings.length
    });

  } catch (error) {
    console.error('Get careers jobs error:', error);
    throw new HTTPException(500, {
      message: 'Failed to fetch job postings',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * GET /jobs/:id
 * Get job posting details for public view
 */
app.get('/jobs/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const jobPosting = await recruitmentService.getPublishedJobPostingById(id);

    if (!jobPosting) {
      throw new HTTPException(404, {
        message: 'Job posting not found or no longer available'
      });
    }

    return c.json({
      success: true,
      data: jobPosting
    });

  } catch (error) {
    console.error('Get career job error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }
    
    throw new HTTPException(500, {
      message: 'Failed to fetch job posting',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * POST /jobs/:id/apply
 * Submit job application (public endpoint)
 */
app.post('/jobs/:id/apply', async (c) => {
  try {
    const jobPostingId = c.req.param('id');
    const applicationData = await c.req.json();

    // Validate required fields
    if (!applicationData.firstName || !applicationData.lastName || !applicationData.email) {
      throw new HTTPException(400, {
        message: 'First name, last name, and email are required'
      });
    }

    // Check if job posting exists and is published
    const jobPosting = await recruitmentService.getPublishedJobPostingById(jobPostingId);
    if (!jobPosting) {
      throw new HTTPException(404, {
        message: 'Job posting not found or no longer accepting applications'
      });
    }

    // Check application deadline
    if (jobPosting.applicationDeadline) {
      const deadline = new Date(jobPosting.applicationDeadline);
      if (new Date() > deadline) {
        throw new HTTPException(400, {
          message: 'Application deadline has passed'
        });
      }
    }

    // Create application (this is a simplified version)
    // In a real implementation, you'd want to handle file uploads, etc.
    const application = {
      applicationId: `app-${Date.now()}`,
      jobPostingId,
      applicationCode: `APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      firstName: applicationData.firstName,
      lastName: applicationData.lastName,
      email: applicationData.email,
      phone: applicationData.phone,
      coverLetter: applicationData.coverLetter,
      status: 'received',
      appliedAt: new Date()
    };

    // TODO: In a real implementation, save to database
    console.log('New application received:', application);

    return c.json({
      success: true,
      data: {
        applicationId: application.applicationId,
        applicationCode: application.applicationCode,
        message: 'Application submitted successfully'
      }
    }, 201);

  } catch (error) {
    console.error('Submit application error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }
    
    throw new HTTPException(500, {
      message: 'Failed to submit application',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * GET /application/:code
 * Get application status by application code (public endpoint)
 */
app.get('/application/:code', async (c) => {
  try {
    const code = c.req.param('code');
    
    // TODO: In a real implementation, fetch from database
    // For now, return a mock response
    const mockApplication = {
      applicationCode: code,
      status: 'received',
      appliedAt: new Date(),
      jobTitle: 'Software Engineer',
      lastUpdated: new Date()
    };

    return c.json({
      success: true,
      data: mockApplication
    });

  } catch (error) {
    console.error('Get application status error:', error);
    throw new HTTPException(500, {
      message: 'Failed to fetch application status',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * GET /stats
 * Get basic statistics for careers page
 */
app.get('/stats', async (c) => {
  try {
    const { tenantId } = c.req.query();
    
    const jobPostings = await recruitmentService.getPublishedJobPostings(tenantId);
    
    // Calculate basic stats
    const totalJobs = jobPostings.length;
    const departmentCounts = jobPostings.reduce((acc, job) => {
      // Note: Since we don't have department info in the public view,
      // we'll use employment type as a proxy
      const type = job.employmentType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const workArrangementCounts = jobPostings.reduce((acc, job) => {
      const arrangement = job.workArrangement;
      acc[arrangement] = (acc[arrangement] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return c.json({
      success: true,
      data: {
        totalJobs,
        byEmploymentType: departmentCounts,
        byWorkArrangement: workArrangementCounts,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('Get careers stats error:', error);
    throw new HTTPException(500, {
      message: 'Failed to fetch careers statistics',
      cause: getErrorMessage(error)
    });
  }
});

export default app;