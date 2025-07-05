import { auth, currentUser } from '@clerk/nextjs/server';
import { UserRole, type AuthUser } from '@/types/auth';
import { getRolePermissions } from './roles';
import { redirect } from 'next/navigation';

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await currentUser();
    if (!user) return null;

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
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }
  return userId;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await getCurrentAuthUser();
  
  if (!user || !allowedRoles.includes(user.role)) {
    redirect('/');
  }
  
  return user;
}

export function getRedirectPath(role: UserRole): string {
  const roleRedirects: Record<UserRole, string> = {
    [UserRole.ADMIN]: '/admin',
    [UserRole.HR_MANAGER]: '/hr',
    [UserRole.FINANCE_MANAGER]: '/finance',
    [UserRole.SUPERVISOR]: '/supervisor',
    [UserRole.EMPLOYEE]: '/employee'
  };
  
  return roleRedirects[role] || '/';
}