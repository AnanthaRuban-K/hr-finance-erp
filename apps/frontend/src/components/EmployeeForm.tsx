"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronDown, Calendar, Loader2, Upload, X, ChevronLeft, ChevronRight, FileText, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

// Enhanced Zod validation schema with comprehensive validations
const employeeSchema = z.object({
  // Personal Information - Enhanced validations
  fullName: z.string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
    .refine((val) => val.trim().length > 0, "Full name cannot be only spaces")
    .refine((val) => !/\s{2,}/.test(val), "Full name cannot contain consecutive spaces"),
    
  nricFinPassport: z.string()
    .min(1, "NRIC/FIN/Passport is required")
    .refine((val) => {
      // Singapore NRIC/FIN format: 1 letter + 7 digits + 1 letter (e.g., S1234567A)
      const sgNricPattern = /^[STFG]\d{7}[A-Z]$/i;
      // Passport format: 6-9 alphanumeric characters
      const passportPattern = /^[A-Z0-9]{6,9}$/i;
      return sgNricPattern.test(val) || passportPattern.test(val);
    }, "Please enter a valid NRIC/FIN (e.g., S1234567A) or Passport number"),
    
  dateOfBirth: z.string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      return birthDate <= maxDate && birthDate >= minDate;
    }, "Age must be between 16 and 100 years"),
    
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  nationality: z.enum(["singapore", "malaysia", "china", "india", "others"], { required_error: "Nationality is required" }),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"], { required_error: "Marital status is required" }),
  residentialStatus: z.enum(["citizen", "pr", "workpass", "dependent"], { required_error: "Residential status is required" }),
  race: z.string().optional(),
  religion: z.string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z\s]*$/.test(val), "Religion can only contain letters and spaces"),
  
  // Contact Information - Enhanced validations
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email cannot exceed 100 characters"),
    
  phone: z.string()
    .min(1, "Phone number is required")
    .refine((val) => {
      // Remove spaces and validate format with country code
      const cleanPhone = val.replace(/\s/g, '');
      // Singapore: +65 followed by 8 digits starting with 8 or 9
      const sgPattern = /^\+65[89]\d{7}$/;
      // India: +91 followed by 10 digits starting with 6-9
      const inPattern = /^\+91[6-9]\d{9}$/;
      return sgPattern.test(cleanPhone) || inPattern.test(cleanPhone);
    }, "Please enter a valid phone number with country code"),
    
  address: z.string()
    .min(1, "Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address cannot exceed 200 characters"),
    
  city: z.string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z\s]*$/.test(val), "City can only contain letters and spaces"),
    
  postalCode: z.string()
    .optional()
    .refine((val) => !val || /^\d{6}$/.test(val), "Postal code must be 6 digits"),
    
  emergencyContact: z.string()
    .min(1, "Emergency contact name is required")
    .min(2, "Emergency contact name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Emergency contact name can only contain letters and spaces"),
    
  emergencyPhone: z.string()
    .min(1, "Emergency contact number is required")
    .refine((val) => {
      const cleanPhone = val.replace(/\s/g, '');
      const sgPattern = /^\+65[89]\d{7}$/;
      const inPattern = /^\+91[6-9]\d{9}$/;
      return sgPattern.test(cleanPhone) || inPattern.test(cleanPhone);
    }, "Please enter a valid emergency contact number with country code"),
  
  // Employment Information - Enhanced validations
  employeeId: z.string()
    .min(1, "Employee ID is required")
    .min(3, "Employee ID must be at least 3 characters")
    .max(20, "Employee ID cannot exceed 20 characters")
    .regex(/^[A-Z0-9]+$/i, "Employee ID can only contain letters and numbers"),
    
  department: z.enum(["hr", "it", "finance", "marketing", "operations", "sales"], { required_error: "Department is required" }),
  
  position: z.string()
    .min(1, "Position is required")
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Position can only contain letters and spaces"),
    
  joinDate: z.string()
    .min(1, "Join date is required")
    .refine((date) => {
      const joinDate = new Date(date);
      const today = new Date();
      return joinDate <= today;
    }, "Join date cannot be in the future"),
    
  employmentType: z.enum(["fulltime", "parttime", "contract", "intern"], { required_error: "Employment type is required" }),
  
  reportingManager: z.string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z\s]*$/.test(val), "Reporting manager name can only contain letters and spaces"),
  
  // Salary Information - Enhanced validations
  basicSalary: z.string()
    .min(1, "Basic salary is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num <= 999999;
    }, "Basic salary must be a valid positive number up to 999,999"),
    
  paymentMode: z.enum(["bank", "cash", "cheque"], { required_error: "Payment mode is required" }),
  
  bankName: z.string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z\s]*$/.test(val), "Bank name can only contain letters and spaces"),
    
  accountNumber: z.string()
    .optional()
    .refine((val) => !val || /^\d{8,20}$/.test(val), "Account number must be 8-20 digits"),
    
  cpfNumber: z.string()
    .optional()
    .refine((val) => !val || /^\d{9}[A-Z]$/i.test(val), "CPF number must be 9 digits followed by a letter"),
    
  taxNumber: z.string()
    .optional()
    .refine((val) => !val || /^[A-Z0-9]*$/i.test(val), "Tax number can only contain letters and numbers"),
  
  // Additional Information
  skills: z.string().optional(),
  certifications: z.string().optional(),
  notes: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface ValidationErrors {
  [key: string]: string;
}

interface FileInfo {
  originalName: string;
  fileName: string;
  folder: string;
  url: string;
  size: number;
  type: string;
  uploadDate: string;
}

interface EmployeeFormProps {
  onClose?: () => void;
  onSuccess?: (employee: EmployeeAPIResponse) => void;
  initialData?: Partial<EmployeeFormData & { id?: string }>;
  isEdit?: boolean;
}

interface EmployeeAPIResponse {
  id: string;
  fullName?: string;
  nricFinPassport?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  maritalStatus?: string;
  residentialStatus?: string;
  race?: string;
  religion?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  employeeId?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  employmentType?: string;
  reportingManager?: string;
  basicSalary?: number | string;
  paymentMode?: string;
  bankName?: string;
  accountNumber?: string;
  cpfNumber?: string;
  taxNumber?: string;
  skills?: string;
  certifications?: string;
  notes?: string;
  [key: string]: string | number | boolean | null | undefined;
}

// Simple File Upload Component with MinIO
interface SimpleFileUploadProps {
  label: string;
  documentType: string;
  employeeId: string;
  required?: boolean;
  onUploadSuccess?: (file: FileInfo) => void;
  onError?: (error: string) => void;
}

const SimpleFileUpload: React.FC<SimpleFileUploadProps> = ({
  label,
  documentType,
  employeeId,
  required = false,
  onUploadSuccess,
  onError
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleFileUpload = async (file: File) => {
    if (!file || !employeeId) {
      onError?.('Employee ID is required for file upload');
      return;
    }

    // Validate file size and type
    if (file.size > 5 * 1024 * 1024) {
      onError?.('File size must be less than 5MB');
      return;
    }

    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      onError?.('Invalid file type. Only PDF, JPG, PNG, DOC, DOCX allowed');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', employeeId);
      formData.append('documentType', documentType);

      console.log('📤 Uploading file:', { fileName: file.name, employeeId, documentType });

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Upload successful:', result.file);
        setUploadedFiles(prev => [...prev, result.file]);
        onUploadSuccess?.(result.file);
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDelete = async (fileInfo: FileInfo) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/delete/${employeeId}/${documentType}/${fileInfo.fileName}`,
        { method: 'DELETE' }
      );

      const result = await response.json();

      if (result.success) {
        setUploadedFiles(prev => prev.filter(f => f.fileName !== fileInfo.fileName));
      } else {
        onError?.(result.error || 'Delete failed');
      }
    } catch (error) {
      onError?.('Delete failed');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${!employeeId ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onClick={() => employeeId && document.getElementById(`file-${documentType}`)?.click()}
      >
        <input
          id={`file-${documentType}`}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileSelect}
          disabled={uploading || !employeeId}
        />

        {!employeeId ? (
          <div className="text-gray-500">
            <Upload className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm">Please enter Employee ID first</p>
          </div>
        ) : uploading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Uploading...</span>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (max 5MB)</p>
          </>
        )}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{file.originalName}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(file.url, '_blank')}
                  title="View file"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(file)}
                  className="text-red-600 hover:text-red-700"
                  title="Delete file"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ FIXED: API Configuration
const getApiUrl = () => {
  // Debug logging
  console.log('Environment check:');
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Return the environment variable or fallback to the production URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.sbrosenterpriseerp.com';
  console.log('Using API URL:', apiUrl);
  return apiUrl;
};

// Define tab order
const TAB_ORDER = ["personal", "contact", "employment", "salary", "documents", "additional"];

export default function EmployeeForm({ onClose, onSuccess, initialData, isEdit = false }: EmployeeFormProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File}>({});
  const [phoneCountryCode, setPhoneCountryCode] = useState("+65");
  const [emergencyPhoneCountryCode, setEmergencyPhoneCountryCode] = useState("+65");
  const [formData, setFormData] = useState<EmployeeFormData>({
    // Personal Information
    fullName: initialData?.fullName || "",
    nricFinPassport: initialData?.nricFinPassport || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    gender: (initialData?.gender as "male" | "female" | "other") || ("" as "male" | "female" | "other"),
    nationality: (initialData?.nationality as "singapore" | "malaysia" | "china" | "india" | "others") || ("" as "singapore" | "malaysia" | "china" | "india" | "others"),
    maritalStatus: (initialData?.maritalStatus as "single" | "married" | "divorced" | "widowed") || ("" as "single" | "married" | "divorced" | "widowed"),
    residentialStatus: (initialData?.residentialStatus as "citizen" | "pr" | "workpass" | "dependent") || ("" as "citizen" | "pr" | "workpass" | "dependent"),
    race: initialData?.race || "",
    religion: initialData?.religion || "",
    
    // Contact Information
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    postalCode: initialData?.postalCode || "",
    emergencyContact: initialData?.emergencyContact || "",
    emergencyPhone: initialData?.emergencyPhone || "",
    
    // Employment Information
    employeeId: initialData?.employeeId || "",
    department: (initialData?.department as "hr" | "it" | "finance" | "marketing" | "operations" | "sales") || ("" as "hr" | "it" | "finance" | "marketing" | "operations" | "sales"),
    position: initialData?.position || "",
    joinDate: initialData?.joinDate || "",
    employmentType: (initialData?.employmentType as "fulltime" | "parttime" | "contract" | "intern") || ("" as "fulltime" | "parttime" | "contract" | "intern"),
    reportingManager: initialData?.reportingManager || "",
    
    // Salary Information
    basicSalary: initialData?.basicSalary?.toString() || "",
    paymentMode: (initialData?.paymentMode as "bank" | "cash" | "cheque") || ("" as "bank" | "cash" | "cheque"),
    bankName: initialData?.bankName || "",
    accountNumber: initialData?.accountNumber || "",
    cpfNumber: initialData?.cpfNumber || "",
    taxNumber: initialData?.taxNumber || "",
    
    // Additional Information
    skills: initialData?.skills || "",
    certifications: initialData?.certifications || "",
    notes: initialData?.notes || "",
  });
  
  // Check if we're in edit mode based on initialData having an ID
  const isEditMode = isEdit || Boolean(initialData?.id);
  const employeeId = initialData?.id;

  // Get current tab index
  const currentTabIndex = TAB_ORDER.indexOf(activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === TAB_ORDER.length - 1;

  // Get today's date for date input max attribute
  const today = new Date().toISOString().split('T')[0];
  const maxBirthDate = new Date(new Date().getFullYear() - 16, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0];

  // Phone number handling functions
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, isEmergency: boolean = false) => {
    let value = e.target.value;
    const countryCode = isEmergency ? emergencyPhoneCountryCode : phoneCountryCode;
    
    // Remove any non-digit characters except spaces
    value = value.replace(/[^\d\s]/g, '');
    
    // Format based on country code
    if (countryCode === "+65") {
      // Singapore: 8 digits, format as XXXX XXXX
      value = value.replace(/\s/g, '').slice(0, 8);
      if (value.length > 4) {
        value = value.slice(0, 4) + ' ' + value.slice(4);
      }
    } else if (countryCode === "+91") {
      // India: 10 digits, format as XXXXX XXXXX
      value = value.replace(/\s/g, '').slice(0, 10);
      if (value.length > 5) {
        value = value.slice(0, 5) + ' ' + value.slice(5);
      }
    }
    
    const fullPhoneNumber = countryCode + value;
    
    if (isEmergency) {
      setFormData(prev => ({ ...prev, emergencyPhone: fullPhoneNumber }));
    } else {
      setFormData(prev => ({ ...prev, phone: fullPhoneNumber }));
    }
    
    // Clear validation error
    const fieldName = isEmergency ? 'emergencyPhone' : 'phone';
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleCountryCodeChange = (countryCode: string, isEmergency: boolean = false) => {
    if (isEmergency) {
      setEmergencyPhoneCountryCode(countryCode);
      setFormData(prev => ({ ...prev, emergencyPhone: countryCode }));
    } else {
      setPhoneCountryCode(countryCode);
      setFormData(prev => ({ ...prev, phone: countryCode }));
    }
  };

  const getPhoneDisplayValue = (fullPhone: string, countryCode: string) => {
    if (!fullPhone || fullPhone === countryCode) return '';
    return fullPhone.replace(countryCode, '');
  };

  // Enhanced input change handler with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply real-time formatting and restrictions based on field type
    let processedValue = value;
    
    switch (name) {
      case 'fullName':
      case 'emergencyContact':
      case 'position':
      case 'reportingManager':
      case 'bankName':
      case 'city':
        // Only allow letters and spaces, no consecutive spaces
        processedValue = value.replace(/[^a-zA-Z\s]/g, '').replace(/\s{2,}/g, ' ');
        break;
      case 'religion':
        // Only allow letters and spaces for religion
        processedValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'nricFinPassport':
        // Allow letters and numbers only, convert to uppercase
        processedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        break;
      case 'employeeId':
        // Allow letters and numbers only, convert to uppercase
        processedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        break;
      case 'postalCode':
      case 'basicSalary':
        // Only allow numbers
        processedValue = value.replace(/[^0-9.]/g, '');
        break;
      case 'accountNumber':
        // Only allow numbers for account number
        processedValue = value.replace(/[^0-9]/g, '');
        break;
      case 'cpfNumber':
        // Format CPF: 9 digits + 1 letter
        const cpfValue = value.replace(/[^0-9A-Za-z]/g, '');
        if (cpfValue.length <= 9) {
          processedValue = cpfValue.replace(/[^0-9]/g, '');
        } else {
          processedValue = cpfValue.slice(0, 9) + cpfValue.slice(9).replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 1);
        }
        break;
      case 'taxNumber':
        // Allow letters and numbers only
        processedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        break;
      default:
        processedValue = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Navigation functions
  const goToPreviousTab = () => {
    if (!isFirstTab) {
      setActiveTab(TAB_ORDER[currentTabIndex - 1]);
    }
  };

  const goToNextTab = () => {
    if (!isLastTab) {
      setActiveTab(TAB_ORDER[currentTabIndex + 1]);
    }
  };

  const validateForm = (): boolean => {
    try {
      employeeSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationErrors = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
        
        // Find the first tab with errors and switch to it
        const tabFields = {
          personal: ['fullName', 'nricFinPassport', 'dateOfBirth', 'gender', 'nationality', 'maritalStatus', 'residentialStatus', 'race', 'religion'],
          contact: ['email', 'phone', 'address', 'city', 'postalCode', 'emergencyContact', 'emergencyPhone'],
          employment: ['employeeId', 'department', 'position', 'joinDate', 'employmentType', 'reportingManager'],
          salary: ['basicSalary', 'paymentMode', 'bankName', 'accountNumber', 'cpfNumber', 'taxNumber'],
          additional: ['skills', 'certifications', 'notes']
        };

        for (const [tab, fields] of Object.entries(tabFields)) {
          if (fields.some(field => errors[field])) {
            setActiveTab(tab);
            break;
          }
        }
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Validate form before submission
    if (!validateForm()) {
      setMessage("Please fix the validation errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        basicSalary: parseFloat(formData.basicSalary) || 0,
        uploadedFiles: Object.keys(uploadedFiles)
      };

      // ✅ FIXED: Use proper API URL configuration
      const API_BASE_URL = getApiUrl();
      const url = isEditMode 
        ? `${API_BASE_URL}/employees/${employeeId}`
        : `${API_BASE_URL}/employees`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      console.log(`Making API call to: ${url}`);
      console.log(`Method: ${method}`);
      console.log('Data:', submitData);

      // API call to backend
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setMessage(isEditMode ? "Employee updated successfully!" : "Employee created successfully!");
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(result.employee);
        }
          
        // Only reset form if creating new employee
        if (!isEditMode) {
          setFormData({
            fullName: "", nricFinPassport: "", dateOfBirth: "", gender: "" as "male" | "female" | "other",
            nationality: "" as "singapore" | "malaysia" | "china" | "india" | "others", 
            maritalStatus: "" as "single" | "married" | "divorced" | "widowed", 
            residentialStatus: "" as "citizen" | "pr" | "workpass" | "dependent", race: "",
            religion: "", email: "", phone: "", address: "", city: "",
            postalCode: "", emergencyContact: "", emergencyPhone: "",
            employeeId: "", department: "" as "hr" | "it" | "finance" | "marketing" | "operations" | "sales", 
            position: "", joinDate: "",
            employmentType: "" as "fulltime" | "parttime" | "contract" | "intern", 
            reportingManager: "", basicSalary: "",
            paymentMode: "" as "bank" | "cash" | "cheque", 
            bankName: "", accountNumber: "", cpfNumber: "",
            taxNumber: "", skills: "", certifications: "", notes: "",
          });
          setValidationErrors({});
          setUploadedFiles({});
          setActiveTab("personal");
          setPhoneCountryCode("+65");
          setEmergencyPhoneCountryCode("+65");
        }
        
        // Auto-close after successful submission if onClose is provided
        if (onClose) {
          setTimeout(() => {
            onClose();
          }, 2000); // Close after 2 seconds to show success message
        }
      } else {
        setMessage(`Error: ${result.error}`);
      }
      
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = JSON.stringify(error);
      }
      
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      // Reset to initial data for edit mode
      setFormData({
        fullName: initialData?.fullName || "",
        nricFinPassport: initialData?.nricFinPassport || "",
        dateOfBirth: initialData?.dateOfBirth || "",
        gender: (initialData?.gender as "male" | "female" | "other") || ("" as "male" | "female" | "other"),
        nationality: (initialData?.nationality as "singapore" | "malaysia" | "china" | "india" | "others") || ("" as "singapore" | "malaysia" | "china" | "india" | "others"),
        maritalStatus: (initialData?.maritalStatus as "single" | "married" | "divorced" | "widowed") || ("" as "single" | "married" | "divorced" | "widowed"),
        residentialStatus: (initialData?.residentialStatus as "citizen" | "pr" | "workpass" | "dependent") || ("" as "citizen" | "pr" | "workpass" | "dependent"),
        race: initialData?.race || "",
        religion: initialData?.religion || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        address: initialData?.address || "",
        city: initialData?.city || "",
        postalCode: initialData?.postalCode || "",
        emergencyContact: initialData?.emergencyContact || "",
        emergencyPhone: initialData?.emergencyPhone || "",
        employeeId: initialData?.employeeId || "",
        department: (initialData?.department as "hr" | "it" | "finance" | "marketing" | "operations" | "sales") || ("" as "hr" | "it" | "finance" | "marketing" | "operations" | "sales"),
        position: initialData?.position || "",
        joinDate: initialData?.joinDate || "",
        employmentType: (initialData?.employmentType as "fulltime" | "parttime" | "contract" | "intern") || ("" as "fulltime" | "parttime" | "contract" | "intern"),
        reportingManager: initialData?.reportingManager || "",
        basicSalary: initialData?.basicSalary?.toString() || "",
        paymentMode: (initialData?.paymentMode as "bank" | "cash" | "cheque") || ("" as "bank" | "cash" | "cheque"),
        bankName: initialData?.bankName || "",
        accountNumber: initialData?.accountNumber || "",
        cpfNumber: initialData?.cpfNumber || "",
        taxNumber: initialData?.taxNumber || "",
        skills: initialData?.skills || "",
        certifications: initialData?.certifications || "",
        notes: initialData?.notes || "",
      });
    } else {
      // Reset to empty form for create mode
      setFormData({
        fullName: "", nricFinPassport: "", dateOfBirth: "", gender: "" as "male" | "female" | "other",
        nationality: "" as "singapore" | "malaysia" | "china" | "india" | "others", 
        maritalStatus: "" as "single" | "married" | "divorced" | "widowed", 
        residentialStatus: "" as "citizen" | "pr" | "workpass" | "dependent", race: "",
        religion: "", email: "", phone: "", address: "", city: "",
        postalCode: "", emergencyContact: "", emergencyPhone: "",
        employeeId: "", department: "" as "hr" | "it" | "finance" | "marketing" | "operations" | "sales", 
        position: "", joinDate: "",
        employmentType: "" as "fulltime" | "parttime" | "contract" | "intern", 
        reportingManager: "", basicSalary: "",
        paymentMode: "" as "bank" | "cash" | "cheque", 
        bankName: "", accountNumber: "", cpfNumber: "",
        taxNumber: "", skills: "", certifications: "", notes: "",
      });
      setPhoneCountryCode("+65");
      setEmergencyPhoneCountryCode("+65");
    }
    setValidationErrors({});
    setUploadedFiles({});
    setMessage("");
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Helper component for displaying validation errors
  const ValidationError = ({ fieldName }: { fieldName: string }) => {
    if (!validationErrors[fieldName]) return null;
    return (
      <p className="text-red-500 text-sm mt-1">{validationErrors[fieldName]}</p>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {isEditMode ? "Edit Employee Form" : "Create Employee Form"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? "Update employee information" : "Fill in all required information to register a new employee"}
            </p>
          </div>
          {onClose && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClose}
              className="p-2"
              title="Close form"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {message && (
          <div className="m-6">
            <div className={`p-4 rounded-md ${
              message.includes('Error') || message.includes('error') || message.includes('validation') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
            <div className="px-6 pt-6">
              <TabsList className="grid grid-cols-6 w-full bg-gray-100 rounded-md p-1">
                <TabsTrigger value="personal" className={activeTab === "personal" ? "bg-white shadow-sm" : ""}>
                  Personal
                </TabsTrigger>
                <TabsTrigger value="contact" className={activeTab === "contact" ? "bg-white shadow-sm" : ""}>
                  Contact
                </TabsTrigger>
                <TabsTrigger value="employment" className={activeTab === "employment" ? "bg-white shadow-sm" : ""}>
                  Employment
                </TabsTrigger>
                <TabsTrigger value="salary" className={activeTab === "salary" ? "bg-white shadow-sm" : ""}>
                  Salary & Payroll
                </TabsTrigger>
                <TabsTrigger value="documents" className={activeTab === "documents" ? "bg-white shadow-sm" : ""}>
                  Documents
                </TabsTrigger>
                <TabsTrigger value="additional" className={activeTab === "additional" ? "bg-white shadow-sm" : ""}>
                  Additional Info
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="personal" className="space-y-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="block mb-1">
                      Full Name (As per NRIC/FIN/Passport) <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="fullName" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name (letters and spaces only)" 
                      className={`w-full ${validationErrors.fullName ? 'border-red-500' : ''}`}
                      required
                    />
                    <ValidationError fieldName="fullName" />
                  </div>
                  
                  <div>
                    <Label htmlFor="nricFinPassport" className="block mb-1">
                      NRIC / FIN / Passport Number <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="nricFinPassport" 
                      name="nricFinPassport"
                      value={formData.nricFinPassport}
                      onChange={handleInputChange}
                      placeholder="e.g., S1234567A or AB1234567" 
                      className={`w-full ${validationErrors.nricFinPassport ? 'border-red-500' : ''}`}
                      required
                    />
                    <ValidationError fieldName="nricFinPassport" />
                  </div>
                  
                  <div>
                    <Label htmlFor="dateOfBirth" className="block mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input 
                        id="dateOfBirth" 
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        max={maxBirthDate}
                        className={`w-full pl-10 ${validationErrors.dateOfBirth ? 'border-red-500' : ''}`}
                        required
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    <ValidationError fieldName="dateOfBirth" />
                  </div>
                  
                  <div>
                    <Label htmlFor="gender" className="block mb-1">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <select 
                        id="gender" 
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none ${validationErrors.gender ? 'border-red-500' : ''}`}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <ValidationError fieldName="gender" />
                  </div>
                  
                  <div>
                    <Label htmlFor="nationality" className="block mb-1">
                      Nationality <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <select 
                        id="nationality" 
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className={`w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none ${validationErrors.nationality ? 'border-red-500' : ''}`}
                        required
                      >
                        <option value="">Select nationality</option>
                        <option value="singapore">Singaporean</option>
                        <option value="malaysia">Malaysian</option>
                        <option value="china">Chinese</option>
                        <option value="india">Indian</option>
                        <option value="others">Others</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <ValidationError fieldName="nationality" />
                  </div>
                  
                  <div>
                    <Label htmlFor="maritalStatus" className="block mb-1">
                      Marital Status <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <select 
                        id="maritalStatus" 
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        className={`w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none ${validationErrors.maritalStatus ? 'border-red-500' : ''}`}
                        required
                      >
                        <option value="">Select status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <ValidationError fieldName="maritalStatus" />
                  </div>
                  
                  <div>
                    <Label htmlFor="residentialStatus" className="block mb-1">
                      Residential Status <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <select 
                        id="residentialStatus" 
                        name="residentialStatus"
                        value={formData.residentialStatus}
                        onChange={handleInputChange}
                        className={`w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none ${validationErrors.residentialStatus ? 'border-red-500' : ''}`}
                        required
                      >
                        <option value="">Select status</option>
                        <option value="citizen">Citizen</option>
                        <option value="pr">Permanent Resident</option>
                        <option value="workpass">Work Pass Holder</option>
                        <option value="dependent">Dependent Pass Holder</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <ValidationError fieldName="residentialStatus" />
                  </div>
                  
                  <div>
                    <Label htmlFor="race" className="block mb-1">
                      Race / Ethnicity
                    </Label>
                    <div className="relative">
                      <select 
                        id="race" 
                        name="race"
                        value={formData.race}
                        onChange={handleInputChange}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
                      >
                        <option value="">Select ethnicity</option>
                        <option value="chinese">Chinese</option>
                        <option value="malay">Malay</option>
                        <option value="indian">Indian</option>
                        <option value="eurasian">Eurasian</option>
                        <option value="others">Others</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="religion" className="block mb-1">
                    Religion
                  </Label>
                  <Input 
                    id="religion" 
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    placeholder="Enter religion (letters only)" 
                    className={`w-full ${validationErrors.religion ? 'border-red-500' : ''}`}
                  />
                  <ValidationError fieldName="religion" />
                </div>
              </TabsContent>
              
              <TabsContent value="contact">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="block mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com" 
                      className={`w-full ${validationErrors.email ? 'border-red-500' : ''}`}
                      required
                    />
                    <ValidationError fieldName="email" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="block mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <select
                        value={phoneCountryCode}
                        onChange={(e) => handleCountryCodeChange(e.target.value)}
                        className="w-24 h-9 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
                      >
                        <option value="+65">🇸🇬 +65</option>
                        <option value="+91">🇮🇳 +91</option>
                      </select>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={getPhoneDisplayValue(formData.phone, phoneCountryCode)}
                        onChange={(e) => handlePhoneChange(e)}
                        placeholder={phoneCountryCode === "+65" ? "8XXX XXXX" : "9XXXX XXXXX"}
                        className={`flex-1 ${validationErrors.phone ? 'border-red-500' : ''}`}
                        required
                      />
                    </div>
                    <ValidationError fieldName="phone" />
                    <p className="text-xs text-gray-500 mt-1">
                      {phoneCountryCode === "+65" 
                        ? "Singapore mobile numbers start with 8 or 9" 
                        : "India mobile numbers start with 6, 7, 8, or 9"
                      }
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="block mb-1">
                      Residential Address <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="address" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter full address" 
                      className={`w-full mb-2 ${validationErrors.address ? 'border-red-500' : ''}`}
                      required
                    />
                    <ValidationError fieldName="address" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City (letters only)" 
                          className={validationErrors.city ? 'border-red-500' : ''}
                        />
                        <ValidationError fieldName="city" />
                      </div>
                      <div>
                        <Input 
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="Postal Code (6 digits)" 
                          maxLength={6}
                          className={validationErrors.postalCode ? 'border-red-500' : ''}
                        />
                        <ValidationError fieldName="postalCode" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyContact" className="block mb-1">
                      Emergency Contact Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="emergencyContact" 
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Enter emergency contact name" 
                      className={`w-full ${validationErrors.emergencyContact ? 'border-red-500' : ''}`}
                      required
                    />
                    <ValidationError fieldName="emergencyContact" />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyPhone" className="block mb-1">
                      Emergency Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <select
                        value={emergencyPhoneCountryCode}
                        onChange={(e) => handleCountryCodeChange(e.target.value, true)}
                        className="w-24 h-9 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
                      >
                        <option value="+65">🇸🇬 +65</option>
                        <option value="+91">🇮🇳 +91</option>
                      </select>
                      <Input 
                        id="emergencyPhone" 
                        name="emergencyPhone"
                        value={getPhoneDisplayValue(formData.emergencyPhone, emergencyPhoneCountryCode)}
                        onChange={(e) => handlePhoneChange(e, true)}
                        placeholder={emergencyPhoneCountryCode === "+65" ? "8XXX XXXX" : "9XXXX XXXXX"}
                        className={`flex-1 ${validationErrors.emergencyPhone ? 'border-red-500' : ''}`}
                        required
                      />
                    </div>
                    <ValidationError fieldName="emergencyPhone" />
                    <p className="text-xs text-gray-500 mt-1">
                      {emergencyPhoneCountryCode === "+65" 
                        ? "Singapore mobile numbers start with 8 or 9" 
                        : "India mobile numbers start with 6, 7, 8, or 9"
                      }
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="employment">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Employment Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="employeeId" className="block mb-1">
                      Employee ID <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="employeeId" 
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      placeholder="Enter employee ID (letters and numbers)" 
                      className={`w-full ${validationErrors.employeeId ? 'border-red-500' : ''}`}
                      required
                      disabled={isEditMode}
                    />
                    <ValidationError fieldName="employeeId" />
                    {isEditMode && (
                      <p className="text-xs text-gray-500 mt-1">Employee ID cannot be changed</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="department" className="block mb-1">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <select 
                        id="department" 
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none ${validationErrors.department ? 'border-red-500' : ''}`}
                        required
                      >
                        <option value="">Select department</option>
                        <option value="hr">Human Resources</option>
                        <option value="it">Information Technology</option>
                        <option value="finance">Finance</option>
                        <option value="marketing">Marketing</option>
                        <option value="operations">Operations</option>
                        <option value="sales">Sales</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <ValidationError fieldName="department" />
                  </div>

                  <div>
                    <Label htmlFor="position" className="block mb-1">
                      Position / Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="position" 
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="Enter position (letters only)" 
                      className={`w-full ${validationErrors.position ? 'border-red-500' : ''}`}
                      required
                    />
                    <ValidationError fieldName="position" />
                  </div>

                  <div>
                    <Label htmlFor="joinDate" className="block mb-1">
                      Join Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input 
                        id="joinDate" 
                        name="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={handleInputChange}
                        max={today}
                        className={`w-full pl-10 ${validationErrors.joinDate ? 'border-red-500' : ''}`}
                        required
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  <div>
                    <Label htmlFor="employmentType" className="block mb-1">
                      Employment Type <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <select 
                        id="employmentType" 
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleInputChange}
                        className={`w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none ${validationErrors.employmentType ? 'border-red-500' : ''}`}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="fulltime">Full-time</option>
                        <option value="parttime">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="intern">Intern</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <ValidationError fieldName="employmentType" />
                  </div>

                  <div>
                    <Label htmlFor="reportingManager" className="block mb-1">
                      Reporting Manager
                    </Label>
                    <Input 
                      id="reportingManager" 
                      name="reportingManager"
                      value={formData.reportingManager}
                      onChange={handleInputChange}
                      placeholder="Enter reporting manager name" 
                      className={`w-full ${validationErrors.reportingManager ? 'border-red-500' : ''}`}
                    />
                    <ValidationError fieldName="reportingManager" />
                  </div>
                </div>
                </div>
              </TabsContent>

              <TabsContent value="salary">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Salary & Payroll Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="basicSalary" className="block mb-1">
                      Basic Salary (SGD) <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="basicSalary" 
                      name="basicSalary"
                      type="number"
                      step="0.01"
                      min="0"
                      max="999999"
                      value={formData.basicSalary}
                      onChange={handleInputChange}
                      placeholder="0.00" 
                      className={`w-full ${validationErrors.basicSalary ? 'border-red-500' : ''}`}
                      required
                    />
                    <ValidationError fieldName="basicSalary" />
                  </div>

                  <div>
                    <Label htmlFor="paymentMode" className="block mb-1">
                      Payment Mode <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <select 
                        id="paymentMode" 
                        name="paymentMode"
                        value={formData.paymentMode}
                        onChange={handleInputChange}
                        className={`w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none ${validationErrors.paymentMode ? 'border-red-500' : ''}`}
                        required
                      >
                        <option value="">Select mode</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <ValidationError fieldName="paymentMode" />
                  </div>

                  <div>
                    <Label htmlFor="bankName" className="block mb-1">
                      Bank Name
                    </Label>
                    <Input 
                      id="bankName" 
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Enter bank name (letters only)" 
                      className={`w-full ${validationErrors.bankName ? 'border-red-500' : ''}`}
                    />
                    <ValidationError fieldName="bankName" />
                  </div>

                  <div>
                    <Label htmlFor="accountNumber" className="block mb-1">
                      Account Number
                    </Label>
                    <Input 
                      id="accountNumber" 
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Enter account number (8-20 digits)" 
                      maxLength={20}
                      className={`w-full ${validationErrors.accountNumber ? 'border-red-500' : ''}`}
                    />
                    <ValidationError fieldName="accountNumber" />
                  </div>

                  <div>
                    <Label htmlFor="cpfNumber" className="block mb-1">
                      CPF Number
                    </Label>
                    <Input 
                      id="cpfNumber" 
                      name="cpfNumber"
                      value={formData.cpfNumber}
                      onChange={handleInputChange}
                      placeholder="123456789A" 
                      maxLength={10}
                      className={`w-full ${validationErrors.cpfNumber ? 'border-red-500' : ''}`}
                    />
                    <ValidationError fieldName="cpfNumber" />
                    <p className="text-xs text-gray-500 mt-1">Format: 9 digits followed by 1 letter</p>
                  </div>

                  <div>
                    <Label htmlFor="taxNumber" className="block mb-1">
                      Tax Number
                    </Label>
                    <Input 
                      id="taxNumber" 
                      name="taxNumber"
                      value={formData.taxNumber}
                      onChange={handleInputChange}
                      placeholder="Enter tax number" 
                      className={`w-full ${validationErrors.taxNumber ? 'border-red-500' : ''}`}
                    />
                    <ValidationError fieldName="taxNumber" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Documents</h2>
                {!formData.employeeId && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Note:</strong> Please fill in the Employee ID in the Employment tab first before uploading documents.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SimpleFileUpload
                    label="NRIC/FIN/Passport"
                    documentType="nric"
                    employeeId={formData.employeeId}
                    required
                    onUploadSuccess={(file) => console.log('NRIC uploaded:', file)}
                    onError={(error) => setMessage(`File Error: ${error}`)}
                  />
                  <SimpleFileUpload
                    label="Employee Photo"
                    documentType="photo"
                    employeeId={formData.employeeId}
                    required
                    onUploadSuccess={(file) => console.log('Photo uploaded:', file)}
                    onError={(error) => setMessage(`File Error: ${error}`)}
                  />
                  <SimpleFileUpload
                    label="Resume/CV"
                    documentType="resume"
                    employeeId={formData.employeeId}
                    onUploadSuccess={(file) => console.log('Resume uploaded:', file)}
                    onError={(error) => setMessage(`File Error: ${error}`)}
                  />
                  <SimpleFileUpload
                    label="Educational Certificates"
                    documentType="education"
                    employeeId={formData.employeeId}
                    onUploadSuccess={(file) => console.log('Education uploaded:', file)}
                    onError={(error) => setMessage(`File Error: ${error}`)}
                  />
                  <SimpleFileUpload
                    label="Work Pass/Visa Documents"
                    documentType="workpass"
                    employeeId={formData.employeeId}
                    onUploadSuccess={(file) => console.log('Work pass uploaded:', file)}
                    onError={(error) => setMessage(`File Error: ${error}`)}
                  />
                  <SimpleFileUpload
                    label="Bank Account Details"
                    documentType="bank"
                    employeeId={formData.employeeId}
                    onUploadSuccess={(file) => console.log('Bank details uploaded:', file)}
                    onError={(error) => setMessage(`File Error: ${error}`)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="additional">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Additional Information</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="skills" className="block mb-1">
                      Skills
                    </Label>
                    <textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      placeholder="List relevant skills separated by commas"
                    />
                  </div>

                  <div>
                    <Label htmlFor="certifications" className="block mb-1">
                      Certifications
                    </Label>
                    <textarea
                      id="certifications"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      placeholder="List certifications"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="block mb-1">
                      Additional Notes
                    </Label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      placeholder="Any additional information or notes"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousTab}
                  disabled={isFirstTab}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="text-sm text-gray-500">
                  Step {currentTabIndex + 1} of {TAB_ORDER.length}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToNextTab}
                  disabled={isLastTab}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Tabs>
          
          <div className="mt-6 flex gap-4 justify-end px-6 pb-6">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-6"
              >
                Cancel
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-6"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Employee' : 'Create Employee'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}