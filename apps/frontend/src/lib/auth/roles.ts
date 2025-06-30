// apps/frontend/src/lib/auth/roles.ts
import { UserRole, Permission } from '@/types/auth';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.MANAGE_ROLES,
    Permission.SYSTEM_CONFIG,
    Permission.MANAGE_EMPLOYEES,
    Permission.VIEW_ALL_ATTENDANCE,
    Permission.MANAGE_PAYROLL,
    Permission.MANAGE_LEDGER,
    Permission.MANAGE_ACCOUNTS_PAYABLE,
    Permission.MANAGE_ACCOUNTS_RECEIVABLE,
    Permission.MANAGE_BUDGET,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.APPROVE_LEAVES,
    Permission.VIEW_TEAM_ATTENDANCE,
    Permission.MANAGE_TEAM_PERFORMANCE,
    Permission.VIEW_OWN_DATA,
    Permission.APPLY_LEAVE,
    Permission.VIEW_PAYSLIPS,
    Permission.UPDATE_PROFILE
  ],
  
  [UserRole.HR_MANAGER]: [
    Permission.MANAGE_EMPLOYEES,
    Permission.VIEW_ALL_ATTENDANCE,
    Permission.MANAGE_PAYROLL,
    Permission.MANAGE_RECRUITMENT,
    Permission.MANAGE_TRAINING,
    Permission.MANAGE_PERFORMANCE,
    Permission.APPROVE_LEAVES,
    Permission.VIEW_OWN_DATA,
    Permission.APPLY_LEAVE,
    Permission.VIEW_PAYSLIPS,
    Permission.UPDATE_PROFILE
  ],
  
  [UserRole.FINANCE_MANAGER]: [
    Permission.MANAGE_LEDGER,
    Permission.MANAGE_ACCOUNTS_PAYABLE,
    Permission.MANAGE_ACCOUNTS_RECEIVABLE,
    Permission.MANAGE_BUDGET,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.MANAGE_PAYROLL,
    Permission.VIEW_OWN_DATA,
    Permission.APPLY_LEAVE,
    Permission.VIEW_PAYSLIPS,
    Permission.UPDATE_PROFILE
  ],
  
  [UserRole.SUPERVISOR]: [
    Permission.APPROVE_LEAVES,
    Permission.VIEW_TEAM_ATTENDANCE,
    Permission.MANAGE_TEAM_PERFORMANCE,
    Permission.VIEW_OWN_DATA,
    Permission.APPLY_LEAVE,
    Permission.VIEW_PAYSLIPS,
    Permission.UPDATE_PROFILE
  ],
  
  [UserRole.EMPLOYEE]: [
    Permission.VIEW_OWN_DATA,
    Permission.APPLY_LEAVE,
    Permission.VIEW_PAYSLIPS,
    Permission.UPDATE_PROFILE
  ]
};

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}