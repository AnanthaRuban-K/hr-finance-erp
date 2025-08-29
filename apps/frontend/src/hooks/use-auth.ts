'use client'

import { useUser } from '@clerk/nextjs'
import { UserRole, Permission, type AuthUser } from '@/types/auth'
import { getRolePermissions, hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/auth/roles'
import { useMemo, useEffect, useState, useCallback } from 'react'

interface UseAuthReturn {
  // User data
  user: AuthUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  
  // Permission checks
  checkPermission: (permission: Permission) => boolean;
  checkPermissions: (permissions: Permission[], requireAll?: boolean) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  
  // Role checks
  checkRole: (role: UserRole) => boolean;
  checkRoles: (roles: UserRole[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasRoles: (roles: UserRole[]) => boolean;
  isAdmin: boolean;
  isHRManager: boolean;
  isFinanceManager: boolean;
  isSupervisor: boolean;
  isEmployee: boolean;
  
  // Advanced checks
  canManageUsers: boolean;
  canManageEmployees: boolean;
  canManageFinance: boolean;
  canViewReports: boolean;
  canApproveLeaves: boolean;
  canManagePayroll: boolean;
  canAccessRecruitment: boolean;
  
  // User context
  userDisplayName: string;
  userInitials: string;
  userRoleDisplay: string;
  organizationContext: string | null;
}

export function useAuth(): UseAuthReturn {
  const [isMounted, setIsMounted] = useState(false)
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const authUser: AuthUser | null = useMemo(() => {
    if (!isMounted || !user || !isSignedIn) return null

    const role = (user.publicMetadata?.role as UserRole) || UserRole.EMPLOYEE
    const permissions = getRolePermissions(role)
    const organizationId = user.publicMetadata?.organizationId as string
    const isApproved = user.publicMetadata?.isApproved as boolean

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      imageUrl: user.imageUrl || '',
      role,
      permissions,
      organizationId: organizationId || undefined,
      publicMetadata: {
        isApproved: isApproved,
        organizationId,
        ...user.publicMetadata,
      },
    }
  }, [user, isSignedIn, isMounted])

  // Permission checking functions
  const checkPermission = useCallback((permission: Permission): boolean => {
    if (!authUser) return false
    return hasPermission(authUser.role, permission)
  }, [authUser])

  const checkPermissions = useCallback((permissions: Permission[], requireAll = false): boolean => {
    if (!authUser) return false
    return requireAll 
      ? hasAllPermissions(authUser.role, permissions)
      : hasAnyPermission(authUser.role, permissions)
  }, [authUser])

  // Role checking functions
  const checkRole = useCallback((role: UserRole): boolean => {
    return authUser?.role === role
  }, [authUser])

  const checkRoles = useCallback((roles: UserRole[]): boolean => {
    if (!authUser) return false
    return roles.includes(authUser.role)
  }, [authUser])

  // Computed role booleans
  const isAdmin = useMemo(() => authUser?.role === UserRole.ADMIN, [authUser])
  const isHRManager = useMemo(() => authUser?.role === UserRole.HR_MANAGER, [authUser])
  const isFinanceManager = useMemo(() => authUser?.role === UserRole.FINANCE_MANAGER, [authUser])
  const isSupervisor = useMemo(() => authUser?.role === UserRole.SUPERVISOR, [authUser])
  const isEmployee = useMemo(() => authUser?.role === UserRole.EMPLOYEE, [authUser])

  // Advanced permission checks
  const canManageUsers = useMemo(() => 
    checkPermission(Permission.MANAGE_USERS), [checkPermission]
  )
  
  const canManageEmployees = useMemo(() => 
    checkPermission(Permission.MANAGE_EMPLOYEES), [checkPermission]
  )
  
  const canManageFinance = useMemo(() => 
    checkPermissions([
      Permission.MANAGE_LEDGER,
      Permission.MANAGE_ACCOUNTS_PAYABLE,
      Permission.MANAGE_ACCOUNTS_RECEIVABLE,
      Permission.MANAGE_BUDGET
    ]), [checkPermissions]
  )
  
  const canViewReports = useMemo(() => 
    checkPermissions([
      Permission.VIEW_FINANCIAL_REPORTS,
      Permission.MANAGE_PERFORMANCE,
      Permission.VIEW_ALL_ATTENDANCE
    ]), [checkPermissions]
  )
  
  const canApproveLeaves = useMemo(() => 
    checkPermission(Permission.APPROVE_LEAVES), [checkPermission]
  )
  
  const canManagePayroll = useMemo(() => 
    checkPermission(Permission.MANAGE_PAYROLL), [checkPermission]
  )
  
  const canAccessRecruitment = useMemo(() => 
    checkPermission(Permission.MANAGE_RECRUITMENT), [checkPermission]
  )

  // User display helpers
  const userDisplayName = useMemo(() => {
    if (!authUser) return 'Guest User'
    if (authUser.firstName && authUser.lastName) {
      return `${authUser.firstName} ${authUser.lastName}`
    }
    if (authUser.firstName) return authUser.firstName
    if (authUser.lastName) return authUser.lastName
    return authUser.email.split('@')[0] || 'User'
  }, [authUser])

  const userInitials = useMemo(() => {
    if (!authUser) return 'GU'
    const firstName = authUser.firstName || ''
    const lastName = authUser.lastName || ''
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (firstName) return `${firstName[0]}${firstName[1] || ''}`.toUpperCase()
    if (lastName) return `${lastName[0]}${lastName[1] || ''}`.toUpperCase()
    return authUser.email.slice(0, 2).toUpperCase()
  }, [authUser])

  const userRoleDisplay = useMemo(() => {
    if (!authUser) return 'Guest'
    const roleDisplayNames = {
      [UserRole.ADMIN]: 'System Administrator',
      [UserRole.HR_MANAGER]: 'HR Manager',
      [UserRole.FINANCE_MANAGER]: 'Finance Manager',
      [UserRole.SUPERVISOR]: 'Team Supervisor',
      [UserRole.EMPLOYEE]: 'Employee',
    }
    return roleDisplayNames[authUser.role] || 'Unknown Role'
  }, [authUser])

  const organizationContext = useMemo(() => {
    return authUser?.organizationId || null
  }, [authUser])

  return {
    // User data
    user: authUser,
    isLoaded: isMounted && isLoaded,
    isSignedIn: isMounted && isSignedIn,
    
    // Permission checks
    checkPermission,
    checkPermissions,
    hasPermission: checkPermission,
    hasAnyPermission: (permissions: Permission[]) => checkPermissions(permissions, false),
    hasAllPermissions: (permissions: Permission[]) => checkPermissions(permissions, true),
    
    // Role checks
    checkRole,
    checkRoles,
    hasRole: checkRole,
    hasRoles: checkRoles,
    isAdmin,
    isHRManager,
    isFinanceManager,
    isSupervisor,
    isEmployee,
    
    // Advanced checks
    canManageUsers,
    canManageEmployees,
    canManageFinance,
    canViewReports,
    canApproveLeaves,
    canManagePayroll,
    canAccessRecruitment,
    
    // User context
    userDisplayName,
    userInitials,
    userRoleDisplay,
    organizationContext,
  }
}