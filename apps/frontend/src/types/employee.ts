export interface Employee {
  id: string;
  fullName: string;
  nricFinPassport: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  nationality: "singapore" | "malaysia" | "china" | "india" | "others";
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  residentialStatus: "citizen" | "pr" | "workpass" | "dependent";
  race?: string;
  religion?: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  emergencyContact: string;
  emergencyPhone: string;
  employeeId: string;
  department: "hr" | "it" | "finance" | "marketing" | "operations" | "sales";
  position: string;
  joinDate: string;
  employmentType: "fulltime" | "parttime" | "contract" | "intern";
  reportingManager?: string;
  basicSalary: number;
  paymentMode: "bank" | "cash" | "cheque";
  bankName?: string;
  accountNumber?: string;
  cpfNumber?: string;
  taxNumber?: string;
  skills?: string;
  certifications?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData extends Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'basicSalary'> {
  basicSalary: string; // Form uses string, converts to number on submit
}

export interface FileUpload {
  originalName: string;
  fileName: string;
  fullPath: string;
  folderPath: string;
  url: string;
  size: number;
  type: string;
  uploadDate: string;
  employeeId: string;
  documentType: string;
}

export interface EmployeeAPIResponse {
  success: boolean;
  employee?: Employee;
  error?: string;
  message?: string;
}