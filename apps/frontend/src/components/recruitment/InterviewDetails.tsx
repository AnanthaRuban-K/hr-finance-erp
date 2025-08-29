'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Users, 
  Mail,
  Phone,
  FileText,
  Star,
  Edit,
  Copy,
  CheckCircle,
  XCircle,
  Save
} from 'lucide-react';

interface InterviewDetailsProps {
  interview: {
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
      phone?: string;
    };
    jobPosting: {
      jobTitle: string;
      departmentName: string;
    };
    primaryInterviewer: {
      employeeId: string;
      firstName: string;
      lastName: string;
      email: string;
      designation: string;
    };
    panelMembers?: Array<{
      employeeId: string;
      firstName: string;
      lastName: string;
      designation: string;
    }>;
    interviewInstructions?: string;
    candidateInstructions?: string;
  };
}

export default function InterviewDetails({ interview }: InterviewDetailsProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [feedbackForm, setFeedbackForm] = useState({
    overallRating: 0,
    technicalRating: 0,
    communicationRating: 0,
    culturalFitRating: 0,
    notes: '',
    recommendation: ''
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string; icon: React.ComponentType<{ className?: string }> }> = {
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled', icon: Calendar },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: XCircle },
      rescheduled: { color: 'bg-yellow-100 text-yellow-800', label: 'Rescheduled', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <config.icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-SG', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
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
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const tabs = [
    { id: 'details', label: 'Interview Details' },
    { id: 'feedback', label: 'Feedback & Evaluation' },
    { id: 'notes', label: 'Notes' }
  ];

  const StarRating = ({ rating, onChange, readonly = false }: { rating: number; onChange?: (rating: number) => void; readonly?: boolean }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange && onChange(star)}
            className={`w-5 h-5 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
            disabled={readonly}
          >
            <Star 
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900">{interview.interviewTitle}</h1>
              {getStatusBadge(interview.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Candidate</h3>
                <p className="text-lg font-semibold text-blue-900">
                  {interview.candidate.firstName} {interview.candidate.lastName}
                </p>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    <a href={`mailto:${interview.candidate.email}`} className="hover:text-blue-600">
                      {interview.candidate.email}
                    </a>
                  </div>
                  {interview.candidate.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      <a href={`tel:${interview.candidate.phone}`} className="hover:text-blue-600">
                        {interview.candidate.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Info */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Position</h3>
                <p className="text-lg font-semibold text-green-900">
                  {interview.jobPosting.jobTitle}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {interview.jobPosting.departmentName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-6">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
              <Edit className="w-4 h-4" />
              Edit Interview
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
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Schedule Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">Date & Time:</span>
                        <p className="text-sm text-gray-900">{formatDateTime(interview.scheduledStartTime)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">Duration:</span>
                        <p className="text-sm text-gray-900">{formatDuration(interview.scheduledStartTime, interview.scheduledEndTime)}</p>
                      </div>
                    </div>

                    {interview.interviewMode === 'video_call' && interview.meetingLink && (
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-600">Meeting Link:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-blue-600 break-all">{interview.meetingLink}</p>
                            <button
                              onClick={() => copyToClipboard(interview.meetingLink!)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Copy link"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {interview.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm font-medium text-gray-600">Location:</span>
                          <p className="text-sm text-gray-900">{interview.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">Primary Interviewer:</span>
                        <p className="text-sm text-gray-900">
                          {interview.primaryInterviewer.firstName} {interview.primaryInterviewer.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{interview.primaryInterviewer.designation}</p>
                      </div>
                    </div>

                    {interview.panelMembers && interview.panelMembers.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-600">Panel Members:</span>
                          <div className="space-y-1 mt-1">
                            {interview.panelMembers.map((member, index) => (
                              <p key={index} className="text-sm text-gray-900">
                                {member.firstName} {member.lastName} - {member.designation}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Meeting Actions */}
              {interview.status === 'scheduled' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </a>
                    )}

                    <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                      <Edit className="w-4 h-4" />
                      Reschedule
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      <XCircle className="w-4 h-4" />
                      Cancel Interview
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions */}
              {(interview.interviewInstructions || interview.candidateInstructions) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interview.interviewInstructions && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">For Interviewers</h4>
                        <p className="text-sm text-gray-700">{interview.interviewInstructions}</p>
                      </div>
                    )}
                    
                    {interview.candidateInstructions && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">For Candidate</h4>
                        <p className="text-sm text-gray-700">{interview.candidateInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Interview Feedback</h3>

              {interview.status === 'completed' ? (
                <div className="space-y-6">
                  {/* Rating Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overall Rating
                      </label>
                      <StarRating
                        rating={feedbackForm.overallRating}
                        onChange={(rating) => setFeedbackForm(prev => ({ ...prev, overallRating: rating }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technical Skills
                      </label>
                      <StarRating
                        rating={feedbackForm.technicalRating}
                        onChange={(rating) => setFeedbackForm(prev => ({ ...prev, technicalRating: rating }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Communication
                      </label>
                      <StarRating
                        rating={feedbackForm.communicationRating}
                        onChange={(rating) => setFeedbackForm(prev => ({ ...prev, communicationRating: rating }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cultural Fit
                      </label>
                      <StarRating
                        rating={feedbackForm.culturalFitRating}
                        onChange={(rating) => setFeedbackForm(prev => ({ ...prev, culturalFitRating: rating }))}
                      />
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recommendation
                    </label>
                    <select
                      value={feedbackForm.recommendation}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, recommendation: e.target.value }))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select recommendation</option>
                      <option value="hire">Hire</option>
                      <option value="no_hire">Do not hire</option>
                      <option value="maybe">Maybe - need more evaluation</option>
                      <option value="next_round">Proceed to next round</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Notes
                    </label>
                    <textarea
                      value={feedbackForm.notes}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={6}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Detailed feedback about the candidate's performance, strengths, areas for improvement..."
                    />
                  </div>

                  {/* Submit Feedback */}
                  <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Save className="w-4 h-4" />
                      Save Feedback
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Feedback can only be submitted after the interview is completed.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Interview Preparation Notes</h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Candidate Background</h4>
                <Link
                  href={`/hr/recruitment/applications/${interview.applicationId}`}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View full application details →
                </Link>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Interview Questions</h4>
                <p className="text-sm text-gray-600">
                  Standard {interview.interviewType.replace('_', ' ')} questions will be provided before the interview.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                <textarea
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add any additional preparation notes..."
                />
                <div className="flex justify-end mt-2">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Save className="w-3 h-3" />
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