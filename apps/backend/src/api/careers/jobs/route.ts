// File: app/api/careers/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db'; // Update this path to match your db connection file
import { jobPostings } from '../../../db/schema'; // Update this path to match your schema file
import { eq, and, desc, asc, ilike, gte, lte, or, like } from 'drizzle-orm';

interface JobFilters {
  department?: string;
  employmentType?: string;
  workArrangement?: string;
  minSalary?: number;
  maxSalary?: number;
  search?: string;
  location?: string;
  sortBy?: 'newest' | 'oldest' | 'salary_high' | 'salary_low' | 'title';
  limit?: number;
  offset?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters with proper typing
    const filters: JobFilters = {
      department: searchParams.get('department') || undefined,
      employmentType: searchParams.get('employmentType') || undefined,
      workArrangement: searchParams.get('workArrangement') || undefined,
      minSalary: searchParams.get('minSalary') ? parseInt(searchParams.get('minSalary')!) : undefined,
      maxSalary: searchParams.get('maxSalary') ? parseInt(searchParams.get('maxSalary')!) : undefined,
      search: searchParams.get('search') || undefined,
      location: searchParams.get('location') || undefined,
      sortBy: (searchParams.get('sortBy') as JobFilters['sortBy']) || 'newest',
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0')
    };

    console.log('📋 Fetching published jobs with filters:', filters);

    // Build the base conditions
    const baseConditions = [
      eq(jobPostings.isPublished, true),
      eq(jobPostings.status, 'active' as any) // Type assertion for enum
    ];

    // Additional filter conditions
    const filterConditions = [];

    // Employment type filter with proper enum typing
    if (filters.employmentType) {
      const validEmploymentTypes = ['permanent', 'contract', 'temporary', 'internship', 'freelance'];
      if (validEmploymentTypes.includes(filters.employmentType)) {
        filterConditions.push(eq(jobPostings.employmentType, filters.employmentType as any));
      }
    }

    // Work arrangement filter with proper enum typing
    if (filters.workArrangement) {
      const validWorkArrangements = ['office', 'remote', 'hybrid'];
      if (validWorkArrangements.includes(filters.workArrangement)) {
        filterConditions.push(eq(jobPostings.workArrangement, filters.workArrangement as any));
      }
    }

    // Salary range filters - convert to string for decimal fields
    if (filters.minSalary) {
      filterConditions.push(gte(jobPostings.maxSalary, filters.minSalary.toString()));
    }
    if (filters.maxSalary) {
      filterConditions.push(lte(jobPostings.minSalary, filters.maxSalary.toString()));
    }

    // Search filter (job title and description)
    if (filters.search) {
      filterConditions.push(
        or(
          ilike(jobPostings.jobTitle, `%${filters.search}%`),
          ilike(jobPostings.jobDescription, `%${filters.search}%`)
        )
      );
    }

    // Combine all conditions
    const allConditions = [...baseConditions, ...filterConditions];
    const whereClause = and(...allConditions);

    // Build and execute the main query with proper Drizzle typing
    const selectFields = {
      // Job basic info
      jobPostingId: jobPostings.jobPostingId,
      jobCode: jobPostings.jobCode,
      jobTitle: jobPostings.jobTitle,
      jobDescription: jobPostings.jobDescription,
      
      // Salary and compensation
      minSalary: jobPostings.minSalary,
      maxSalary: jobPostings.maxSalary,
      currency: jobPostings.currency,
      
      // Job details
      employmentType: jobPostings.employmentType,
      workArrangement: jobPostings.workArrangement,
      numberOfVacancies: jobPostings.numberOfVacancies,
      
      // Requirements
      requiredSkills: jobPostings.requiredSkills,
      preferredSkills: jobPostings.preferredSkills,
      qualifications: jobPostings.qualifications,
      minExperience: jobPostings.minExperience,
      maxExperience: jobPostings.maxExperience,
      educationLevel: jobPostings.educationLevel,
      
      // Application details
      applicationDeadline: jobPostings.applicationDeadline,
      allowCoverLetter: jobPostings.allowCoverLetter,
      requireCoverLetter: jobPostings.requireCoverLetter,
      
      // Meta info
      publishedDate: jobPostings.publishedDate,
      totalViews: jobPostings.totalViews,
      totalApplications: jobPostings.totalApplications,
      createdAt: jobPostings.createdAt,
      updatedAt: jobPostings.updatedAt,
    };

    // Execute query with proper ordering based on sortBy
    let jobs;
    switch (filters.sortBy) {
      case 'oldest':
        jobs = await db
          .select(selectFields)
          .from(jobPostings)
          .where(whereClause)
          .orderBy(asc(jobPostings.publishedDate))
          .limit(filters.limit!)
          .offset(filters.offset!);
        break;
      case 'salary_high':
        jobs = await db
          .select(selectFields)
          .from(jobPostings)
          .where(whereClause)
          .orderBy(desc(jobPostings.maxSalary))
          .limit(filters.limit!)
          .offset(filters.offset!);
        break;
      case 'salary_low':
        jobs = await db
          .select(selectFields)
          .from(jobPostings)
          .where(whereClause)
          .orderBy(asc(jobPostings.minSalary))
          .limit(filters.limit!)
          .offset(filters.offset!);
        break;
      case 'title':
        jobs = await db
          .select(selectFields)
          .from(jobPostings)
          .where(whereClause)
          .orderBy(asc(jobPostings.jobTitle))
          .limit(filters.limit!)
          .offset(filters.offset!);
        break;
      case 'newest':
      default:
        jobs = await db
          .select(selectFields)
          .from(jobPostings)
          .where(whereClause)
          .orderBy(desc(jobPostings.publishedDate))
          .limit(filters.limit!)
          .offset(filters.offset!);
        break;
    }

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: jobPostings.jobPostingId })
      .from(jobPostings)
      .where(whereClause);
    
    const totalJobs = totalCountResult.length;

    // Transform jobs for frontend consumption
    const transformedJobs = jobs.map((job: any) => {
      // Safely parse JSON fields
      const parseJsonField = (field: any): any[] => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        try {
          return typeof field === 'string' ? JSON.parse(field) : [];
        } catch {
          return [];
        }
      };

      return {
        ...job,
        // Parse JSON fields safely
        requiredSkills: parseJsonField(job.requiredSkills),
        preferredSkills: parseJsonField(job.preferredSkills),
        qualifications: parseJsonField(job.qualifications),
        
        // Format salary for display - convert decimal to number
        salaryRange: job.minSalary && job.maxSalary 
          ? `${job.currency} ${parseFloat(job.minSalary).toLocaleString()} - ${parseFloat(job.maxSalary).toLocaleString()}`
          : 'Salary not specified',
        
        // Add application URL
        applicationUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${job.jobCode}/apply`,
        
        // Add view URL
        viewUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${job.jobCode}`,
        
        // Format dates
        publishedDateFormatted: job.publishedDate ? new Date(job.publishedDate).toLocaleDateString() : null,
        applicationDeadlineFormatted: job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : null,
        
        // Calculate days until deadline
        daysUntilDeadline: job.applicationDeadline 
          ? Math.ceil((new Date(job.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : null,
        
        // Add urgency flag
        isUrgent: job.applicationDeadline 
          ? Math.ceil((new Date(job.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 7
          : false,
        
        // Convert to numbers for frontend (they're already numbers in schema)
        totalViews: job.totalViews || 0,
        totalApplications: job.totalApplications || 0
      };
    });

    console.log(`✅ Found ${jobs.length} published jobs out of ${totalJobs} total`);

    return NextResponse.json({
      success: true,
      jobs: transformedJobs,
      pagination: {
        total: totalJobs,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: (filters.offset! + filters.limit!) < totalJobs,
        page: Math.floor(filters.offset! / filters.limit!) + 1,
        totalPages: Math.ceil(totalJobs / filters.limit!)
      },
      filters: {
        applied: filters,
        available: await getAvailableFilters()
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to fetch published jobs:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch jobs',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET INDIVIDUAL JOB
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const { jobCode, incrementView = false } = await request.json();

    if (!jobCode) {
      return NextResponse.json(
        { error: 'Job code is required' },
        { status: 400 }
      );
    }

    // Get job by code
    const job = await db
      .select()
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.jobCode, jobCode),
          eq(jobPostings.isPublished, true),
          eq(jobPostings.status, 'active' as any)
        )
      )
      .limit(1);

    if (!job.length) {
      return NextResponse.json(
        { error: 'Job not found or not published' },
        { status: 404 }
      );
    }

    const jobData = job[0];

    // Increment view count if requested
    if (incrementView) {
      const currentViews = parseInt(jobData.totalViews?.toString() || '0');
      await db
        .update(jobPostings)
        .set({
          totalViews: currentViews + 1, // Keep as integer since schema expects integer
          updatedAt: new Date()
        })
        .where(eq(jobPostings.jobPostingId, jobData.jobPostingId));
    }

    // Transform job data
    const parseJsonField = (field: any): any[] => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      try {
        return typeof field === 'string' ? JSON.parse(field) : [];
      } catch {
        return [];
      }
    };

    const transformedJob = {
      ...jobData,
      requiredSkills: parseJsonField(jobData.requiredSkills),
      preferredSkills: parseJsonField(jobData.preferredSkills),
      qualifications: parseJsonField(jobData.qualifications),
      salaryRange: jobData.minSalary && jobData.maxSalary 
        ? `${jobData.currency} ${parseFloat(jobData.minSalary).toLocaleString()} - ${parseFloat(jobData.maxSalary).toLocaleString()}`
        : 'Salary not specified',
      applicationUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${jobData.jobCode}/apply`,
      experienceRange: jobData.minExperience && jobData.maxExperience
        ? `${Math.floor(jobData.minExperience / 12)}-${Math.floor(jobData.maxExperience / 12)} years`
        : jobData.minExperience 
          ? `${Math.floor(jobData.minExperience / 12)}+ years`
          : 'Experience level flexible',
      daysUntilDeadline: jobData.applicationDeadline 
        ? Math.ceil((new Date(jobData.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null,
      isExpired: jobData.applicationDeadline 
        ? new Date(jobData.applicationDeadline) < new Date()
        : false,
      // Convert to numbers for frontend (they're already numbers in schema)
      totalViews: jobData.totalViews || 0,
      totalApplications: jobData.totalApplications || 0
    };

    return NextResponse.json({
      success: true,
      job: transformedJob
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to fetch job details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getAvailableFilters() {
  try {
    // Get unique values for filter options
    const employmentTypes = await db
      .selectDistinct({ employmentType: jobPostings.employmentType })
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.isPublished, true),
          eq(jobPostings.status, 'active' as any)
        )
      );

    const workArrangements = await db
      .selectDistinct({ workArrangement: jobPostings.workArrangement })
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.isPublished, true),
          eq(jobPostings.status, 'active' as any)
        )
      );

    // Get salary ranges for filter options
    const salaryRanges = [
      { label: 'Under $3,000', min: 0, max: 3000 },
      { label: '$3,000 - $5,000', min: 3000, max: 5000 },
      { label: '$5,000 - $8,000', min: 5000, max: 8000 },
      { label: '$8,000 - $12,000', min: 8000, max: 12000 },
      { label: 'Above $12,000', min: 12000, max: null }
    ];

    return {
      employmentTypes: employmentTypes.map((et: any) => et.employmentType).filter(Boolean),
      workArrangements: workArrangements.map((wa: any) => wa.workArrangement).filter(Boolean),
      salaryRanges,
      sortOptions: [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'salary_high', label: 'Highest Salary' },
        { value: 'salary_low', label: 'Lowest Salary' },
        { value: 'title', label: 'Job Title A-Z' }
      ]
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to get filter options:', errorMessage);
    return {
      employmentTypes: [],
      workArrangements: [],
      salaryRanges: [],
      sortOptions: []
    };
  }
}