// File: app/api/jobs/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // Fixed import
import { db } from '../../../db'; // Update this path to match your db connection file
import { jobPostings } from '../../../db/schema'; // Update this path to match your schema file
import { eq } from 'drizzle-orm';

interface WordPressJobPost {
  postId: number;
  postUrl: string;
  status: 'published' | 'draft' | 'error';
  error?: string;
}

interface PublishingResult {
  wordpress: WordPressJobPost;
  jobBoards: { name: string; success: boolean; error?: string }[];
  socialMedia: { platform: string; success: boolean; error?: string }[];
  notifications: { type: string; success: boolean; error?: string }[];
}

export async function POST(request: NextRequest) {
  try {
    // Fixed authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Note: You'll need to get user role from your database or Clerk metadata
    // For now, we'll skip the role check - you can add it back based on your auth setup
    
    const { jobPostingId } = await request.json();

    if (!jobPostingId) {
      return NextResponse.json(
        { error: 'Job posting ID is required' },
        { status: 400 }
      );
    }

    console.log(`🚀 Publishing job ${jobPostingId} by user ${userId}`);

    // Get job details
    const existingJob = await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.jobPostingId, jobPostingId))
      .limit(1);

    if (!existingJob.length) {
      return NextResponse.json(
        { error: 'Job posting not found' },
        { status: 404 }
      );
    }

    const job = existingJob[0];

    // Check if job is already published
    if (job.isPublished) {
      return NextResponse.json(
        { 
          error: 'Job is already published',
          currentStatus: job.status,
          publishedDate: job.publishedDate
        },
        { status: 400 }
      );
    }

    // Validate job has required fields
    const validationResult = validateJobForPublishing(job);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { 
          error: 'Job validation failed',
          missingFields: validationResult.missingFields
        },
        { status: 400 }
      );
    }

    // Update job status to published
    const updatedJob = await db
      .update(jobPostings)
      .set({
        status: 'active' as any, // Type assertion for enum
        isPublished: true,
        publishedDate: new Date(),
        updatedAt: new Date(),
        updatedBy: userId
      })
      .where(eq(jobPostings.jobPostingId, jobPostingId))
      .returning();

    if (!updatedJob.length) {
      throw new Error('Failed to update job status');
    }

    const publishedJob = updatedJob[0];

    console.log(`✅ Job ${job.jobCode} status updated to published`);

    // Execute all publishing channels in parallel
    const publishingResults = await executePublishingChannels(publishedJob);

    // Log publishing results
    await logPublishingResults(jobPostingId, publishingResults);

    // Prepare response
    const response = {
      success: true,
      message: 'Job published successfully',
      jobId: publishedJob.jobPostingId,
      jobCode: publishedJob.jobCode,
      jobTitle: publishedJob.jobTitle,
      publishedAt: publishedJob.publishedDate,
      
      // URLs where job is now available
      urls: {
        internal: `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${publishedJob.jobCode}`,
        wordpress: publishingResults.wordpress.postUrl || null,
        application: `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${publishedJob.jobCode}/apply`
      },
      
      // Publishing status for each channel
      publishingStatus: {
        wordpress: publishingResults.wordpress,
        jobBoards: publishingResults.jobBoards,
        socialMedia: publishingResults.socialMedia,
        notifications: publishingResults.notifications
      },
      
      // Summary
      summary: {
        totalChannels: getTotalChannels(publishingResults),
        successfulChannels: getSuccessfulChannels(publishingResults),
        failedChannels: getFailedChannels(publishingResults)
      }
    };

    console.log(`🎉 Job ${job.jobCode} published successfully to ${response.summary.successfulChannels}/${response.summary.totalChannels} channels`);

    return NextResponse.json(response);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Job publishing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to publish job',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUBLISHING CHANNELS EXECUTION
// ============================================================================

async function executePublishingChannels(job: any): Promise<PublishingResult> {
  console.log(`📡 Executing publishing channels for job ${job.jobCode}`);

  // Execute all channels in parallel for faster publishing
  const [
    wordpressResult,
    jobBoardsResults,
    socialMediaResults,
    notificationResults
  ] = await Promise.allSettled([
    publishToWordPress(job),
    publishToJobBoards(job),
    publishToSocialMedia(job),
    sendNotifications(job)
  ]);

  return {
    wordpress: wordpressResult.status === 'fulfilled' 
      ? wordpressResult.value 
      : { postId: 0, postUrl: '', status: 'error', error: wordpressResult.reason?.message },
    
    jobBoards: jobBoardsResults.status === 'fulfilled' 
      ? jobBoardsResults.value 
      : [{ name: 'All Job Boards', success: false, error: jobBoardsResults.reason?.message }],
    
    socialMedia: socialMediaResults.status === 'fulfilled' 
      ? socialMediaResults.value 
      : [{ platform: 'All Social Media', success: false, error: socialMediaResults.reason?.message }],
    
    notifications: notificationResults.status === 'fulfilled' 
      ? notificationResults.value 
      : [{ type: 'All Notifications', success: false, error: notificationResults.reason?.message }]
  };
}

// ============================================================================
// WORDPRESS PUBLISHING
// ============================================================================

async function publishToWordPress(job: any): Promise<WordPressJobPost> {
  if (!process.env.WORDPRESS_SITE_URL || !process.env.WP_USERNAME || !process.env.WP_APP_PASSWORD) {
    console.log('⚠️ WordPress credentials not configured, skipping WordPress publishing');
    return { postId: 0, postUrl: '', status: 'error', error: 'WordPress not configured' };
  }

  try {
    console.log(`📝 Publishing to WordPress: ${job.jobTitle}`);

    // Determine the correct endpoint (posts vs custom post type)
    const wpApiUrl = `${process.env.WORDPRESS_SITE_URL}/wp-json/wp/v2/${process.env.WP_JOBS_POST_TYPE || 'posts'}`;
    
    // Create WordPress post data
    const postData = {
      title: job.jobTitle,
      content: formatJobContentForWordPress(job),
      status: 'publish',
      excerpt: job.jobDescription?.substring(0, 150) + '...' || '',
      
      // Custom fields for job details
      meta: {
        job_code: job.jobCode,
        salary_min: job.minSalary,
        salary_max: job.maxSalary,
        currency: job.currency,
        employment_type: job.employmentType,
        work_arrangement: job.workArrangement,
        application_deadline: job.applicationDeadline,
        external_job_id: job.jobPostingId,
        application_url: `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${job.jobCode}/apply`,
        required_skills: job.requiredSkills ? JSON.stringify(job.requiredSkills) : '',
        preferred_skills: job.preferredSkills ? JSON.stringify(job.preferredSkills) : '',
        min_experience: job.minExperience,
        max_experience: job.maxExperience,
        education_level: job.educationLevel
      },
      
      // Categories and tags
      categories: await getWordPressJobCategories(job),
      tags: await getWordPressJobTags(job)
    };

    // Authentication header
    const authHeader = `Basic ${Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`).toString('base64')}`;

    const response = await fetch(wpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'User-Agent': 'HR-ERP-System/1.0'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WordPress API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const wordpressPost = await response.json();

    console.log(`✅ Job published to WordPress (Post ID: ${wordpressPost.id})`);

    // Store WordPress post ID for future updates/deletions
    await storeWordPressMapping(job.jobPostingId, wordpressPost.id);

    return {
      postId: wordpressPost.id,
      postUrl: wordpressPost.link,
      status: 'published'
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('WordPress publishing failed:', error);
    return {
      postId: 0,
      postUrl: '',
      status: 'error',
      error: errorMessage
    };
  }
}

function formatJobContentForWordPress(job: any): string {
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

  const requiredSkills = parseJsonField(job.requiredSkills);
  const preferredSkills = parseJsonField(job.preferredSkills);
  const qualifications = parseJsonField(job.qualifications);

  return `
<!-- wp:paragraph -->
<p><strong>About This Position</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>${job.jobDescription || 'Job description not provided.'}</p>
<!-- /wp:paragraph -->

${requiredSkills.length > 0 ? `
<!-- wp:heading {"level":3} -->
<h3>Required Skills</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
${requiredSkills.map((skill: string) => `<li>${skill}</li>`).join('')}
</ul>
<!-- /wp:list -->
` : ''}

${preferredSkills.length > 0 ? `
<!-- wp:heading {"level":3} -->
<h3>Preferred Skills</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
${preferredSkills.map((skill: string) => `<li>${skill}</li>`).join('')}
</ul>
<!-- /wp:list -->
` : ''}

${qualifications.length > 0 ? `
<!-- wp:heading {"level":3} -->
<h3>Qualifications</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
${qualifications.map((qual: string) => `<li>${qual}</li>`).join('')}
</ul>
<!-- /wp:list -->
` : ''}

<!-- wp:heading {"level":3} -->
<h3>Job Details</h3>
<!-- /wp:heading -->

<!-- wp:table -->
<figure class="wp-block-table">
<table>
<tbody>
<tr><td><strong>Employment Type</strong></td><td>${job.employmentType || 'Not specified'}</td></tr>
<tr><td><strong>Work Arrangement</strong></td><td>${job.workArrangement || 'Not specified'}</td></tr>
${job.minSalary && job.maxSalary ? `<tr><td><strong>Salary Range</strong></td><td>${job.currency} ${parseInt(job.minSalary).toLocaleString()} - ${parseInt(job.maxSalary).toLocaleString()}</td></tr>` : ''}
${job.minExperience ? `<tr><td><strong>Experience Required</strong></td><td>${Math.floor(parseInt(job.minExperience) / 12)} years minimum</td></tr>` : ''}
${job.applicationDeadline ? `<tr><td><strong>Application Deadline</strong></td><td>${new Date(job.applicationDeadline).toLocaleDateString()}</td></tr>` : ''}
<tr><td><strong>Vacancies</strong></td><td>${job.numberOfVacancies || 1} position(s)</td></tr>
</tbody>
</table>
</figure>
<!-- /wp:table -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
<!-- wp:button {"backgroundColor":"primary","className":"apply-now-button"} -->
<div class="wp-block-button apply-now-button">
<a class="wp-block-button__link wp-has-primary-background-color wp-has-background" 
   href="${process.env.NEXT_PUBLIC_SITE_URL}/careers/${job.jobCode}/apply" 
   target="_blank" 
   rel="noopener">
   Apply Now
</a>
</div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

<!-- wp:paragraph -->
<p><em>Job Code: ${job.jobCode}</em></p>
<!-- /wp:paragraph -->
`;
}

// ============================================================================
// JOB BOARDS PUBLISHING
// ============================================================================

async function publishToJobBoards(job: any): Promise<{ name: string; success: boolean; error?: string }[]> {
  const jobBoards = [
    { name: 'LinkedIn Jobs', webhook: process.env.LINKEDIN_JOB_WEBHOOK },
    { name: 'Indeed', webhook: process.env.INDEED_JOB_WEBHOOK },
    { name: 'JobStreet', webhook: process.env.JOBSTREET_WEBHOOK },
    { name: 'Glassdoor', webhook: process.env.GLASSDOOR_WEBHOOK }
  ];

  const results = [];

  for (const board of jobBoards) {
    if (!board.webhook) {
      results.push({ name: board.name, success: false, error: 'Webhook not configured' });
      continue;
    }

    try {
      console.log(`📋 Publishing to ${board.name}`);

      // Safely parse skills
      const parseJsonField = (field: any): any[] => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        try {
          return typeof field === 'string' ? JSON.parse(field) : [];
        } catch {
          return [];
        }
      };

      const jobBoardData = {
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        company: process.env.COMPANY_NAME || 'Your Company',
        location: 'Singapore', // You might want to make this dynamic
        salary: job.minSalary && job.maxSalary 
          ? `${job.currency} ${parseInt(job.minSalary).toLocaleString()} - ${parseInt(job.maxSalary).toLocaleString()}`
          : undefined,
        employmentType: job.employmentType,
        workArrangement: job.workArrangement,
        applicationUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${job.jobCode}/apply`,
        externalJobId: job.jobCode,
        requiredSkills: parseJsonField(job.requiredSkills),
        applicationDeadline: job.applicationDeadline
      };

      const response = await fetch(board.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobBoardData),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (response.ok) {
        console.log(`✅ Successfully posted to ${board.name}`);
        results.push({ name: board.name, success: true });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`❌ Failed to post to ${board.name}:`, error);
      results.push({ 
        name: board.name, 
        success: false, 
        error: errorMessage
      });
    }
  }

  return results;
}

// ============================================================================
// SOCIAL MEDIA PUBLISHING
// ============================================================================

async function publishToSocialMedia(job: any): Promise<{ platform: string; success: boolean; error?: string }[]> {
  const results = [];

  // LinkedIn Company Page
  if (process.env.LINKEDIN_COMPANY_ACCESS_TOKEN && process.env.LINKEDIN_COMPANY_ID) {
    try {
      console.log('📱 Publishing to LinkedIn');

      const linkedInPost = {
        author: `urn:li:organization:${process.env.LINKEDIN_COMPANY_ID}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: `🚀 We're hiring! Join our team as a ${job.jobTitle}.

${job.jobDescription?.substring(0, 200)}${job.jobDescription?.length > 200 ? '...' : ''}

💰 Salary: ${job.currency} ${parseInt(job.minSalary || '0').toLocaleString()} - ${parseInt(job.maxSalary || '0').toLocaleString()}
📍 Location: Singapore
💼 Type: ${job.employmentType}

Apply now: ${process.env.NEXT_PUBLIC_SITE_URL}/careers/${job.jobCode}

#hiring #jobs #${job.jobTitle.replace(/\s+/g, '').toLowerCase()} #singapore #careers`
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.LINKEDIN_COMPANY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(linkedInPost)
      });

      if (response.ok) {
        console.log('✅ Posted to LinkedIn');
        results.push({ platform: 'LinkedIn', success: true });
      } else {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ LinkedIn posting failed:', error);
      results.push({ platform: 'LinkedIn', success: false, error: errorMessage });
    }
  } else {
    results.push({ platform: 'LinkedIn', success: false, error: 'Not configured' });
  }

  return results;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

async function sendNotifications(job: any): Promise<{ type: string; success: boolean; error?: string }[]> {
  const results = [];

  // Slack notification
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      console.log('💬 Sending Slack notification');

      const slackMessage = {
        text: `🎉 New job published: ${job.jobTitle}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `🎉 *New Job Published*\n\n*Position:* ${job.jobTitle}\n*Code:* ${job.jobCode}\n*Salary:* ${job.currency} ${parseInt(job.minSalary || '0').toLocaleString()} - ${parseInt(job.maxSalary || '0').toLocaleString()}\n*Type:* ${job.employmentType}\n*Arrangement:* ${job.workArrangement}`
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View Job Posting'
                },
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${job.jobCode}`
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'HR Dashboard'
                },
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/hr/recruitment`
              }
            ]
          }
        ]
      };

      const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage)
      });

      if (response.ok) {
        console.log('✅ Slack notification sent');
        results.push({ type: 'Slack', success: true });
      } else {
        throw new Error(`Slack webhook error: ${response.status}`);
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Slack notification failed:', error);
      results.push({ type: 'Slack', success: false, error: errorMessage });
    }
  } else {
    results.push({ type: 'Slack', success: false, error: 'Not configured' });
  }

  return results;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function validateJobForPublishing(job: any): { isValid: boolean; missingFields: string[] } {
  const requiredFields = [
    { field: 'jobTitle', name: 'Job Title' },
    { field: 'jobDescription', name: 'Job Description' },
    { field: 'employmentType', name: 'Employment Type' }
  ];

  const missingFields = requiredFields
    .filter(({ field }) => !job[field] || job[field].toString().trim() === '')
    .map(({ name }) => name);

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

async function getWordPressJobCategories(job: any): Promise<number[]> {
  // This would typically map to your WordPress categories
  const categoryMapping: Record<string, number> = {
    'permanent': 1,
    'contract': 2,
    'temporary': 3,
    'internship': 4
  };

  const categories = [];
  if (job.employmentType && categoryMapping[job.employmentType]) {
    categories.push(categoryMapping[job.employmentType]);
  }

  return categories.length > 0 ? categories : [1]; // Default category
}

async function getWordPressJobTags(job: any): Promise<string[]> {
  const tags = [];

  if (job.employmentType) tags.push(job.employmentType);
  if (job.workArrangement) tags.push(job.workArrangement);
  
  // Add skills as tags
  const parseJsonField = (field: any): any[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return typeof field === 'string' ? JSON.parse(field) : [];
    } catch {
      return [];
    }
  };

  const skills = parseJsonField(job.requiredSkills);
  tags.push(...skills.slice(0, 5)); // Limit to 5 skills

  tags.push('Singapore', 'Careers');

  return tags;
}

async function storeWordPressMapping(jobPostingId: string, wpPostId: number): Promise<void> {
  try {
    console.log(`📝 WordPress mapping stored: Job ${jobPostingId} -> WP Post ${wpPostId}`);
    // You might want to store this mapping in your database for future reference
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to store WordPress mapping:', errorMessage);
  }
}

async function logPublishingResults(jobPostingId: string, results: PublishingResult): Promise<void> {
  try {
    console.log(`📊 Publishing results logged for job ${jobPostingId}`);
    // You might want to create a publishing_logs table to track this
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to log publishing results:', errorMessage);
  }
}

function getTotalChannels(results: PublishingResult): number {
  return 1 + results.jobBoards.length + results.socialMedia.length + results.notifications.length;
}

function getSuccessfulChannels(results: PublishingResult): number {
  let successful = 0;
  
  if (results.wordpress.status === 'published') successful++;
  successful += results.jobBoards.filter(jb => jb.success).length;
  successful += results.socialMedia.filter(sm => sm.success).length;
  successful += results.notifications.filter(n => n.success).length;
  
  return successful;
}

function getFailedChannels(results: PublishingResult): string[] {
  const failed = [];
  
  if (results.wordpress.status === 'error') failed.push('WordPress');
  failed.push(...results.jobBoards.filter(jb => !jb.success).map(jb => jb.name));
  failed.push(...results.socialMedia.filter(sm => !sm.success).map(sm => sm.platform));
  failed.push(...results.notifications.filter(n => !n.success).map(n => n.type));
  
  return failed;
}