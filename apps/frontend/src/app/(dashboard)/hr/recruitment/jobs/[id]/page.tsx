import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobPostingDetails from '@/components/recruitment/JobPostingDetails';

interface JobPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  return {
    title: `Job Posting ${params.id}`,
    description: 'View job posting details',
  };
}

async function getJobPosting(id: string) {
  if (id === 'not-found') {
    return null;
  }
  
  return {
    jobPostingId: id,
    jobCode: 'JOB-003',
    jobTitle: 'Software Engineer',
    status: 'active',
    jobDescription: 'We are looking for a skilled Software Engineer to join our dynamic development team...',
    keyResponsibilities: [
      'Develop and maintain web applications using modern technologies',
      'Collaborate with cross-functional teams to define and implement new features',
      'Write clean, maintainable, and efficient code'
    ],
    requiredSkills: ['Java', 'React', 'AWS', 'SQL', 'Git'],
    preferredSkills: ['TypeScript', 'Docker', 'Kubernetes'],
    qualifications: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of relevant software development experience'
    ],
    department: {
      departmentId: '1',
      departmentName: 'Information Technology',
      departmentCode: 'IT'
    },
    designation: {
      designationId: '1',
      designationTitle: 'Senior Developer',
      jobLevel: 'Senior'
    },
    employmentType: 'permanent',
    workArrangement: 'hybrid',
    numberOfVacancies: 1,
    minSalary: 5000,
    maxSalary: 7000,
    currency: 'SGD',
    applicationDeadline: '2024-08-15',
    totalApplications: 23,
    totalViews: 156,
    publishedDate: '2024-07-18T00:00:00Z',
    createdAt: '2024-07-18T00:00:00Z',
    hiringManager: {
      employeeId: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com'
    }
  };
}

export default async function JobPostingPage({ params }: JobPageProps) {
  const jobPosting = await getJobPosting(params.id);

  if (!jobPosting) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <JobPostingDetails jobPosting={jobPosting} />
    </div>
  );
}