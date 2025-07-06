// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  count?: number
  message?: string
  error?: string
}

// Employee Types (matching backend)
export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department?: string
  position?: string
  joiningDate?: string
  salary?: string
  status?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface NewEmployee {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department?: string
  position?: string
  joiningDate?: string
  salary?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
}

// Department Types
export interface Department {
  id: string
  name: string
  description?: string
  headOfDepartment?: string
  budget?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  role: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalEmployees: number
  totalDepartments: number
  activeEmployees: number
  lastUpdated: string
}