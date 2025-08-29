import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
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

// Helper function to check if error is authentication error
function isAuthError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return message === 'Authentication required';
}

// Helper function to extract user info from headers or token
function getUserFromRequest(c: any) {
  // Option 1: From headers (simple approach)
  const userId = c.req.header('x-user-id');
  const tenantId = c.req.header('x-tenant-id');
  const organizationId = c.req.header('x-organization-id');

  // Option 2: From Authorization header (JWT token)
  // const token = c.req.header('authorization')?.replace('Bearer ', '');
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!userId || !tenantId) {
    throw new HTTPException(401, { message: 'Authentication required' });
  }

  return {
    userId,
    tenantId,
    organizationId: organizationId || tenantId, // fallback
    role: c.req.header('x-user-role') || 'employee'
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

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  status: z.string().optional(),
  department: z.string().optional(),
  jobPostingId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

const applicationActionSchema = z.object({
  notes: z.string().optional(),
  reason: z.string().optional()
});

// ========================================================================
// JOB POSTING ROUTES
// ========================================================================

/**
 * GET /jobs
 * Get all job postings
 */
app.get('/jobs', zValidator('query', querySchema), async (c) => {
  try {
    const user = getUserFromRequest(c);
    const query = c.req.valid('query');

    const filters = {
      page: parseInt(query.page),
      limit: parseInt(query.limit),
      status: query.status,
      department: query.department,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder
    };

    const result = await recruitmentService.getJobPostings(user.tenantId, filters);

    return c.json({
      success: true,
      data: result.jobPostings,
      pagination: {
        page: parseInt(query.page),
        limit: parseInt(query.limit),
        total: result.total,
        totalPages: Math.ceil(result.total / parseInt(query.limit))
      }
    });

  } catch (error) {
    console.error('Get job postings error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to fetch job postings',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * POST /jobs
 * Create a new job posting
 */
app.post('/jobs', zValidator('json', createJobPostingSchema), async (c) => {
  try {
    const user = getUserFromRequest(c);

    // Check permissions (simple role-based check)
    if (!['hr_manager', 'admin'].includes(user.role)) {
      throw new HTTPException(403, { message: 'Insufficient permissions' });
    }

    const data = c.req.valid('json');

    const jobPosting = await recruitmentService.createJobPosting(
      user.tenantId,
      data,
      user.userId
    );

    return c.json({
      success: true,
      data: jobPosting,
      message: 'Job posting created successfully'
    }, 201);

  } catch (error) {
    console.error('Create job posting error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to create job posting',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * GET /jobs/:id
 * Get job posting by ID
 */
app.get('/jobs/:id', async (c) => {
  try {
    const user = getUserFromRequest(c);
    const id = c.req.param('id');

    const jobPosting = await recruitmentService.getJobPostingById(id, user.tenantId);

    if (!jobPosting) {
      throw new HTTPException(404, { message: 'Job posting not found' });
    }

    return c.json({
      success: true,
      data: jobPosting
    });

  } catch (error) {
    console.error('Get job posting error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to fetch job posting',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * PUT /jobs/:id
 * Update job posting
 */
app.put('/jobs/:id', zValidator('json', createJobPostingSchema.partial()), async (c) => {
  try {
    const user = getUserFromRequest(c);
    const id = c.req.param('id');

    // Check permissions
    if (!['hr_manager', 'admin'].includes(user.role)) {
      throw new HTTPException(403, { message: 'Insufficient permissions' });
    }

    const data = c.req.valid('json');

    const updatedJobPosting = await recruitmentService.updateJobPosting(
      id,
      user.tenantId,
      data,
      user.userId
    );

    return c.json({
      success: true,
      data: updatedJobPosting,
      message: 'Job posting updated successfully'
    });

  } catch (error) {
    console.error('Update job posting error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to update job posting',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * POST /jobs/:id/publish
 * Publish job posting
 */
app.post('/jobs/:id/publish', async (c) => {
  try {
    const user = getUserFromRequest(c);
    const id = c.req.param('id');

    // Check permissions
    if (!['hr_manager', 'admin'].includes(user.role)) {
      throw new HTTPException(403, { message: 'Insufficient permissions' });
    }

    const result = await recruitmentService.publishJobPosting(
      id,
      user.tenantId,
      user.userId
    );

    return c.json({
      success: true,
      data: result,
      message: 'Job posting published successfully'
    });

  } catch (error) {
    console.error('Publish job posting error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to publish job posting',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * POST /jobs/:id/close
 * Close job posting
 */
app.post('/jobs/:id/close', async (c) => {
  try {
    const user = getUserFromRequest(c);
    const id = c.req.param('id');

    // Check permissions
    if (!['hr_manager', 'admin'].includes(user.role)) {
      throw new HTTPException(403, { message: 'Insufficient permissions' });
    }

    const result = await recruitmentService.closeJobPosting(
      id,
      user.tenantId,
      user.userId
    );

    return c.json({
      success: true,
      data: result,
      message: 'Job posting closed successfully'
    });

  } catch (error) {
    console.error('Close job posting error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to close job posting',
      cause: getErrorMessage(error)
    });
  }
});

// ========================================================================
// APPLICATION ROUTES
// ========================================================================

/**
 * GET /applications
 * Get all applications
 */
app.get('/applications', zValidator('query', querySchema), async (c) => {
  try {
    const user = getUserFromRequest(c);
    const query = c.req.valid('query');

    const filters = {
      page: parseInt(query.page),
      limit: parseInt(query.limit),
      status: query.status,
      jobPostingId: query.jobPostingId,
      search: query.search,
      sortBy: query.sortBy || 'appliedAt',
      sortOrder: query.sortOrder
    };

    const result = await recruitmentService.getApplications(user.tenantId, filters);

    return c.json({
      success: true,
      data: result.applications,
      pagination: {
        page: parseInt(query.page),
        limit: parseInt(query.limit),
        total: result.total,
        totalPages: Math.ceil(result.total / parseInt(query.limit))
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to fetch applications',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * GET /applications/:id
 * Get application by ID
 */
app.get('/applications/:id', async (c) => {
  try {
    const user = getUserFromRequest(c);
    const id = c.req.param('id');

    const application = await recruitmentService.getApplicationById(id, user.tenantId);

    if (!application) {
      throw new HTTPException(404, { message: 'Application not found' });
    }

    return c.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to fetch application',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * POST /applications/:id/shortlist
 * Shortlist application
 */
app.post('/applications/:id/shortlist', zValidator('json', applicationActionSchema), async (c) => {
  try {
    const user = getUserFromRequest(c);
    const id = c.req.param('id');
    const { notes } = c.req.valid('json');

    // Check permissions
    if (!['hr_manager', 'admin'].includes(user.role)) {
      throw new HTTPException(403, { message: 'Insufficient permissions' });
    }

    const result = await recruitmentService.shortlistApplication(
      id,
      user.tenantId,
      user.userId,
      notes
    );

    return c.json({
      success: true,
      data: result,
      message: 'Application shortlisted successfully'
    });

  } catch (error) {
    console.error('Shortlist application error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to shortlist application',
      cause: getErrorMessage(error)
    });
  }
});

/**
 * POST /applications/:id/reject
 * Reject application
 */
app.post('/applications/:id/reject', zValidator('json', applicationActionSchema), async (c) => {
  try {
    const user = getUserFromRequest(c);
    const id = c.req.param('id');
    const { reason, notes } = c.req.valid('json');

    // Check permissions
    if (!['hr_manager', 'admin'].includes(user.role)) {
      throw new HTTPException(403, { message: 'Insufficient permissions' });
    }

    const result = await recruitmentService.rejectApplication(
      id,
      user.tenantId,
      user.userId,
      reason,
      notes
    );

    return c.json({
      success: true,
      data: result,
      message: 'Application rejected successfully'
    });

  } catch (error) {
    console.error('Reject application error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to reject application',
      cause: getErrorMessage(error)
    });
  }
});

// ========================================================================
// DASHBOARD ROUTE
// ========================================================================

/**
 * GET /dashboard
 * Get recruitment dashboard statistics
 */
app.get('/dashboard', zValidator('query', querySchema), async (c) => {
  try {
    const user = getUserFromRequest(c);
    const query = c.req.valid('query');
    
    const analytics = await recruitmentService.getRecruitmentAnalytics(
      user.tenantId,
      {
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined
      }
    );

    return c.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    
    if (error instanceof HTTPException) {
      throw error;
    }

    if (isAuthError(error)) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    throw new HTTPException(500, { 
      message: 'Failed to fetch dashboard statistics',
      cause: getErrorMessage(error)
    });
  }
});

export default app;