'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  Users, 
  FileText,
  Plus,
  X,
  Save
} from 'lucide-react';

interface JobPostingFormProps {
  initialData?: any;
  mode?: 'create' | 'edit';
}

const createJobPosting = async (data: any) => {
  const response = await fetch('/api/recruitment/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create job posting');
  return response.json();
};

export default function JobPostingForm({ initialData, mode = 'create' }: JobPostingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    departmentId: '',
    jobDescription: '',
    employmentType: 'permanent',
    workArrangement: 'hybrid',
    numberOfVacancies: 1,
    minSalary: '',
    maxSalary: '',
    currency: 'SGD',
    requiredSkills: [''],
    qualifications: [''],
    isPublished: false,
    ...initialData
  });

  const handleSubmit = async (publishNow = false) => {
    try {
      setLoading(true);
      const submissionData = {
        ...formData,
        isPublished: publishNow,
        requiredSkills: formData.requiredSkills.filter(s => s.trim()),
        qualifications: formData.qualifications.filter(q => q.trim())
      };

      await createJobPosting(submissionData);
      router.push('/hr/recruitment/jobs');
    } catch (error) {
      console.error('Failed to save job posting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (field: string, index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === 'create' ? 'Create Job Posting' : 'Edit Job Posting'}
        </h2>
      </div>

      <form className="p-6 space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <FileText className="w-5 h-5" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Software Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData(prev => ({ ...prev, employmentType: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={formData.jobDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
              rows={6}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Detailed description of the role..."
              required
            />
          </div>
        </div>

        {/* Employment Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <Building2 className="w-5 h-5" />
            Employment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Arrangement
              </label>
              <select
                value={formData.workArrangement}
                onChange={(e) => setFormData(prev => ({ ...prev, workArrangement: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="office">Office</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Vacancies
              </label>
              <input
                type="number"
                min="1"
                value={formData.numberOfVacancies}
                onChange={(e) => setFormData(prev => ({ ...prev, numberOfVacancies: parseInt(e.target.value) || 1 }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="SGD">SGD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Salary ({formData.currency})
              </label>
              <input
                type="number"
                value={formData.minSalary}
                onChange={(e) => setFormData(prev => ({ ...prev, minSalary: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Salary ({formData.currency})
              </label>
              <input
                type="number"
                value={formData.maxSalary}
                onChange={(e) => setFormData(prev => ({ ...prev, maxSalary: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="7000"
              />
            </div>
          </div>
        </div>

        {/* Skills & Requirements */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <Users className="w-5 h-5" />
            Skills & Requirements
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Required Skills */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="w-4 h-4" />
                Required Skills
              </label>
              {formData.requiredSkills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayFieldChange('requiredSkills', index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Java"
                  />
                  {formData.requiredSkills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('requiredSkills', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('requiredSkills')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            {/* Qualifications */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                Qualifications
              </label>
              {formData.qualifications.map((qualification, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => handleArrayFieldChange('qualifications', index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Bachelor's degree"
                  />
                  {formData.qualifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('qualifications', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('qualifications')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
              >
                <Plus className="w-4 h-4" />
                Add Qualification
              </button>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Create & Publish'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}