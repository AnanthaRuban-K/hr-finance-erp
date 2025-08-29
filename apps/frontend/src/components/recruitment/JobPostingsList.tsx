'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface JobPosting {
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
}

const fetchJobPostings = async (filters: any) => {
  const params = new URLSearchParams({
    page: filters.page?.toString() || '1',
    limit: filters.limit?.toString() || '10',
    ...(filters.status && { status: filters.status }),
    ...(filters.search && { search: filters.search })
  });

  const response = await fetch(`/api/recruitment/jobs?${params}`);
  if (!response.ok) throw new Error('Failed to fetch job postings');
  return response.json();
};

export default function JobPostingsList() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const loadJobPostings = async () => {
      try {
        setLoading(true);
        const response = await fetchJobPostings(filters);
        setJobPostings(response.data);
      } catch (error) {
        console.error('Failed to load job postings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobPostings();
  }, [filters]);

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-SG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-1">Manage your organization's job postings</p>
        </div>
        <Link
          href="/hr/recruitment/jobs/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Create Job Posting
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Job Postings List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : jobPostings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first job posting.</p>
          <Link
            href="/hr/recruitment/jobs/create"
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Job Posting
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobPostings.map((job) => (
            <div key={job.jobPostingId} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.jobTitle} ({job.jobCode})
                      </h3>
                      {getStatusBadge(job.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span>{job.departmentName || 'No Department'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{job.workArrangement}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {job.currency} {job.minSalary?.toLocaleString()} - {job.maxSalary?.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{job.numberOfVacancies} position{job.numberOfVacancies > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{job.totalApplications} applications</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{job.totalViews} views</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Published: {formatDate(job.publishedDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/hr/recruitment/jobs/${job.jobPostingId}`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/hr/recruitment/jobs/${job.jobPostingId}/edit`}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}