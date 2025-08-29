'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  Eye, 
  UserCheck,
  Building2,
  Clock
} from 'lucide-react';

interface ApplicationCardProps {
  application: {
    applicationId: string;
    applicationCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    status: string;
    aiScreeningScore?: number;
    skillsMatchPercentage?: number;
    appliedAt: string;
    jobPosting: {
      jobTitle: string;
      jobCode: string;
      departmentName: string;
    };
  };
  onStatusChange?: (applicationId: string, newStatus: string) => void;
}

export default function ApplicationCard({ application, onStatusChange }: ApplicationCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      received: { color: 'bg-blue-100 text-blue-800', label: 'Received' },
      screening: { color: 'bg-yellow-100 text-yellow-800', label: 'Screening' },
      shortlisted: { color: 'bg-green-100 text-green-800', label: 'Shortlisted' },
      interviewed: { color: 'bg-purple-100 text-purple-800', label: 'Interviewed' },
      offer_extended: { color: 'bg-indigo-100 text-indigo-800', label: 'Offer Extended' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.received;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-green-600';
    if (score >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {application.firstName} {application.lastName}
                </h3>
              </div>
              <span className="text-sm text-gray-500">({application.applicationCode})</span>
              {getStatusBadge(application.status)}
              
              {application.aiScreeningScore && (
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className={`text-sm font-semibold ${getScoreColor(application.aiScreeningScore)}`}>
                    {application.aiScreeningScore}/5.0
                  </span>
                </div>
              )}
            </div>

            {/* Job Information */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{application.jobPosting.jobTitle}</span>
                <span className="text-gray-400">•</span>
                <span>{application.jobPosting.jobCode}</span>
                <span className="text-gray-400">•</span>
                <span>{application.jobPosting.departmentName}</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${application.email}`} className="hover:text-blue-600">
                  {application.email}
                </a>
              </div>

              {application.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${application.phone}`} className="hover:text-blue-600">
                    {application.phone}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Applied: {formatDate(application.appliedAt)}</span>
              </div>
            </div>

            {/* Skills Match Progress */}
            {application.skillsMatchPercentage && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Skills Match</span>
                  <span className="font-medium">{application.skillsMatchPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      application.skillsMatchPercentage >= 80 ? 'bg-green-500' :
                      application.skillsMatchPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${application.skillsMatchPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <Link
                href={`/hr/recruitment/applications/${application.applicationId}`}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Eye className="w-3 h-3" />
                View Details
              </Link>

              {application.status === 'received' && onStatusChange && (
                <button
                  onClick={() => onStatusChange(application.applicationId, 'screening')}
                  className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Start Screening
                </button>
              )}

              {application.status === 'screening' && onStatusChange && (
                <button
                  onClick={() => onStatusChange(application.applicationId, 'shortlisted')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Shortlist
                </button>
              )}

              {application.status === 'shortlisted' && (
                <Link
                  href={`/hr/recruitment/interviews/schedule?applicationId=${application.applicationId}`}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Schedule Interview
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}