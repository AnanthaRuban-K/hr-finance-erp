'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Building2,
  FileText,
  Download,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Save
} from 'lucide-react';

// Add the missing ApplicationTimeline component
const ApplicationTimeline = ({ applicationId }: { applicationId: string }) => {
  const timelineEvents = [
    {
      id: '1',
      title: 'Application Received',
      description: 'Application submitted via website',
      timestamp: '2024-07-20T10:30:00Z',
      type: 'application',
      status: 'completed'
    },
    {
      id: '2',
      title: 'AI Screening',
      description: 'Automated screening completed with score 4.2/5.0',
      timestamp: '2024-07-20T11:00:00Z',
      type: 'screening',
      status: 'completed'
    },
    {
      id: '3',
      title: 'HR Review',
      description: 'Initial review by HR team',
      timestamp: '2024-07-21T09:15:00Z',
      type: 'review',
      status: 'in_progress'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Application Timeline</h3>
      <div className="space-y-3">
        {timelineEvents.map((event, index) => (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${
                event.status === 'completed' ? 'bg-green-500' :
                event.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
              {index < timelineEvents.length - 1 && (
                <div className="w-px h-8 bg-gray-200 mt-2"></div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <h4 className="font-medium text-gray-900">{event.title}</h4>
              <p className="text-sm text-gray-600">{event.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ApplicationDetailsProps {
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
    experienceMatchPercentage?: number;
    appliedAt: string;
    currentSalary?: number;
    expectedSalary?: number;
    noticePeriod?: number;
    totalExperience?: number;
    currentJobTitle?: string;
    currentCompany?: string;
    resumeUrl?: string;
    coverLetter?: string;
    jobPosting: {
      jobPostingId: string;
      jobTitle: string;
      jobCode: string;
      departmentName: string;
    };
  };
}

export default function ApplicationDetails({ application }: ApplicationDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      received: { color: 'bg-blue-100 text-blue-800', label: 'Received' },
      screening: { color: 'bg-yellow-100 text-yellow-800', label: 'Screening' },
      shortlisted: { color: 'bg-green-100 text-green-800', label: 'Shortlisted' },
      interviewed: { color: 'bg-purple-100 text-purple-800', label: 'Interviewed' },
      offer_extended: { color: 'bg-indigo-100 text-indigo-800', label: 'Offer Extended' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.received;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatExperience = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} months`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'documents', label: 'Documents' },
    { id: 'evaluation', label: 'Evaluation' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  {application.firstName} {application.lastName}
                </h1>
              </div>
              <span className="text-sm text-gray-500">({application.applicationCode})</span>
              {getStatusBadge(application.status)}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">Applied for: {application.jobPosting.jobTitle}</span>
                <span>•</span>
                <span>{application.jobPosting.jobCode}</span>
                <span>•</span>
                <span>{application.jobPosting.departmentName}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

              {application.aiScreeningScore && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className={`font-semibold ${getScoreColor(application.aiScreeningScore)}`}>
                    AI Score: {application.aiScreeningScore}/5.0
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-6">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100">
              <CheckCircle className="w-4 h-4" />
              Shortlist
            </button>

            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
              <Calendar className="w-4 h-4" />
              Schedule Interview
            </button>

            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{application.email}</span>
                    </div>
                    {application.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{application.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Employment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
                  <div className="space-y-3">
                    {application.currentJobTitle && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Current Position:</span>
                        <p className="text-sm text-gray-900">{application.currentJobTitle}</p>
                        {application.currentCompany && (
                          <p className="text-sm text-gray-600">{application.currentCompany}</p>
                        )}
                      </div>
                    )}
                    
                    {application.totalExperience && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Total Experience:</span>
                        <p className="text-sm text-gray-900">{formatExperience(application.totalExperience)}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {application.currentSalary && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Current Salary:</span>
                          <p className="text-sm text-gray-900">SGD {application.currentSalary.toLocaleString()}</p>
                        </div>
                      )}
                      
                      {application.expectedSalary && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Expected Salary:</span>
                          <p className="text-sm text-gray-900">SGD {application.expectedSalary.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {application.noticePeriod && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Notice Period:</span>
                        <p className="text-sm text-gray-900">{application.noticePeriod} days</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Screening Results */}
              <div className="space-y-6">
                {application.aiScreeningScore && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Screening Results</h3>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className={`text-3xl font-bold ${getScoreColor(application.aiScreeningScore)} mb-1`}>
                          {application.aiScreeningScore}/5.0
                        </div>
                        <div className="text-sm text-gray-600">Overall Score</div>
                      </div>

                      {application.skillsMatchPercentage && (
                        <div>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Skills Match</span>
                            <span className="font-medium">{application.skillsMatchPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${application.skillsMatchPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {application.experienceMatchPercentage && (
                        <div>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Experience Match</span>
                            <span className="font-medium">{application.experienceMatchPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${application.experienceMatchPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {application.coverLetter && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {application.coverLetter}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <ApplicationTimeline applicationId={application.applicationId} />
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              <div className="space-y-3">
                {application.resumeUrl && (
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Resume</p>
                        <p className="text-sm text-gray-500">PDF Document</p>
                      </div>
                    </div>
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Evaluation & Notes</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HR Notes
                  </label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                    placeholder="Add evaluation notes..."
                  />
                </div>
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Save className="w-4 h-4" />
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}