import { UserRole, Permission } from '@/types/auth';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // System Administration
    Permission.MANAGE_USERS,
    Permission.MANAGE_ROLES,
    Permission.SYSTEM_CONFIG,
    Permission.ACCESS_AUDIT_LOGS,
    Permission.MANAGE_INTEGRATIONS,

    // Employee Management
    Permission.MANAGE_EMPLOYEES,
    Permission.VIEW_ALL_EMPLOYEES,
    Permission.MANAGE_EMPLOYEE_DATA,
    Permission.VIEW_ALL_ATTENDANCE,
    Permission.MANAGE_DEPARTMENTS,
    Permission.MANAGE_DESIGNATIONS,

    // HR Operations
    Permission.MANAGE_RECRUITMENT,
    Permission.MANAGE_JOB_POSTINGS,
    Permission.VIEW_ALL_CANDIDATES,
    Permission.MANAGE_INTERVIEWS,
    Permission.MANAGE_ONBOARDING,
    Permission.MANAGE_TRAINING,
    Permission.MANAGE_PERFORMANCE,
    Permission.MANAGE_EXIT_PROCESS,

    // Payroll & Finance
    Permission.MANAGE_PAYROLL,
    Permission.PROCESS_PAYROLL,
    Permission.MANAGE_SALARY_STRUCTURES,
    Permission.MANAGE_LEDGER,
    Permission.MANAGE_ACCOUNTS_PAYABLE,
    Permission.MANAGE_ACCOUNTS_RECEIVABLE,
    Permission.MANAGE_BUDGET,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.MANAGE_EXPENSES,

    // Time & Attendance
    Permission.APPROVE_LEAVES,
    Permission.MANAGE_LEAVE_POLICIES,
    Permission.VIEW_TEAM_ATTENDANCE,
    Permission.MANAGE_SHIFTS,
    Permission.MANAGE_HOLIDAYS,

    // Reports & Analytics
    Permission.VIEW_ALL_REPORTS,
    Permission.CREATE_CUSTOM_REPORTS,
    Permission.EXPORT_DATA,

    // Employee Self-Service
    Permission.VIEW_OWN_DATA,
    Permission.APPLY_LEAVE,
    Permission.VIEW_PAYSLIPS,
    Permission.UPDATE_PROFILE,
    Permission.SUBMIT_EXPENSES,
  ],

  [UserRole.SUPERVISOR]: [
    // Team Management
    Permission.VIEW_TEAM_DATA,
    Permission.VIEW_TEAM_ATTENDANCE,
    Permission.MANAGE_TEAM_PERFORMANCE,
    Permission.CONDUCT_PERFORMANCE_REVIEWS,

    // Leave & Attendance
    Permission.APPROVE_LEAVES,
    Permission.VIEW_TEAM_LEAVE_BALANCE,
    Permission.MANAGE_TEAM_SHIFTS,

    // Limited HR Access
    Permission.VIEW_TEAM_EMPLOYEES,
    Permission.PARTICIPATE_IN_RECRUITMENT,
    Permission.CONDUCT_INTERVIEWS,
    Permission.PROVIDE_CANDIDATE_FEEDBACK,

    // Expense Management
    Permission.APPROVE_TEAM_EXPENSES,
    Permission.VIEW_TEAM_EXPENSES,

    // Reports (Team Focused)
    Permission.VIEW_TEAM_REPORTS,
    Permission.VIEW_TEAM_PERFORMANCE_REPORTS,

    // Employee Self-Service
    Permission.VIEW_OWN_DATA,
    Permission.APPLY_LEAVE,
    Permission.VIEW_PAYSLIPS,
    Permission.UPDATE_PROFILE,
    Permission.SUBMIT_EXPENSES,
    Permission.VIEW_TEAM_CALENDAR,
  ],

  [UserRole.EMPLOYEE]: [
    // Self-Service Only
    Permission.VIEW_OWN_DATA,
    Permission.APPLY_LEAVE,
    Permission.VIEW_PAYSLIPS,
    Permission.UPDATE_PROFILE,
    Permission.SUBMIT_EXPENSES,
    Permission.VIEW_OWN_ATTENDANCE,
    Permission.VIEW_OWN_PERFORMANCE,
    Permission.ACCESS_TRAINING_MATERIALS,
    Permission.VIEW_COMPANY_DIRECTORY,
    Permission.VIEW_ANNOUNCEMENTS,
    Permission.PARTICIPATE_IN_SURVEYS,
  ],
  [UserRole.HR_MANAGER]: [],
  [UserRole.FINANCE_MANAGER]: []
};

// Helper functions for role and permission management
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