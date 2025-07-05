import { auth } from '@clerk/nextjs/server';
import { UserRole, Permission } from '@/types/auth';
import { getRolePermissions, hasPermission } from '@/lib/auth/roles';
// ...existing code...
interface SessionMetadata {
  role?: UserRole;
  [key: string]: unknown;
}

export async function useServerAuth() {
  const { userId, sessionClaims } = await auth();

  const metadata = (sessionClaims?.metadata ?? {}) as SessionMetadata;

  if (!userId) {
    return {
      user: null,
      isAuthenticated: false,
      role: null,
      permissions: [],
      hasPermission: () => false,
    };
  }

  const role = metadata.role || UserRole.EMPLOYEE;
  const permissions = getRolePermissions(role);

  return {
    user: {
      id: userId,
      role,
      permissions,
    },
    isAuthenticated: true,
    role,
    permissions,
    hasPermission: (permission: Permission) => hasPermission(role, permission),
  };
}
// ...existing code...