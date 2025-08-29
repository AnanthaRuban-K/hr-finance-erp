import { Metadata } from 'next';
import JobPostingsList from '@/components/recruitment/JobPostingsList';

export const metadata: Metadata = {
  title: 'Job Postings',
  description: 'Manage job postings',
};

export default function JobPostingsPage() {
  return (
    <div className="container mx-auto py-6">
      <JobPostingsList />
    </div>
  );
}