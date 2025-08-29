import { Router, Request, Response } from 'express';
import { RecruitmentService } from '../services/recruitment.service';

const router = Router();
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
 * GET /api/careers/jobs
 * Get all published job postings for public careers page
 */
router.get('/jobs', async (req: Request, res: Response) => {
  try {
    const { tenantId, search, department, employmentType, workArrangement } = req.query;

    // Get published job postings
    let jobPostings = await recruitmentService.getPublishedJobPostings(tenantId as string);

    // Apply filters
    if (search) {
      const searchLower = (search as string).toLowerCase();
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

    res.json({
      success: true,
      data: jobPostings,
      total: jobPostings.length
    });

  } catch (error) {
    console.error('Get careers jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job postings',
      error: getErrorMessage(error)
    });
  }
});

/**
 * GET /api/careers/jobs/:id
 * Get job posting details for public view
 */
router.get('/jobs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const jobPosting = await recruitmentService.getPublishedJobPostingById(id);

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found or no longer available'
      });
    }

    res.json({
      success: true,
      data: jobPosting
    });

  } catch (error) {
    console.error('Get career job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job posting',
      error: getErrorMessage(error)
    });
  }
});

/**
 * POST /api/careers/jobs/:id/apply
 * Submit job application (public endpoint)
 */
router.post('/jobs/:id/apply', async (req: Request, res: Response) => {
  try {
    const { id: jobPostingId } = req.params;
    const applicationData = req.body;

    // Validate required fields
    if (!applicationData.firstName || !applicationData.lastName || !applicationData.email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    // Check if job posting exists and is published
    const jobPosting = await recruitmentService.getPublishedJobPostingById(jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found or no longer accepting applications'
      });
    }

    // Check application deadline
    if (jobPosting.applicationDeadline) {
      const deadline = new Date(jobPosting.applicationDeadline);
      if (new Date() > deadline) {
        return res.status(400).json({
          success: false,
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

    res.status(201).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        applicationCode: application.applicationCode,
        message: 'Application submitted successfully'
      }
    });

  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: getErrorMessage(error)
    });
  }
});

/**
 * GET /api/careers/application/:code
 * Get application status by application code (public endpoint)
 */
router.get('/application/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    
    // TODO: In a real implementation, fetch from database
    // For now, return a mock response
    const mockApplication = {
      applicationCode: code,
      status: 'received',
      appliedAt: new Date(),
      jobTitle: 'Software Engineer',
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: mockApplication
    });

  } catch (error) {
    console.error('Get application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application status',
      error: getErrorMessage(error)
    });
  }
});

/**
 * GET /api/careers/stats
 * Get basic statistics for careers page
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    
    const jobPostings = await recruitmentService.getPublishedJobPostings(tenantId as string);
    
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

    res.json({
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch careers statistics',
      error: getErrorMessage(error)
    });
  }
});

export default router;