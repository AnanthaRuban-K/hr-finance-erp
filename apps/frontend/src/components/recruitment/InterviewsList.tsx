'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  Video, 
  MapPin, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Plus
} from 'lucide-react';

interface Interview {
  interviewId: string;
  applicationId: string;
  jobPostingId: string;
  interviewType: string;
  interviewTitle: string;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  interviewMode: string;
  location?: string;
  meetingLink?: string;
  status: string;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
  };
  jobPosting: {
    jobTitle: string;
    departmentName: string;
  };
  primaryInterviewer: {
    firstName: string;
    lastName: string;
    designation: string;
  };
}

// Mock data
const mockInterviews: Interview[] = [
  {
    interviewId: '1',
    applicationId: '1',
    jobPostingId: '1',
    interviewType: 'video_interview',
    interviewTitle: 'Technical Interview - Software Engineer',
    scheduledDate: '2024-07-25',
    scheduledStartTime: '2024-07-25T10:00:00Z',
    scheduledEndTime: '2024-07-25T11:00:00Z',
    interviewMode: 'video_call',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
    candidate: {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@email.com'
    },
    jobPosting: {
      jobTitle: 'Software Engineer',
      departmentName: 'Information Technology'
    },
    primaryInterviewer: {
      firstName: 'John',
      lastName: 'Smith',
      designation: 'Tech Lead'
    }
  },
  {
    interviewId: '2',
    applicationId: '2',
    jobPostingId: '1',
    interviewType: 'phone_screening',
    interviewTitle: 'HR Screening - Software Engineer',
    scheduledDate: '2024-07-24',
    scheduledStartTime: '2024-07-24T14:00:00Z',
    scheduledEndTime: '2024-07-24T14:30:00Z',
    interviewMode: 'phone_call',
    status: 'completed',
    candidate: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'rajesh.k@email.com'
    },
    jobPosting: {
      jobTitle: 'Software Engineer',
      departmentName: 'Information Technology'
    },
    primaryInterviewer: {
      firstName: 'Lisa',
      lastName: 'Thompson',
      designation: 'HR Manager'
    }
  }
];

export default function InterviewsList() {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    page: 1,
    limit: 10
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled', icon: Calendar },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: XCircle },
      rescheduled: { color: 'bg-yellow-100 text-yellow-800', label: 'Rescheduled', icon: Clock },
      no_show: { color: 'bg-gray-100 text-gray-800', label: 'No Show', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <config.icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getInterviewIcon = (mode: string, type: string) => {
    if (mode === 'video_call') return <Video className="w-4 h-4 text-blue-600" />;
    if (mode === 'in_person') return <MapPin className="w-4 h-4 text-green-600" />;
    return <Calendar className="w-4 h-4 text-gray-600" />;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-SG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    }
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = !filters.search || 
      interview.candidate.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      interview.candidate.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      interview.jobPosting.jobTitle.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || interview.status === filters.status;
    const matchesType = filters.type === 'all' || interview.interviewType === filters.type;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600 mt-1">Manage and track candidate interviews</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Schedule Interview
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">
                {interviews.filter(i => i.status === 'scheduled').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {interviews.filter(i => i.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-purple-600">
                {interviews.filter(i => 
                  new Date(i.scheduledDate).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-orange-600">
                {interviews.filter(i => {
                  const interviewDate = new Date(i.scheduledDate);
                  const now = new Date();
                  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
                  return interviewDate >= weekStart && interviewDate <= weekEnd;
                }).length}
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search interviews..."
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
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All types</option>
            <option value="phone_screening">Phone Screening</option>
            <option value="video_interview">Video Interview</option>
            <option value="in_person">In Person</option>
            <option value="technical_test">Technical Test</option>
            <option value="panel_interview">Panel Interview</option>
          </select>
        </div>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.status !== 'all' || filters.type !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Start by scheduling interviews for shortlisted candidates.'
              }
            </p>
          </div>
        ) : (
          filteredInterviews.map((interview) => (
            <div key={interview.interviewId} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      {getInterviewIcon(interview.interviewMode, interview.interviewType)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {interview.interviewTitle}
                      </h3>
                      {getStatusBadge(interview.status)}
                    </div>

                    {/* Candidate and Job Info */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Candidate:</span>
                          <p className="text-sm text-gray-900">
                            {interview.candidate.firstName} {interview.candidate.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{interview.candidate.email}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Position:</span>
                          <p className="text-sm text-gray-900">{interview.jobPosting.jobTitle}</p>
                          <p className="text-sm text-gray-600">{interview.jobPosting.departmentName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Interview Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(interview.scheduledStartTime)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(interview.scheduledStartTime, interview.scheduledEndTime)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{interview.primaryInterviewer.firstName} {interview.primaryInterviewer.lastName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {interview.interviewMode === 'video_call' ? (
                          <>
                            <Video className="w-4 h-4" />
                            <span>Video Call</span>
                          </>
                        ) : interview.interviewMode === 'in_person' ? (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span>{interview.location || 'Office'}</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4" />
                            <span>Phone Call</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <Link
                        href={`/hr/recruitment/interviews/${interview.interviewId}`}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View Details
                      </Link>

                      {interview.meetingLink && interview.status === 'scheduled' && (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <Video className="w-3 h-3" />
                          Join Meeting
                        </a>
                      )}

                      {interview.status === 'scheduled' && (
                        <button className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                          Reschedule
                        </button>
                      )}

                      {interview.status === 'completed' && (
                        <Link
                          href={`/hr/recruitment/applications/${interview.applicationId}`}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View Application
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}