import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ApplicationDetails from '@/components/recruitment/ApplicationDetails';

interface ApplicationPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ApplicationPageProps): Promise<Metadata> {
  return {
    title: `Application ${params.id}`,
    description: 'View application details',
  };
}

// Mock function - replace with actual API call
async function getApplication(id: string) {
  // Simulate API call
  if (id === 'not-found') {
    return null;
  }
  
  return {
    applicationId: id,
    applicationCode: 'APP-789456',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@email.com',
    phone: '+65 9123 4567',
    status: 'shortlisted',
    aiScreeningScore: 4.2,
    skillsMatchPercentage: 95,
    experienceMatchPercentage: 100,
    appliedAt: '2024-07-23T14:15:00Z',
    currentSalary: 4500,
    expectedSalary: 6200,
    noticePeriod: 30,
    totalExperience: 48, // 4 years in months
    currentJobTitle: 'Software Developer',
    currentCompany: 'Tech Solutions Pte Ltd',
    resumeUrl: '/uploads/priya_resume.pdf',
    coverLetter: 'I am excited to apply for the Software Engineer position...',
    jobPosting: {
      jobPostingId: '1',
      jobTitle: 'Software Engineer',
      jobCode: 'JOB-003',
      departmentName: 'Information Technology'
    }
  };
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const application = await getApplication(params.id);

  if (!application) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <ApplicationDetails application={application} />
    </div>
  );
}
