import { Metadata } from 'next';
import InterviewsList from '@/components/recruitment/InterviewsList';

export const metadata: Metadata = {
  title: 'Interviews',
  description: 'Manage job interviews',
};

export default function InterviewsPage() {
  return (
    <div className="container mx-auto py-6">
      <InterviewsList />
    </div>
  );
}