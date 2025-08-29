'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  MapPin, 
  Mail,
  Plus,
  X,
  Save
} from 'lucide-react';

interface InterviewSchedulerProps {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  onSchedule?: (interviewData: any) => void;
  onCancel?: () => void;
}

export default function InterviewScheduler({ 
  applicationId, 
  candidateName, 
  jobTitle, 
  onSchedule, 
  onCancel 
}: InterviewSchedulerProps) {
  const [formData, setFormData] = useState({
    interviewType: 'video_interview',
    interviewTitle: `Technical Interview - ${jobTitle}`,
    scheduledDate: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    interviewMode: 'video_call',
    location: '',
    meetingLink: '',
    primaryInterviewerId: '',
    interviewerIds: [''],
    interviewInstructions: '',
    candidateInstructions: ''
  });

  const [loading, setLoading] = useState(false);

  // Mock interviewers data
  const mockInterviewers = [
    { id: '1', name: 'John Smith', designation: 'Tech Lead', email: 'john.smith@company.com' },
    { id: '2', name: 'Sarah Johnson', designation: 'Senior Developer', email: 'sarah.johnson@company.com' },
    { id: '3', name: 'Mike Chen', designation: 'Engineering Manager', email: 'mike.chen@company.com' }
  ];

  // Generate meeting link function
  const generateMeetingLink = () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const formattedId = `${randomId.slice(0,4)}-${randomId.slice(4,8)}-${randomId.slice(8,12)}`;
    
    // You can customize this based on your preferred video conferencing platform
    const meetingPlatforms = [
      `https://meet.google.com/${formattedId}`,
      `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`,
      `https://teams.microsoft.com/l/meetup-join/${randomId}`,
      `https://us02web.zoom.us/j/${Math.floor(Math.random() * 1000000000)}`
    ];
    
    // Default to Google Meet for this example
    const generatedLink = `https://meet.google.com/${formattedId}`;
    
    setFormData(prev => ({
      ...prev,
      meetingLink: generatedLink
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const interviewData = {
        ...formData,
        applicationId,
        interviewerIds: formData.interviewerIds.filter(id => id.trim()),
        scheduledStartTime: `${formData.scheduledDate}T${formData.scheduledStartTime}:00Z`,
        scheduledEndTime: `${formData.scheduledDate}T${formData.scheduledEndTime}:00Z`
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSchedule) {
        onSchedule(interviewData);
      }
    } catch (error) {
      console.error('Failed to schedule interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const addInterviewer = () => {
    setFormData(prev => ({
      ...prev,
      interviewerIds: [...prev.interviewerIds, '']
    }));
  };

  const removeInterviewer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((_, i) => i !== index)
    }));
  };

  const updateInterviewer = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      interviewerIds: prev.interviewerIds.map((id, i) => i === index ? value : id)
    }));
  };

  // Auto-generate meeting link when video call is selected
  React.useEffect(() => {
    if (formData.interviewMode === 'video_call' && !formData.meetingLink) {
      generateMeetingLink();
    }
  }, [formData.interviewMode]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Schedule Interview</h2>
        <p className="text-sm text-gray-600 mt-1">
          Schedule interview for <span className="font-medium">{candidateName}</span> - {jobTitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Interview Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <Calendar className="w-5 h-5" />
            Interview Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Type
              </label>
              <select
                value={formData.interviewType}
                onChange={(e) => setFormData(prev => ({ ...prev, interviewType: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="phone_screening">Phone Screening</option>
                <option value="video_interview">Video Interview</option>
                <option value="in_person">In-Person Interview</option>
                <option value="technical_test">Technical Test</option>
                <option value="panel_interview">Panel Interview</option>
                <option value="final_interview">Final Interview</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Title
              </label>
              <input
                type="text"
                value={formData.interviewTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, interviewTitle: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Technical Interview - Software Engineer"
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <Clock className="w-5 h-5" />
            Schedule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formData.scheduledStartTime}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledStartTime: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formData.scheduledEndTime}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledEndTime: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Location/Platform */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <MapPin className="w-5 h-5" />
            Location/Platform
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Mode
              </label>
              <select
                value={formData.interviewMode}
                onChange={(e) => setFormData(prev => ({ ...prev, interviewMode: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="video_call">Video Call</option>
                <option value="in_person">In Person</option>
                <option value="phone_call">Phone Call</option>
              </select>
            </div>

            {formData.interviewMode === 'video_call' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://meet.google.com/..."
                  />
                  <button
                    type="button"
                    onClick={generateMeetingLink}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Video className="w-3 h-3" />
                    Generate
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click "Generate" to create a new meeting link automatically
                </p>
              </div>
            )}

            {formData.interviewMode === 'in_person' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Conference Room A, 10th Floor"
                />
              </div>
            )}

            {formData.interviewMode === 'phone_call' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  📞 The interviewer will call the candidate at their registered phone number at the scheduled time.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interviewers */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <Users className="w-5 h-5" />
            Interviewers
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Interviewer
              </label>
              <select
                value={formData.primaryInterviewerId}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryInterviewerId: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Primary Interviewer</option>
                {mockInterviewers.map(interviewer => (
                  <option key={interviewer.id} value={interviewer.id}>
                    {interviewer.name} - {interviewer.designation}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Interviewers
              </label>
              {formData.interviewerIds.map((interviewerId, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={interviewerId}
                    onChange={(e) => updateInterviewer(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Interviewer</option>
                    {mockInterviewers.map(interviewer => (
                      <option key={interviewer.id} value={interviewer.id}>
                        {interviewer.name} - {interviewer.designation}
                      </option>
                    ))}
                  </select>
                  {formData.interviewerIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInterviewer(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addInterviewer}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
              >
                <Plus className="w-4 h-4" />
                Add Interviewer
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <Mail className="w-5 h-5" />
            Instructions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions for Interviewers
              </label>
              <textarea
                value={formData.interviewInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, interviewInstructions: e.target.value }))}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Special instructions or topics to focus on during the interview..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions for Candidate
              </label>
              <textarea
                value={formData.candidateInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, candidateInstructions: e.target.value }))}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="What the candidate should prepare or bring to the interview..."
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Scheduling...' : 'Schedule Interview'}
          </button>
        </div>
      </form>
    </div>
  );
}