// apps/frontend/src/types/auth.ts
export enum UserRole {
  ADMIN = 'admin',
  HR_MANAGER = 'hr_manager',
  FINANCE_MANAGER = 'finance_manager',
  SUPERVISOR = 'supervisor',
  EMPLOYEE = 'employee'
}

export enum Permission {
  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  SYSTEM_CONFIG = 'system_config',
  
  // HR permissions
  MANAGE_EMPLOYEES = 'manage_employees',
  VIEW_ALL_ATTENDANCE = 'view_all_attendance',
  MANAGE_PAYROLL = 'manage_payroll',
  MANAGE_RECRUITMENT = 'manage_recruitment',
  MANAGE_TRAINING = 'manage_training',
  MANAGE_PERFORMANCE = 'manage_performance',
  
  // Finance permissions
  MANAGE_LEDGER = 'manage_ledger',
  MANAGE_ACCOUNTS_PAYABLE = 'manage_accounts_payable',
  MANAGE_ACCOUNTS_RECEIVABLE = 'manage_accounts_receivable',
  MANAGE_BUDGET = 'manage_budget',
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',
  
  // Supervisor permissions
  APPROVE_LEAVES = 'approve_leaves',
  VIEW_TEAM_ATTENDANCE = 'view_team_attendance',
  MANAGE_TEAM_PERFORMANCE = 'manage_team_performance',
  
  // Employee permissions
  VIEW_OWN_DATA = 'view_own_data',
  APPLY_LEAVE = 'apply_leave',
  VIEW_PAYSLIPS = 'view_payslips',
  UPDATE_PROFILE = 'update_profile'
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  permissions: Permission[];
  organizationId?: string;
}