import { Metadata } from 'next';
import JobPostingForm from '@/components/recruitment/JobPostingForm';

export const metadata: Metadata = {
  title: 'Create Job Posting',
  description: 'Create a new job posting',
};

export default function CreateJobPage() {
  return (
    <div className="container mx-auto py-6">
      <JobPostingForm />
    </div>
  );
}