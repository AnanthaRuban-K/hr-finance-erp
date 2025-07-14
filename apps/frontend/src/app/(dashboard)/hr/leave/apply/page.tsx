"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar,
  FileText,
  User,
  Clock,
  Phone,
  Upload,
  Info,
  CheckCircle,
  AlertCircle,
  Save,
  Send,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/page-header";
import { RoleGuard } from "@/components/auth/role-guard";
import { UserRole } from "@/types/auth";
import { toast } from "sonner";

interface LeaveFormData {
  // Employee Information
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  managerName: string;
  employmentType: string;
  
  // Leave Details
  leaveType: string;
  startDate: string;
  endDate: string;
  halfDayOption: string;
  totalDays: string;
  reason: string;
  
  // Handover Details
  handoverRequired: boolean;
  handoverPerson: string;
  handoverNotes: string;
  
  // Contact Information
  contactInfo: string;
  emergencyContactName: string;
  emergencyRelationship: string;
  emergencyContactNumber: string;
  
  // Supporting Documents
  hasDocuments: boolean;
  documents: File[];
  
  // Declaration
  declarationAccepted: boolean;
}

// Separate error type where all fields are strings
interface LeaveFormErrors {
  employeeId?: string;
  employeeName?: string;
  department?: string;
  designation?: string;
  managerName?: string;
  employmentType?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  halfDayOption?: string;
  totalDays?: string;
  reason?: string;
  handoverRequired?: string;
  handoverPerson?: string;
  handoverNotes?: string;
  contactInfo?: string;
  emergencyContactName?: string;
  emergencyRelationship?: string;
  emergencyContactNumber?: string;
  hasDocuments?: string;
  documents?: string;
  declarationAccepted?: string;
}

const initialFormData: LeaveFormData = {
  employeeId: "",
  employeeName: "",
  department: "",
  designation: "",
  managerName: "",
  employmentType: "Full-time",
  leaveType: "Annual Leave",
  startDate: "",
  endDate: "",
  halfDayOption: "Full Day",
  totalDays: "1",
  reason: "",
  handoverRequired: false,
  handoverPerson: "",
  handoverNotes: "",
  contactInfo: "",
  emergencyContactName: "",
  emergencyRelationship: "",
  emergencyContactNumber: "",
  hasDocuments: false,
  documents: [],
  declarationAccepted: false
};

const leaveTypes = [
  { value: "Annual Leave", label: "Annual Leave", color: "bg-blue-500", days: 14 },
  { value: "Medical Leave", label: "Medical Leave", color: "bg-red-500", days: 14 },
  { value: "Maternity Leave", label: "Maternity Leave", color: "bg-pink-500", days: 112 },
  { value: "Paternity Leave", label: "Paternity Leave", color: "bg-green-500", days: 14 },
  { value: "Childcare Leave", label: "Childcare Leave", color: "bg-purple-500", days: 6 },
  { value: "Emergency Leave", label: "Emergency Leave", color: "bg-orange-500", days: 3 },
  { value: "Compassionate Leave", label: "Compassionate Leave", color: "bg-gray-500", days: 3 }
];

const employmentTypes = [
  "Full-time",
  "Part-time", 
  "Contract",
  "Intern"
];

const halfDayOptions = [
  { value: "Full Day", label: "Full Day" },
  { value: "AM", label: "Morning (AM)" },
  { value: "PM", label: "Afternoon (PM)" }
];

export default function LeaveApplicationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LeaveFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LeaveFormErrors>({});

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof LeaveFormData, value: string | boolean | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof LeaveFormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof LeaveFormErrors]: undefined }));
    }

    // Auto-calculate days when dates change
    if (field === 'startDate' || field === 'endDate') {
      calculateLeaveDays();
    }
  };

  // Separate handler for string fields (like radio groups)
  const handleStringChange = (field: keyof LeaveFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user changes value
    if (errors[field as keyof LeaveFormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof LeaveFormErrors]: undefined }));
    }
  };

  // Updated handler for boolean fields to handle Checkbox's type correctly
  const handleBooleanChange = (field: keyof LeaveFormData, checked: boolean | "indeterminate") => {
    // Convert "indeterminate" to false, otherwise use the boolean value
    const booleanValue = checked === true;
    setFormData(prev => ({ ...prev, [field]: booleanValue }));
    
    // Clear error when user changes value
    if (errors[field as keyof LeaveFormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof LeaveFormErrors]: undefined }));
    }
  };

  const calculateLeaveDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      let totalDays = diffDays;
      if (formData.halfDayOption === 'AM' || formData.halfDayOption === 'PM') {
        totalDays = 0.5;
      }
      
      setFormData(prev => ({ ...prev, totalDays: totalDays.toString() }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: LeaveFormErrors = {};

    switch (step) {
      case 1: // Employee Information
        if (!formData.employeeId.trim()) newErrors.employeeId = "Employee ID is required";
        if (!formData.employeeName.trim()) newErrors.employeeName = "Employee name is required";
        if (!formData.department.trim()) newErrors.department = "Department is required";
        if (!formData.designation.trim()) newErrors.designation = "Designation is required";
        if (!formData.managerName.trim()) newErrors.managerName = "Manager name is required";
        break;
        
      case 2: // Leave Details
        if (!formData.startDate) newErrors.startDate = "Start date is required";
        if (!formData.endDate) newErrors.endDate = "End date is required";
        if (!formData.reason.trim()) newErrors.reason = "Reason for leave is required";
        if (parseFloat(formData.totalDays) <= 0) newErrors.totalDays = "Total days must be greater than 0";
        break;
        
      case 4: // Contact Information
        if (!formData.contactInfo.trim()) newErrors.contactInfo = "Contact information is required";
        if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = "Emergency contact name is required";
        if (!formData.emergencyContactNumber.trim()) newErrors.emergencyContactNumber = "Emergency contact number is required";
        break;
        
      case 6: // Declaration
        if (!formData.declarationAccepted) newErrors.declarationAccepted = "You must accept the declaration";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Leave Application Submitted", {
        description: "Your leave application has been submitted for approval."
      });
      
      router.push('/hr/leave');
    } catch (error) {
      toast.error("Error", {
        description: "Failed to submit leave application. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Draft Saved", {
        description: "Your leave application has been saved as draft."
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to save draft. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedLeaveType = leaveTypes.find(type => type.value === formData.leaveType);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Employee Information
              </CardTitle>
              <CardDescription>Please provide your employment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    placeholder="Enter employee ID"
                    className={errors.employeeId ? 'border-red-500' : ''}
                  />
                  {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employeeName">Employee Name *</Label>
                  <Input
                    id="employeeName"
                    value={formData.employeeName}
                    onChange={(e) => handleInputChange('employeeName', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.employeeName ? 'border-red-500' : ''}
                  />
                  {errors.employeeName && <p className="text-sm text-red-500">{errors.employeeName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Enter your department"
                    className={errors.department ? 'border-red-500' : ''}
                  />
                  {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    placeholder="Enter your job title"
                    className={errors.designation ? 'border-red-500' : ''}
                  />
                  {errors.designation && <p className="text-sm text-red-500">{errors.designation}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="managerName">Manager's Name *</Label>
                  <Input
                    id="managerName"
                    value={formData.managerName}
                    onChange={(e) => handleInputChange('managerName', e.target.value)}
                    placeholder="Enter your manager's name"
                    className={errors.managerName ? 'border-red-500' : ''}
                  />
                  {errors.managerName && <p className="text-sm text-red-500">{errors.managerName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Leave Details
              </CardTitle>
              <CardDescription>Specify your leave requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Select value={formData.leaveType} onValueChange={(value) => handleStringChange('leaveType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${type.color} mr-2`}></div>
                          {type.label}
                          <Badge variant="outline" className="ml-2">{type.days} days max</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedLeaveType && (
                  <p className="text-sm text-muted-foreground">
                    Maximum {selectedLeaveType.days} days allowed for {selectedLeaveType.label}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleStringChange('startDate', e.target.value)}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleStringChange('endDate', e.target.value)}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Half Day Options</Label>
                <RadioGroup 
                  value={formData.halfDayOption} 
                  onValueChange={(value) => handleStringChange('halfDayOption', value)}
                >
                  {halfDayOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalDays">Total Leave Days</Label>
                <Input
                  id="totalDays"
                  type="number"
                  value={formData.totalDays}
                  onChange={(e) => handleStringChange('totalDays', e.target.value)}
                  min="0.5"
                  step="0.5"
                  className={errors.totalDays ? 'border-red-500' : ''}
                />
                {errors.totalDays && <p className="text-sm text-red-500">{errors.totalDays}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Leave *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleStringChange('reason', e.target.value)}
                  placeholder="Please provide a detailed reason for your leave application"
                  rows={4}
                  className={errors.reason ? 'border-red-500' : ''}
                />
                {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Handover Details
              </CardTitle>
              <CardDescription>Specify work handover arrangements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="handoverRequired"
                  checked={formData.handoverRequired}
                  onCheckedChange={(checked) => handleBooleanChange('handoverRequired', checked)}
                />
                <Label htmlFor="handoverRequired">Handover Required</Label>
              </div>
              
              {formData.handoverRequired && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="handoverPerson">Handover Person</Label>
                    <Input
                      id="handoverPerson"
                      value={formData.handoverPerson}
                      onChange={(e) => handleStringChange('handoverPerson', e.target.value)}
                      placeholder="Name of person who will handle your duties"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="handoverNotes">Handover Notes</Label>
                    <Textarea
                      id="handoverNotes"
                      value={formData.handoverNotes}
                      onChange={(e) => handleStringChange('handoverNotes', e.target.value)}
                      placeholder="Provide details about tasks and responsibilities to be handed over"
                      rows={4}
                    />
                  </div>
                </div>
              )}
              
              {!formData.handoverRequired && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No handover required. Your absence will not impact ongoing projects.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
              <CardDescription>How to reach you during your leave</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information *</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => handleStringChange('contactInfo', e.target.value)}
                  placeholder="Phone number or email address"
                  className={errors.contactInfo ? 'border-red-500' : ''}
                />
                {errors.contactInfo && <p className="text-sm text-red-500">{errors.contactInfo}</p>}
                <p className="text-sm text-muted-foreground">
                  How can you be contacted while on leave, if necessary
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleStringChange('emergencyContactName', e.target.value)}
                    placeholder="Enter name"
                    className={errors.emergencyContactName ? 'border-red-500' : ''}
                  />
                  {errors.emergencyContactName && <p className="text-sm text-red-500">{errors.emergencyContactName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={(e) => handleStringChange('emergencyRelationship', e.target.value)}
                    placeholder="E.g. Spouse, Parent, Friend"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactNumber">Emergency Contact Number *</Label>
                <Input
                  id="emergencyContactNumber"
                  value={formData.emergencyContactNumber}
                  onChange={(e) => handleStringChange('emergencyContactNumber', e.target.value)}
                  placeholder="Enter phone number"
                  className={errors.emergencyContactNumber ? 'border-red-500' : ''}
                />
                {errors.emergencyContactNumber && <p className="text-sm text-red-500">{errors.emergencyContactNumber}</p>}
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Supporting Documents
              </CardTitle>
              <CardDescription>Upload any required documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasDocuments"
                  checked={formData.hasDocuments}
                  onCheckedChange={(checked) => handleBooleanChange('hasDocuments', checked)}
                />
                <Label htmlFor="hasDocuments">I have supporting documents</Label>
              </div>
              
              {formData.hasDocuments && (
                <div className="space-y-4">
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormData(prev => ({ ...prev, documents: files }));
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 5MB each)
                  </p>
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Required for Medical Leave:</strong> Medical certificate from registered doctor<br />
                  <strong>Required for Maternity/Paternity:</strong> Birth certificate or medical certificate
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Review & Declaration
              </CardTitle>
              <CardDescription>Review your application and accept the declaration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Leave Summary */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">Leave Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Employee: {formData.employeeName}</div>
                  <div>Department: {formData.department}</div>
                  <div>Leave Type: {formData.leaveType}</div>
                  <div>Duration: {formData.totalDays} days</div>
                  <div>Start Date: {formData.startDate}</div>
                  <div>End Date: {formData.endDate}</div>
                </div>
              </div>

              {/* Singapore Leave Entitlements */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Singapore Leave Entitlements:</strong><br />
                  • Annual Leave: Min 7 days (first year), up to 14 days<br />
                  • Sick Leave: 14 days outpatient, 60 days hospitalization<br />
                  • Maternity Leave: 16 weeks for Singaporean employees<br />
                  • Paternity Leave: 2 weeks for Singaporean employees<br />
                  • Childcare Leave: 6 days per year (children under 7)
                </AlertDescription>
              </Alert>

              {/* Declaration */}
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    I hereby declare that the information provided is true and correct. I understand that my leave application is subject to approval and I will abide by the company's leave policies and procedures. I acknowledge that providing false information may result in disciplinary action.
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="declarationAccepted"
                    checked={formData.declarationAccepted}
                    onCheckedChange={(checked) => handleBooleanChange('declarationAccepted', checked)}
                  />
                  <Label htmlFor="declarationAccepted" className="text-sm">
                    I accept the above declaration *
                  </Label>
                </div>
                {errors.declarationAccepted && <p className="text-sm text-red-500">{errors.declarationAccepted}</p>}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <RoleGuard allowedRoles={[UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN]}>
      <div className="space-y-6">
        <PageHeader
          title="Leave Application"
          description="Submit your leave request for approval according to company policies"
        >
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="outline" onClick={saveDraft} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </PageHeader>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentStep < totalSteps ? (
                  <Button onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading || !formData.declarationAccepted}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}