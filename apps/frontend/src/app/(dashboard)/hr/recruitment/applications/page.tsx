import { Metadata } from 'next';
import ApplicationsList from '@/components/recruitment/ApplicationsList';

export const metadata: Metadata = {
  title: 'Job Applications',
  description: 'Manage job applications',
};

export default function ApplicationsPage() {
  return (
    <div className="container mx-auto py-6">
      <ApplicationsList />
    </div>
  );
}