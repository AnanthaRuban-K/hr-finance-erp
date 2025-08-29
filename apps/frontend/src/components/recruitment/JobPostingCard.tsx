'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Clock,
  Pause,
  Play
} from 'lucide-react';

interface JobPostingCardProps {
  jobPosting: {
    jobPostingId: string;
    jobCode: string;
    jobTitle: string;
    status: string;
    departmentName?: string;
    totalApplications: number;
    totalViews: number;
    publishedDate: string | null;
    createdAt: string;
    minSalary?: number;
    maxSalary?: number;
    currency: string;
    employmentType: string;
    workArrangement: string;
    numberOfVacancies: number;
    applicationDeadline?: string;
  };
  onStatusChange?: (jobId: string, newStatus: string) => void;
}

export default function JobPostingCard({ jobPosting, onStatusChange }: JobPostingCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
      closed: { color: 'bg-red-100 text-red-800', label: 'Closed' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getWorkArrangementIcon = (arrangement: string) => {
    switch (arrangement) {
      case 'remote':
        return '🏠';
      case 'hybrid':
        return '🔄';
      case 'office':
        return '🏢';
      default:
        return '🏢';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-SG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const getApplicationsProgress = () => {
    // Calculate progress based on applications vs vacancies (rough estimate)
    const targetApplications = jobPosting.numberOfVacancies * 10; // Assume 10 applications per position is good
    return Math.min(100, (jobPosting.totalApplications / targetApplications) * 100);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <Link 
                href={`/hr/recruitment/jobs/${jobPosting.jobPostingId}`}
                className="hover:text-blue-600 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {jobPosting.jobTitle} ({jobPosting.jobCode})
                </h3>
              </Link>
              {getStatusBadge(jobPosting.status)}
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{jobPosting.departmentName || 'No Department'}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{getWorkArrangementIcon(jobPosting.workArrangement)} {jobPosting.workArrangement}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>
                  {jobPosting.currency} {jobPosting.minSalary?.toLocaleString()} - {jobPosting.maxSalary?.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{jobPosting.numberOfVacancies} position{jobPosting.numberOfVacancies > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{jobPosting.totalApplications} applications</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{jobPosting.totalViews} views</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {jobPosting.status === 'draft' 
                    ? `Created ${formatDaysAgo(jobPosting.createdAt)}`
                    : `Published ${formatDaysAgo(jobPosting.publishedDate || jobPosting.createdAt)}`
                  }
                </span>
              </div>

              {jobPosting.applicationDeadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {formatDate(jobPosting.applicationDeadline)}</span>
                </div>
              )}
            </div>

            {/* Application Progress Bar */}
            {jobPosting.status === 'active' && jobPosting.totalApplications > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Application Progress</span>
                  <span>{jobPosting.totalApplications} received</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getApplicationsProgress()}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <Link
                href={`/hr/recruitment/jobs/${jobPosting.jobPostingId}`}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Eye className="w-3 h-3" />
                View Details
              </Link>

              <Link
                href={`/hr/recruitment/jobs/${jobPosting.jobPostingId}/edit`}
                className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
              >
                <Edit className="w-3 h-3" />
                Edit
              </Link>

              {jobPosting.totalApplications > 0 && (
                <Link
                  href={`/hr/recruitment/applications?jobPostingId=${jobPosting.jobPostingId}`}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Applications ({jobPosting.totalApplications})
                </Link>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            {jobPosting.status === 'active' && onStatusChange && (
              <button
                onClick={() => onStatusChange(jobPosting.jobPostingId, 'paused')}
                className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                title="Pause Job Posting"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}

            {jobPosting.status === 'paused' && onStatusChange && (
              <button
                onClick={() => onStatusChange(jobPosting.jobPostingId, 'active')}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                title="Resume Job Posting"
              >
                <Play className="w-4 h-4" />
              </button>
            )}

            {jobPosting.status === 'draft' && onStatusChange && (
              <button
                onClick={() => onStatusChange(jobPosting.jobPostingId, 'active')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                title="Publish Job Posting"
              >
                <Play className="w-3 h-3" />
                Publish
              </button>
            )}

            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}