import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InterviewDetails from '@/components/recruitment/InterviewDetails';

interface InterviewPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: InterviewPageProps): Promise<Metadata> {
  return {
    title: `Interview ${params.id}`,
    description: 'View interview details',
  };
}

async function getInterview(id: string) {
  if (id === 'not-found') {
    return null;
  }
  
  return {
    interviewId: id,
    applicationId: '1',
    jobPostingId: '1',
    interviewType: 'video_interview',
    interviewRound: 1,
    interviewTitle: 'Technical Interview - Software Engineer',
    scheduledDate: '2024-07-25',
    scheduledStartTime: '2024-07-25T10:00:00Z',
    scheduledEndTime: '2024-07-25T11:00:00Z',
    interviewMode: 'video_call',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
    candidate: {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@email.com',
      phone: '+65 9123 4567'
    },
    jobPosting: {
      jobTitle: 'Software Engineer',
      departmentName: 'Information Technology'
    },
    primaryInterviewer: {
      employeeId: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      designation: 'Tech Lead'
    },
    panelMembers: [
      {
        employeeId: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        designation: 'Senior Developer'
      }
    ]
  };
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const interview = await getInterview(params.id);

  if (!interview) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <InterviewDetails interview={interview} />
    </div>
  );
}