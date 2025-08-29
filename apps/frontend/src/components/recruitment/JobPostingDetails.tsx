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
  Share2,
  Clock,
  CheckCircle,
  FileText,
  Star,
  Mail
} from 'lucide-react';

interface JobPostingDetailsProps {
  jobPosting: {
    jobPostingId: string;
    jobCode: string;
    jobTitle: string;
    status: string;
    jobDescription: string;
    keyResponsibilities: string[];
    requiredSkills: string[];
    preferredSkills?: string[];
    qualifications: string[];
    department?: { departmentName: string };
    designation?: { designationTitle: string; jobLevel: string };
    employmentType: string;
    workArrangement: string;
    numberOfVacancies: number;
    minSalary?: number;
    maxSalary?: number;
    currency: string;
    applicationDeadline?: string;
    totalApplications: number;
    totalViews: number;
    publishedDate?: string;
    createdAt: string;
    hiringManager?: { firstName: string; lastName: string; email: string };
  };
}

export default function JobPostingDetails({ jobPosting }: JobPostingDetailsProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active', icon: CheckCircle },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft', icon: FileText },
      paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused', icon: Clock },
      closed: { color: 'bg-red-100 text-red-800', label: 'Closed', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <config.icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900">{jobPosting.jobTitle}</h1>
              {getStatusBadge(jobPosting.status)}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <span className="font-medium">{jobPosting.jobCode}</span>
              <span>•</span>
              <span>{jobPosting.department?.departmentName}</span>
              {jobPosting.designation && (
                <>
                  <span>•</span>
                  <span>{jobPosting.designation.designationTitle}</span>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="capitalize">{jobPosting.workArrangement}</span>
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

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="capitalize">{jobPosting.employmentType}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{jobPosting.totalViews} views</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{jobPosting.totalApplications} applications</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Published: {jobPosting.publishedDate ? formatDate(jobPosting.publishedDate) : 'Not published'}</span>
              </div>

              {jobPosting.applicationDeadline && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Deadline: {formatDate(jobPosting.applicationDeadline)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-6">
            <Link
              href={`/hr/recruitment/jobs/${jobPosting.jobPostingId}/edit`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>

            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>{jobPosting.jobDescription}</p>
        </div>
      </div>

      {/* Requirements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Responsibilities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Responsibilities</h3>
          <ul className="space-y-2">
            {jobPosting.keyResponsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Qualifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h3>
          <ul className="space-y-2">
            {jobPosting.qualifications.map((qualification, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>{qualification}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {jobPosting.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {jobPosting.preferredSkills && jobPosting.preferredSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Preferred Skills</h4>
              <div className="flex flex-wrap gap-2">
                {jobPosting.preferredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hiring Manager & Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hiring Manager</h3>
            {jobPosting.hiringManager ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{jobPosting.hiringManager.firstName} {jobPosting.hiringManager.lastName}</span>
                <span>•</span>
                <a 
                  href={`mailto:${jobPosting.hiringManager.email}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {jobPosting.hiringManager.email}
                </a>
              </div>
            ) : (
              <span className="text-sm text-gray-500">No hiring manager assigned</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {jobPosting.totalApplications > 0 && (
              <Link
                href={`/hr/recruitment/applications?jobPostingId=${jobPosting.jobPostingId}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Users className="w-4 h-4" />
                View Applications ({jobPosting.totalApplications})
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}