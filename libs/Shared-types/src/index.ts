

// Common types for the ERP system
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'hr' | 'employee'
  createdAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Basic employee type
export interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  department: string
  position: string
  status: 'active' | 'inactive'
}