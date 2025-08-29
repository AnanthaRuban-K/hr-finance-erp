'use client';

import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  User, 
  Calendar, 
  Mail, 
  FileText,
  Star,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  performedBy?: {
    name: string;
    role: string;
  };
  metadata?: Record<string, any>;
}

interface ApplicationTimelineProps {
  applicationId: string;
  events?: TimelineEvent[];
}

// Mock timeline data
const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'application_submitted',
    title: 'Application Submitted',
    description: 'Candidate submitted application for Software Engineer position',
    timestamp: '2024-07-23T14:15:00Z',
    status: 'completed'
  },
  {
    id: '2',
    type: 'ai_screening',
    title: 'AI Screening Completed',
    description: 'Automatic screening completed with score 4.2/5.0',
    timestamp: '2024-07-23T14:17:00Z',
    status: 'completed',
    metadata: { aiScore: 4.2, skillsMatch: 95 }
  },
  {
    id: '3',
    type: 'status_change',
    title: 'Application Reviewed',
    description: 'Application moved to HR screening stage',
    timestamp: '2024-07-23T16:30:00Z',
    status: 'completed',
    performedBy: {
      name: 'Lisa Thompson',
      role: 'HR Manager'
    }
  },
  {
    id: '4',
    type: 'status_change',
    title: 'Candidate Shortlisted',
    description: 'Candidate shortlisted for technical interview',
    timestamp: '2024-07-24T09:15:00Z',
    status: 'completed',
    performedBy: {
      name: 'John Smith',
      role: 'Tech Lead'
    }
  },
  {
    id: '5',
    type: 'interview_scheduled',
    title: 'Interview Scheduled',
    description: 'Technical interview scheduled for July 25, 2024 at 10:00 AM',
    timestamp: '2024-07-24T10:30:00Z',
    status: 'pending',
    performedBy: {
      name: 'Lisa Thompson',
      role: 'HR Manager'
    }
  }
];

export default function ApplicationTimeline({ applicationId, events = mockTimelineEvents }: ApplicationTimelineProps) {
  const getEventIcon = (type: string, status: string) => {
    const iconClass = status === 'completed' ? 'text-green-600' : 
                     status === 'pending' ? 'text-yellow-600' : 'text-gray-400';

    switch (type) {
      case 'application_submitted':
        return <FileText className={`w-5 h-5 ${iconClass}`} />;
      case 'ai_screening':
        return <Star className={`w-5 h-5 ${iconClass}`} />;
      case 'status_change':
        return status === 'completed' ? 
          <CheckCircle className={`w-5 h-5 ${iconClass}`} /> :
          <Clock className={`w-5 h-5 ${iconClass}`} />;
      case 'interview_scheduled':
        return <Calendar className={`w-5 h-5 ${iconClass}`} />;
      case 'email_sent':
        return <Mail className={`w-5 h-5 ${iconClass}`} />;
      case 'rejection':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const getEventBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100';
      case 'pending':
        return 'bg-yellow-100';
      case 'failed':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-SG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Application Timeline</h3>
        <p className="text-sm text-gray-600 mt-1">Track all activities for this application</p>
      </div>

      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {events.map((event, eventIdx) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== events.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getEventBgColor(event.status || 'completed')}`}>
                        {getEventIcon(event.type, event.status || 'completed')}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        
                        {/* Event Metadata */}
                        {event.metadata && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {event.metadata.aiScore && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                AI Score: {event.metadata.aiScore}/5.0
                              </span>
                            )}
                            {event.metadata.skillsMatch && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Skills Match: {event.metadata.skillsMatch}%
                              </span>
                            )}
                          </div>
                        )}

                        {/* Performed By */}
                        {event.performedBy && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span>by {event.performedBy.name} ({event.performedBy.role})</span>
                          </div>
                        )}
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={event.timestamp}>
                          {formatTimestamp(event.timestamp)}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Add Event Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
            <Clock className="w-4 h-4" />
            Add Timeline Event
          </button>
        </div>
      </div>
    </div>
  );
}