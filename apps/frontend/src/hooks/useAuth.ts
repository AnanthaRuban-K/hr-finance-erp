import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { UserRole, UserProfile, Permission } from '@/types/auth'

// Role display names mapping
const roleDisplayNames: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.HR_MANAGER]: 'HR Manager',
  [UserRole.FINANCE_MANAGER]: 'Finance Manager',
  [UserRole.EMPLOYEE]: 'Employee'
}

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut, getToken } = useClerkAuth()

  // Get user role from Clerk public metadata
  const getUserRole = (): UserRole => {
    const role = user?.publicMetadata?.role as UserRole
    return role || UserRole.EMPLOYEE
  }

  // Get role display name
  const getRoleDisplayName = (): string => {
    const role = getUserRole()
    return roleDisplayNames[role]
  }

  // Get user permissions based on role
  const getUserPermissions = (): Permission[] => {
    const role = getUserRole()
    
    const rolePermissions: Record<UserRole, Permission[]> = {
      [UserRole.ADMIN]: [
        { id: '1', name: 'Full Access', resource: '*', action: 'admin' },
      ],
      [UserRole.HR_MANAGER]: [
        { id: '2', name: 'Employee Management', resource: 'employees', action: 'write' },
        { id: '3', name: 'Leave Management', resource: 'leaves', action: 'write' },
        { id: '4', name: 'Attendance Management', resource: 'attendance', action: 'write' },
        { id: '5', name: 'Reports View', resource: 'reports', action: 'read' },
      ],
      [UserRole.FINANCE_MANAGER]: [
        { id: '6', name: 'Payroll Management', resource: 'payroll', action: 'write' },
        { id: '7', name: 'Financial Reports', resource: 'finance', action: 'write' },
        { id: '8', name: 'Employee Data View', resource: 'employees', action: 'read' },
      ],
      [UserRole.EMPLOYEE]: [
        { id: '9', name: 'Profile View', resource: 'profile', action: 'read' },
        { id: '10', name: 'Leave Request', resource: 'leaves', action: 'write' },
        { id: '11', name: 'Attendance View', resource: 'attendance', action: 'read' },
      ],
    }

    return rolePermissions[role] || []
  }

  // Check if user has specific permission
  const hasPermission = (resource: string, action: string): boolean => {
    const role = getUserRole()
    const permissions = getUserPermissions()
    
    // Admin has all permissions
    if (role === UserRole.ADMIN) return true
    
    return permissions.some(p => 
      (p.resource === resource || p.resource === '*') && 
      (p.action === action || p.action === 'admin')
    )
  }

  // Get authentication token for API calls
  const getAuthToken = async (): Promise<string | null> => {
    try {
      return await getToken()
    } catch (error) {
      console.error('Error getting auth token:', error)
      return null
    }
  }

  // Create user profile from Clerk user
  const userProfile: UserProfile | null = user && isSignedIn ? {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    role: getUserRole(),
    employeeId: user.publicMetadata?.employeeId as string,
    department: user.publicMetadata?.department as string,
    permissions: getUserPermissions(),
    createdAt: user.createdAt || new Date(),
    updatedAt: user.updatedAt || new Date(),
  } : null

  return {
    user: userProfile,
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn || false,
    hasPermission,
    getUserRole,
    getAuthToken,
    signOut: () => signOut({ redirectUrl: '/' }),
    roleDisplayName: getRoleDisplayName(), // Fixed: Now included in return
    getRoleDisplayName, // Additional method if needed
  }
}