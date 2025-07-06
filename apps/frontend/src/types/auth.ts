export enum UserRole {
  ADMIN = 'admin',
  HR_MANAGER = 'hr_manager',
  EMPLOYEE = 'employee',
  FINANCE_MANAGER = 'finance_manager'
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: 'read' | 'write' | 'delete' | 'admin'
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  employeeId?: string
  department?: string
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  permissions: Permission[]
}

// Role display names - moved to useAuth hook for better encapsulation
export const getRoleDisplayName = (role: UserRole): string => {
  const names = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.HR_MANAGER]: 'HR Manager',
    [UserRole.FINANCE_MANAGER]: 'Finance Manager',
    [UserRole.EMPLOYEE]: 'Employee'
  }
  return names[role]
}

// Role badge colors for UI
export const getRoleBadgeColor = (role: UserRole): string => {
  const colors = {
    [UserRole.ADMIN]: 'bg-red-100 text-red-800 border-red-200',
    [UserRole.HR_MANAGER]: 'bg-blue-100 text-blue-800 border-blue-200',
    [UserRole.FINANCE_MANAGER]: 'bg-green-100 text-green-800 border-green-200',
    [UserRole.EMPLOYEE]: 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colors[role]
}