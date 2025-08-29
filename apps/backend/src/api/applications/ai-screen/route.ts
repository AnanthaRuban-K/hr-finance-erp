// File: apps/backend/src/api/applications/ai-screen/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../db'; // Points to apps/backend/src/db/index.ts
import { jobApplications, jobPostings } from '../../../db/schema'; // Points to apps/backend/src/db/schema.ts
import { eq } from 'drizzle-orm';

interface ScreeningResult {
  overallScore: number;
  skillsMatch: number;
  experienceScore: number;
  educationScore: number;
  notes: string;
  strengths: string[];
  concerns: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Fixed authentication check - await the auth() function
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get application details
    const application = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.applicationId, applicationId))
      .limit(1);

    if (!application.length) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    const app = application[0];

    // Get job requirements
    const jobDetails = await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.jobPostingId, app.jobPostingId))
      .limit(1);

    if (!jobDetails.length) {
      return NextResponse.json(
        { error: 'Job posting not found' },
        { status: 404 }
      );
    }

    const job = jobDetails[0];

    console.log(`🤖 Starting AI screening for application ${applicationId}`);

    // Perform AI screening
    const screeningResult = await performAIScreening(app, job);

    // Update application with AI screening results
    await db
      .update(jobApplications)
      .set({
        aiScreeningScore: screeningResult.overallScore.toString(),
        aiScreeningNotes: screeningResult.notes,
        skillsMatchPercentage: screeningResult.skillsMatch, // Keep as integer since schema expects integer
        status: screeningResult.overallScore >= 3.5 ? 'shortlisted' : 'screening',
        lastStatusUpdate: new Date()
      })
      .where(eq(jobApplications.applicationId, applicationId));

    // Notify HR if high-scoring candidate
    if (screeningResult.overallScore >= 4.0) {
      await notifyHRHighScoringCandidate(app, screeningResult);
    }

    console.log(`✅ AI screening completed for ${app.firstName} ${app.lastName} - Score: ${screeningResult.overallScore}/5.0`);

    return NextResponse.json({
      success: true,
      applicationId,
      screening: screeningResult,
      status: screeningResult.overallScore >= 3.5 ? 'shortlisted' : 'screening',
      message: screeningResult.overallScore >= 3.5 
        ? 'Candidate automatically shortlisted' 
        : 'Screening completed - manual review required'
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('AI screening error:', error);
    return NextResponse.json(
      { 
        error: 'AI screening failed',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// AI SCREENING IMPLEMENTATION
// ============================================================================

async function performAIScreening(application: any, job: any): Promise<ScreeningResult> {
  try {
    // Try OpenAI first (if API key is available)
    if (process.env.OPENAI_API_KEY) {
      console.log('🧠 Using OpenAI for advanced screening...');
      return await analyzeWithOpenAI(application, job);
    }

    // Fallback to rule-based analysis
    console.log('📋 Using rule-based screening (fallback)...');
    return await ruleBasedAnalysis(application, job);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('AI screening failed, using fallback:', errorMessage);
    return await ruleBasedAnalysis(application, job);
  }
}

async function analyzeWithOpenAI(application: any, job: any): Promise<ScreeningResult> {
  const prompt = `
You are an expert HR recruiter analyzing a job application. Please provide an objective assessment.

JOB REQUIREMENTS:
- Position: ${job.jobTitle}
- Required Skills: ${JSON.stringify(job.requiredSkills || [])}
- Preferred Skills: ${JSON.stringify(job.preferredSkills || [])}
- Minimum Experience: ${job.minExperience || 0} months
- Education Level: ${job.educationLevel || 'Not specified'}
- Employment Type: ${job.employmentType}

CANDIDATE PROFILE:
- Name: ${application.firstName} ${application.lastName}
- Current Position: ${application.currentJobTitle || 'Not specified'}
- Current Company: ${application.currentCompany || 'Not specified'}
- Total Experience: ${application.totalExperience || 0} months
- Expected Salary: ${application.currency} ${application.expectedSalary || 'Not specified'}
- Notice Period: ${application.noticePeriod || 'Not specified'} days

Please analyze this candidate and respond with a JSON object containing:
{
  "overallScore": (number 1-5, where 5 is excellent match),
  "skillsMatch": (percentage 0-100 based on skills alignment),
  "experienceScore": (number 1-5 based on relevant experience),
  "educationScore": (number 1-5 based on education fit),
  "strengths": ["strength1", "strength2", "strength3"],
  "concerns": ["concern1", "concern2"],
  "notes": "Brief 2-3 sentence summary of the assessment"
}

Be objective and fair. Consider both technical qualifications and career progression.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR recruiter. Provide fair, objective assessments of job candidates. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    const analysis = JSON.parse(content);
    return {
      overallScore: Math.min(5, Math.max(1, analysis.overallScore)),
      skillsMatch: Math.min(100, Math.max(0, analysis.skillsMatch)),
      experienceScore: Math.min(5, Math.max(1, analysis.experienceScore)),
      educationScore: Math.min(5, Math.max(1, analysis.educationScore)),
      notes: analysis.notes || 'AI analysis completed',
      strengths: analysis.strengths || [],
      concerns: analysis.concerns || []
    };
  } catch (parseError: unknown) {
    const parseErrorMessage = parseError instanceof Error ? parseError.message : 'Parse error';
    console.error('Failed to parse OpenAI response:', content);
    throw new Error(`Invalid AI response format: ${parseErrorMessage}`);
  }
}

async function ruleBasedAnalysis(application: any, job: any): Promise<ScreeningResult> {
  let skillsMatch = 0;
  let experienceScore = 1;
  let educationScore = 3; // Default neutral score

  const strengths: string[] = [];
  const concerns: string[] = [];

  // === SKILLS MATCHING ===
  if (job.requiredSkills && job.requiredSkills.length > 0) {
    const candidateText = `${application.currentJobTitle || ''} ${application.currentCompany || ''}`.toLowerCase();
    const requiredSkills = Array.isArray(job.requiredSkills) 
      ? job.requiredSkills 
      : JSON.parse(job.requiredSkills as string);
    
    const matchedSkills = requiredSkills.filter((skill: string) => 
      candidateText.includes(skill.toLowerCase())
    );
    
    skillsMatch = Math.round((matchedSkills.length / requiredSkills.length) * 100);
    
    if (skillsMatch >= 70) {
      strengths.push('Strong skills alignment');
    } else if (skillsMatch < 40) {
      concerns.push('Limited skills match with requirements');
    }
  } else {
    skillsMatch = 50; // Default when no skills specified
  }

  // === EXPERIENCE SCORING ===
  const requiredExp = job.minExperience ? parseInt(job.minExperience.toString()) : 0;
  const candidateExp = application.totalExperience ? parseInt(application.totalExperience.toString()) : 0;
  
  if (candidateExp >= requiredExp) {
    const overExp = candidateExp - requiredExp;
    experienceScore = Math.min(5, 3 + (overExp / 12)); // Extra points for additional experience
    
    if (overExp >= 24) {
      strengths.push('Extensive relevant experience');
    } else if (overExp >= 12) {
      strengths.push('Good experience level');
    }
  } else {
    const shortfall = requiredExp - candidateExp;
    experienceScore = Math.max(1, 3 - (shortfall / 12));
    
    if (shortfall >= 12) {
      concerns.push('Insufficient experience for role requirements');
    } else {
      concerns.push('Slightly below required experience level');
    }
  }

  // === SALARY EXPECTATIONS ===
  if (application.expectedSalary && job.maxSalary) {
    const expectedSalary = parseFloat(application.expectedSalary.toString());
    const maxBudget = parseFloat(job.maxSalary.toString());
    
    if (expectedSalary > maxBudget * 1.2) {
      concerns.push('Salary expectations significantly above budget');
    } else if (expectedSalary <= maxBudget) {
      strengths.push('Salary expectations within budget');
    }
  }

  // === NOTICE PERIOD ===
  if (application.noticePeriod) {
    const noticePeriod = parseInt(application.noticePeriod.toString());
    if (noticePeriod <= 30) {
      strengths.push('Short notice period - quick availability');
    } else if (noticePeriod >= 90) {
      concerns.push('Long notice period may delay start date');
    }
  }

  // === CALCULATE OVERALL SCORE ===
  const weightedScore = (
    (skillsMatch / 100) * 2 +    // Skills: 40% weight
    experienceScore * 0.4 +      // Experience: 40% weight  
    educationScore * 0.2         // Education: 20% weight
  ) / 1;

  const overallScore = Math.min(5, Math.max(1, weightedScore));

  // === GENERATE NOTES ===
  const notes = `Skills match: ${skillsMatch}%. Experience: ${candidateExp} months vs ${requiredExp} required. ${strengths.length > 0 ? 'Key strengths identified.' : ''} ${concerns.length > 0 ? 'Some concerns noted.' : ''}`;

  return {
    overallScore: Math.round(overallScore * 10) / 10,
    skillsMatch,
    experienceScore: Math.round(experienceScore * 10) / 10,
    educationScore,
    notes: notes.trim(),
    strengths,
    concerns
  };
}

async function notifyHRHighScoringCandidate(application: any, screening: ScreeningResult) {
  try {
    // Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🌟 High-scoring candidate alert!`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `🌟 *High-Scoring Candidate Alert*\n\n*Candidate:* ${application.firstName} ${application.lastName}\n*Overall Score:* ${screening.overallScore}/5.0 ⭐\n*Skills Match:* ${screening.skillsMatch}%\n*Current Role:* ${application.currentJobTitle || 'Not specified'}\n\n*Key Strengths:*\n${screening.strengths.map((s: string) => `• ${s}`).join('\n')}\n\n*Application ID:* ${application.applicationCode}`
              }
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Review Application'
                  },
                  url: `${process.env.NEXT_PUBLIC_SITE_URL}/hr/recruitment/applications/${application.applicationId}`
                }
              ]
            }
          ]
        })
      });
    }

    console.log(`📧 Notified HR team about high-scoring candidate: ${application.firstName} ${application.lastName}`);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to notify HR team:', errorMessage);
  }
}

// Manual trigger endpoint for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get('applicationId');

  if (!applicationId) {
    return NextResponse.json(
      { error: 'Application ID required for manual screening' },
      { status: 400 }
    );
  }

  // Trigger the same screening process
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId })
  });

  return POST(postRequest);
}