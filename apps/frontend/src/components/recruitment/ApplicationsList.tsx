'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Star,
  Eye,
  Mail,
  Phone,
  Calendar,
  Building2
} from 'lucide-react';

interface Application {
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
}

export default function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications([
        {
          applicationId: '1',
          applicationCode: 'APP-789456',
          firstName: 'Priya',
          lastName: 'Sharma',
          email: 'priya.sharma@email.com',
          phone: '+65 9123 4567',
          status: 'shortlisted',
          aiScreeningScore: 4.2,
          skillsMatchPercentage: 95,
          appliedAt: '2024-07-23T14:15:00Z',
          jobPosting: {
            jobTitle: 'Software Engineer',
            jobCode: 'JOB-003',
            departmentName: 'Information Technology'
          }
        },
        {
          applicationId: '2',
          applicationCode: 'APP-789455',
          firstName: 'Rajesh',
          lastName: 'Kumar',
          email: 'rajesh.k@email.com',
          phone: '+65 8234 5678',
          status: 'screening',
          aiScreeningScore: 3.8,
          skillsMatchPercentage: 82,
          appliedAt: '2024-07-23T10:30:00Z',
          jobPosting: {
            jobTitle: 'Software Engineer',
            jobCode: 'JOB-003',
            departmentName: 'Information Technology'
          }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [filters]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      received: { color: 'bg-blue-100 text-blue-800', label: 'Received' },
      screening: { color: 'bg-yellow-100 text-yellow-800', label: 'Screening' },
      shortlisted: { color: 'bg-green-100 text-green-800', label: 'Shortlisted' },
      interviewed: { color: 'bg-purple-100 text-purple-800', label: 'Interviewed' },
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All statuses</option>
            <option value="received">Received</option>
            <option value="screening">Screening</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewed">Interviewed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application.applicationId} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.firstName} {application.lastName}
                    </h3>
                    <span className="text-sm text-gray-500">({application.applicationCode})</span>
                    {getStatusBadge(application.status)}
                    {application.aiScreeningScore && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className={`text-sm font-semibold ${getScoreColor(application.aiScreeningScore)}`}>
                          {application.aiScreeningScore}/5.0
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{application.jobPosting.jobTitle}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{application.email}</span>
                    </div>

                    {application.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{application.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Applied: {formatDate(application.appliedAt)}</span>
                    </div>
                  </div>

                  {application.skillsMatchPercentage && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Skills Match</span>
                        <span>{application.skillsMatchPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${application.skillsMatchPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View Application"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                    title="Shortlist"
                  >
                    Shortlist
                  </button>

                  <button
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    title="Schedule Interview"
                  >
                    Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}