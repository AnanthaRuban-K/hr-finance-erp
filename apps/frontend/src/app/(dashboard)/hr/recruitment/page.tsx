import { Metadata } from 'next';
import RecruitmentDashboard from '@/components/recruitment/RecruitmentDashboard';

export const metadata: Metadata = {
  title: 'Recruitment Dashboard',
  description: 'Manage job postings and track applications',
};

export default function RecruitmentPage() {
  return <RecruitmentDashboard />;
}