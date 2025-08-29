'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Users, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText,
  Briefcase,
  Clock,
  Plus,
  X,
  Save,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

// Updated interface with jobId property
interface JobPostingFormProps {
  initialData?: {
    jobPostingId?: string;
    jobCode?: string;
    jobTitle?: string;
    departmentId?: string;
    designationId?: string;
    jobDescription?: string;
    keyResponsibilities?: string[];
    requiredSkills?: string[];
    preferredSkills?: string[];
    qualifications?: string[];
    employmentType?: string;
    workArrangement?: string;
    numberOfVacancies?: number;
    minSalary?: number;
    maxSalary?: number;
    currency?: string;
    applicationDeadline?: string;
    isPublished?: boolean;
    allowCoverLetter?: boolean;
    requireCoverLetter?: boolean;
  };
  mode?: 'create' | 'edit';
  jobId?: string; // ✅ Added this property to fix the TypeScript error
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

// Mock data for dropdowns
const mockDepartments = [
  { id: '1', name: 'Information Technology', code: 'IT' },
  { id: '2', name: 'Human Resources', code: 'HR' },
  { id: '3', name: 'Finance', code: 'FIN' },
  { id: '4', name: 'Operations', code: 'OPS' },
];

const mockDesignations = [
  { id: '1', title: 'Software Engineer', level: 'Mid-Level' },
  { id: '2', title: 'Senior Software Engineer', level: 'Senior' },
  { id: '3', title: 'Tech Lead', level: 'Senior' },
  { id: '4', title: 'HR Executive', level: 'Junior' },
];

export default function JobPostingForm({ 
  initialData, 
  mode = 'create', 
  jobId, // ✅ Now properly accepted as a prop
  onSuccess, 
  onCancel 
}: JobPostingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    jobTitle: '',
    departmentId: '',
    designationId: '',
    jobDescription: '',
    keyResponsibilities: [''],
    requiredSkills: [''],
    preferredSkills: [''],
    qualifications: [''],
    employmentType: 'permanent',
    workArrangement: 'office',
    numberOfVacancies: 1,
    minSalary: 0,
    maxSalary: 0,
    currency: 'SGD',
    applicationDeadline: '',
    isPublished: false,
    allowCoverLetter: true,
    requireCoverLetter: false,
    ...initialData
  });

  // Initialize form with provided data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        keyResponsibilities: initialData.keyResponsibilities || [''],
        requiredSkills: initialData.requiredSkills || [''],
        preferredSkills: initialData.preferredSkills || [''],
        qualifications: initialData.qualifications || ['']
      }));
    }
  }, [initialData]);

  // Generate job code
  const generateJobCode = () => {
    const department = mockDepartments.find(d => d.id === formData.departmentId);
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${department?.code || 'GEN'}-${year}-${random}`;
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }
    if (!formData.designationId) {
      newErrors.designationId = 'Designation is required';
    }
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    }
    if (formData.minSalary >= formData.maxSalary) {
      newErrors.salary = 'Maximum salary must be greater than minimum salary';
    }
    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = 'Application deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const jobCode = mode === 'create' ? generateJobCode() : initialData?.jobCode;
      
      const submissionData = {
        ...formData,
        jobCode,
        jobPostingId: jobId || initialData?.jobPostingId,
        keyResponsibilities: formData.keyResponsibilities.filter(item => item.trim()),
        requiredSkills: formData.requiredSkills.filter(item => item.trim()),
        preferredSkills: formData.preferredSkills.filter(item => item.trim()),
        qualifications: formData.qualifications.filter(item => item.trim())
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log(`${mode === 'create' ? 'Creating' : 'Updating'} job posting:`, submissionData);

      if (onSuccess) {
        onSuccess(submissionData);
      } else {
        router.push('/hr/recruitment/jobs');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save job posting. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Array field handlers
  const addArrayItem = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: keyof typeof formData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Create New Job Posting' : 'Edit Job Posting'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {mode === 'create' 
                  ? 'Fill in the details to create a new job posting' 
                  : `Editing job posting ${jobId || initialData?.jobCode}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <Briefcase className="w-5 h-5" />
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
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.jobTitle ? 'border-red-300' : ''
                }`}
                placeholder="e.g., Senior Software Engineer"
              />
              {errors.jobTitle && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.jobTitle}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.departmentId ? 'border-red-300' : ''
                }`}
              >
                <option value="">Select Department</option>
                {mockDepartments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.departmentId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation *
              </label>
              <select
                value={formData.designationId}
                onChange={(e) => setFormData(prev => ({ ...prev, designationId: e.target.value }))}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.designationId ? 'border-red-300' : ''
                }`}
              >
                <option value="">Select Designation</option>
                {mockDesignations.map(designation => (
                  <option key={designation.id} value={designation.id}>
                    {designation.title} ({designation.level})
                  </option>
                ))}
              </select>
              {errors.designationId && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.designationId}
                </p>
              )}
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
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <FileText className="w-5 h-5" />
            Job Description
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={formData.jobDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
              rows={5}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.jobDescription ? 'border-red-300' : ''
              }`}
              placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
            />
            {errors.jobDescription && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.jobDescription}
              </p>
            )}
          </div>
        </div>

        {/* Key Responsibilities */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <Users className="w-5 h-5" />
            Key Responsibilities
          </h3>

          {formData.keyResponsibilities.map((responsibility, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                value={responsibility}
                onChange={(e) => updateArrayItem('keyResponsibilities', index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter a key responsibility..."
              />
              {formData.keyResponsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('keyResponsibilities', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('keyResponsibilities')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
          >
            <Plus className="w-4 h-4" />
            Add Responsibility
          </button>
        </div>

        {/* Skills & Qualifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Required Skills */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Required Skills</h3>
            {formData.requiredSkills.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateArrayItem('requiredSkills', index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., JavaScript, React"
                />
                {formData.requiredSkills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requiredSkills', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requiredSkills')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>

          {/* Preferred Skills */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Skills</h3>
            {formData.preferredSkills.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateArrayItem('preferredSkills', index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., TypeScript, AWS"
                />
                {formData.preferredSkills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('preferredSkills', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('preferredSkills')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>
        </div>

        {/* Qualifications */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Qualifications</h3>
          {formData.qualifications.map((qualification, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                value={qualification}
                onChange={(e) => updateArrayItem('qualifications', index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Bachelor's degree in Computer Science"
              />
              {formData.qualifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('qualifications', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('qualifications')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
          >
            <Plus className="w-4 h-4" />
            Add Qualification
          </button>
        </div>

        {/* Employment Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <Clock className="w-5 h-5" />
            Employment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <option value="part_time">Part Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>

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
          </div>
        </div>

        {/* Salary Range */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <DollarSign className="w-5 h-5" />
            Salary Range
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary
              </label>
              <input
                type="number"
                min="0"
                value={formData.minSalary}
                onChange={(e) => setFormData(prev => ({ ...prev, minSalary: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxSalary}
                onChange={(e) => setFormData(prev => ({ ...prev, maxSalary: parseInt(e.target.value) || 0 }))}
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

          {errors.salary && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.salary}
            </p>
          )}
        </div>

        {/* Application Settings */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
            <Calendar className="w-5 h-5" />
            Application Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline *
              </label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.applicationDeadline ? 'border-red-300' : ''
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.applicationDeadline && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.applicationDeadline}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowCoverLetter"
                  checked={formData.allowCoverLetter}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowCoverLetter: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allowCoverLetter" className="ml-2 text-sm text-gray-700">
                  Allow cover letter
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireCoverLetter"
                  checked={formData.requireCoverLetter}
                  onChange={(e) => setFormData(prev => ({ ...prev, requireCoverLetter: e.target.checked }))}
                  disabled={!formData.allowCoverLetter}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="requireCoverLetter" className="ml-2 text-sm text-gray-700">
                  Require cover letter
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Errors */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{errors.submit}</span>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {!formData.isPublished && (
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, isPublished: false }));
                  handleSubmit(new Event('submit') as any);
                }}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Save as Draft
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading 
                ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                : (mode === 'create' ? 'Create Job Posting' : 'Update Job Posting')
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}