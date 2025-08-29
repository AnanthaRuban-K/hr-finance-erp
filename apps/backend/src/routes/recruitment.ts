import { Router, Request, Response } from 'express';
import { z } from 'zod';
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

// Helper function to check if error is authentication error
function isAuthError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return message === 'Authentication required';
}

// Helper function to extract user info from headers or token
function getUserFromRequest(req: Request) {
  // Option 1: From headers (simple approach)
  const userId = req.headers['x-user-id'] as string;
  const tenantId = req.headers['x-tenant-id'] as string;
  const organizationId = req.headers['x-organization-id'] as string;

  // Option 2: From Authorization header (JWT token)
  // const token = req.headers.authorization?.replace('Bearer ', '');
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Option 3: From session
  // const userId = req.session?.user?.id;

  if (!userId || !tenantId) {
    throw new Error('Authentication required');
  }

  return {
    userId,
    tenantId,
    organizationId: organizationId || tenantId, // fallback
    role: req.headers['x-user-role'] as string || 'employee'
  };
}

// Validation schemas
const createJobPostingSchema = z.object({
  jobTitle: z.string().min(3, 'Job title must be at least 3 characters'),
  departmentId: z.string().optional(),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  keyResponsibilities: z.array(z.string()).default([]),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  qualifications: z.array(z.string()).default([]),
  employmentType: z.enum(['permanent', 'contract', 'temporary', 'internship']).default('permanent'),
  workArrangement: z.enum(['office', 'remote', 'hybrid']).default('office'),
  numberOfVacancies: z.number().min(1).default(1),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  currency: z.string().length(3).default('SGD'),
  applicationDeadline: z.string().optional(),
  allowCoverLetter: z.boolean().default(false),
  requireCoverLetter: z.boolean().default(false),
  isPublished: z.boolean().default(false)
});

// ========================================================================
// JOB POSTING ROUTES
// ========================================================================

/**
 * GET /api/recruitment/jobs
 * Get all job postings
 */
router.get('/jobs', async (req: Request, res: Response) => {
  try {
    // Handle authentication inline
    const user = getUserFromRequest(req);

    const {
      page = '1',
      limit = '10',
      status,
      department,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      status: status as string,
      department: department as string,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const result = await recruitmentService.getJobPostings(user.tenantId, filters);

    res.json({
      success: true,
      data: result.jobPostings,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.total,
        totalPages: Math.ceil(result.total / parseInt(limit as string))
      }
    });

  } catch (error) {
    console.error('Get job postings error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch job postings',
      error: getErrorMessage(error)
    });
  }
});

/**
 * POST /api/recruitment/jobs
 * Create a new job posting
 */
router.post('/jobs', async (req: Request, res: Response) => {
  try {
    // Handle authentication inline
    const user = getUserFromRequest(req);

    // Check permissions (simple role-based check)
    if (!['hr_manager', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const validation = createJobPostingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors
      });
    }

    const jobPosting = await recruitmentService.createJobPosting(
      user.tenantId,
      validation.data,
      user.userId
    );

    res.status(201).json({
      success: true,
      data: jobPosting,
      message: 'Job posting created successfully'
    });

  } catch (error) {
    console.error('Create job posting error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create job posting',
      error: getErrorMessage(error)
    });
  }
});

/**
 * GET /api/recruitment/jobs/:id
 * Get job posting by ID
 */
router.get('/jobs/:id', async (req: Request, res: Response) => {
  try {
    const user = getUserFromRequest(req);
    const { id } = req.params;

    const jobPosting = await recruitmentService.getJobPostingById(id, user.tenantId);

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    res.json({
      success: true,
      data: jobPosting
    });

  } catch (error) {
    console.error('Get job posting error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch job posting',
      error: getErrorMessage(error)
    });
  }
});

/**
 * PUT /api/recruitment/jobs/:id
 * Update job posting
 */
router.put('/jobs/:id', async (req: Request, res: Response) => {
  try {
    const user = getUserFromRequest(req);
    const { id } = req.params;

    // Check permissions
    if (!['hr_manager', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const validation = createJobPostingSchema.partial().safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors
      });
    }

    const updatedJobPosting = await recruitmentService.updateJobPosting(
      id,
      user.tenantId,
      validation.data,
      user.userId
    );

    res.json({
      success: true,
      data: updatedJobPosting,
      message: 'Job posting updated successfully'
    });

  } catch (error) {
    console.error('Update job posting error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update job posting',
      error: getErrorMessage(error)
    });
  }
});

/**
 * POST /api/recruitment/jobs/:id/publish
 * Publish job posting
 */
router.post('/jobs/:id/publish', async (req: Request, res: Response) => {
  try {
    const user = getUserFromRequest(req);
    const { id } = req.params;

    // Check permissions
    if (!['hr_manager', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const result = await recruitmentService.publishJobPosting(
      id,
      user.tenantId,
      user.userId
    );

    res.json({
      success: true,
      data: result,
      message: 'Job posting published successfully'
    });

  } catch (error) {
    console.error('Publish job posting error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to publish job posting',
      error: getErrorMessage(error)
    });
  }
});

/**
 * POST /api/recruitment/jobs/:id/close
 * Close job posting
 */
router.post('/jobs/:id/close', async (req: Request, res: Response) => {
  try {
    const user = getUserFromRequest(req);
    const { id } = req.params;

    // Check permissions
    if (!['hr_manager', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const result = await recruitmentService.closeJobPosting(
      id,
      user.tenantId,
      user.userId
    );

    res.json({
      success: true,
      data: result,
      message: 'Job posting closed successfully'
    });

  } catch (error) {
    console.error('Close job posting error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to close job posting',
      error: getErrorMessage(error)
    });
  }
});

// ========================================================================
// APPLICATION ROUTES
// ========================================================================

/**
 * GET /api/recruitment/applications
 * Get all applications
 */
router.get('/applications', async (req: Request, res: Response) => {
  try {
    const user = getUserFromRequest(req);

    const {
      page = '1',
      limit = '10',
      status,
      jobPostingId,
      search,
      sortBy = 'appliedAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      status: status as string,
      jobPostingId: jobPostingId as string,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const result = await recruitmentService.getApplications(user.tenantId, filters);

    res.json({
      success: true,
      data: result.applications,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.total,
        totalPages: Math.ceil(result.total / parseInt(limit as string))
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: getErrorMessage(error)
    });
  }
});

/**
 * GET /api/recruitment/applications/:id
 * Get application by ID
 */
router.get('/applications/:id', async (req: Request, res: Response) => {
  try {
    const user = getUserFromRequest(req);
    const { id } = req.params;

    const application = await recruitmentService.getApplicationById(id, user.tenantId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: getErrorMessage(error)
    });
  }
});

/**
 * POST /api/recruitment/applications/:id/shortlist
 * Shortlist application
 */
router.post('/applications/:id/shortlist', async (req: Request, res: Response) => {
  try {
    const user = getUserFromRequest(req);
    const { id } = req.params;
    const { notes } = req.body;

    // Check permissions
    if (!['hr_manager', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const result = await recruitmentService.shortlistApplication(
      id,
      user.tenantId,
      user.userId,
      notes
    );

    res.json({
      success: true,
      data: result,
      message: 'Application shortlisted successfully'
    });

  } catch (error) {
    console.error('Shortlist application error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to shortlist application',
      error: getErrorMessage(error)
    });
  }
});

/**
 * POST /api/recruitment/applications/:id/reject
 * Reject application
 */
router.post('/applications/:id/reject', async (req: Request, res: Response) => {
  try {
    const user = getUserFromRequest(req);
    const { id } = req.params;
    const { reason, notes } = req.body;

    // Check permissions
    if (!['hr_manager', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const result = await recruitmentService.rejectApplication(
      id,
      user.tenantId,
      user.userId,
      reason,
      notes
    );

    res.json({
      success: true,
      data: result,
      message: 'Application rejected successfully'
    });

  } catch (error) {
    console.error('Reject application error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to reject application',
      error: getErrorMessage(error)
    });
  }
});

// ========================================================================
// DASHBOARD ROUTE
// ========================================================================

/**
 * GET /api/recruitment/dashboard
 * Get recruitment dashboard statistics
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const user = getUserFromRequest(req);
    const { startDate, endDate } = req.query;
    
    const analytics = await recruitmentService.getRecruitmentAnalytics(
      user.tenantId,
      {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      }
    );

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    
    if (isAuthError(error)) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: getErrorMessage(error)
    });
  }
});

export default router;