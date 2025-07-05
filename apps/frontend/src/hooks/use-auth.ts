'use client';

import { useUser } from '@clerk/nextjs';
import { UserRole, Permission, type AuthUser } from '@/types/auth';
import { getRolePermissions, hasPermission } from '@/lib/auth/roles';
import { useMemo } from 'react';

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  const authUser: AuthUser | null = useMemo(() => {
    if (!user || !isSignedIn) return null;
    
    const role = (user.publicMetadata?.role as UserRole) || UserRole.EMPLOYEE;
    const permissions = getRolePermissions(role);
    
    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      role,
      permissions,
      organizationId: user.publicMetadata?.organizationId as string || undefined
    };
  }, [user, isSignedIn]);
  
  const checkPermission = (permission: Permission): boolean => {
    if (!authUser) return false;
    return hasPermission(authUser.role, permission);
  };
  
  const checkRole = (role: UserRole): boolean => {
    return authUser?.role === role;
  };
  
  const checkRoles = (roles: UserRole[]): boolean => {
    if (!authUser) return false;
    return roles.includes(authUser.role);
  };
  
  return {
    user: authUser,
    isLoaded,
    isSignedIn,
    checkPermission,
    checkRole,
    checkRoles,
    hasPermission: checkPermission,
    hasRole: checkRole,
    hasRoles: checkRoles
    

  };


}