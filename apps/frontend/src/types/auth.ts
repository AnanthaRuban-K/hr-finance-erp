export enum UserRole {
  ADMIN = 'admin',
  HR_MANAGER = 'hr_manager',
  FINANCE_MANAGER = 'finance_manager',
  SUPERVISOR = 'supervisor',
  EMPLOYEE = 'employee'
}

export enum Permission {
  // System Administration
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  SYSTEM_CONFIG = 'system_config',
  ACCESS_AUDIT_LOGS = 'access_audit_logs',
  MANAGE_INTEGRATIONS = 'manage_integrations',
  
  // Employee Management
  MANAGE_EMPLOYEES = 'manage_employees',
  VIEW_ALL_EMPLOYEES = 'view_all_employees',
  MANAGE_EMPLOYEE_DATA = 'manage_employee_data',
  VIEW_ALL_ATTENDANCE = 'view_all_attendance',
  MANAGE_DEPARTMENTS = 'manage_departments',
  MANAGE_DESIGNATIONS = 'manage_designations',
  
  // Recruitment & Hiring
  MANAGE_RECRUITMENT = 'manage_recruitment',
  MANAGE_JOB_POSTINGS = 'manage_job_postings',
  VIEW_ALL_CANDIDATES = 'view_all_candidates',
  MANAGE_INTERVIEWS = 'manage_interviews',
  SCHEDULE_INTERVIEWS = 'schedule_interviews',
  EVALUATE_CANDIDATES = 'evaluate_candidates',
  MANAGE_JOB_OFFERS = 'manage_job_offers',
  PARTICIPATE_IN_RECRUITMENT = 'participate_in_recruitment',
  CONDUCT_INTERVIEWS = 'conduct_interviews',
  PROVIDE_CANDIDATE_FEEDBACK = 'provide_candidate_feedback',
  
  // HR Operations
  MANAGE_ONBOARDING = 'manage_onboarding',
  MANAGE_TRAINING = 'manage_training',
  MANAGE_PERFORMANCE = 'manage_performance',
  CONDUCT_PERFORMANCE_REVIEWS = 'conduct_performance_reviews',
  MANAGE_EXIT_PROCESS = 'manage_exit_process',
  
  // Payroll & Finance
  MANAGE_PAYROLL = 'manage_payroll',
  PROCESS_PAYROLL = 'process_payroll',
  MANAGE_SALARY_STRUCTURES = 'manage_salary_structures',
  VIEW_PAYROLL_REPORTS = 'view_payroll_reports',
  MANAGE_LEDGER = 'manage_ledger',
  MANAGE_ACCOUNTS_PAYABLE = 'manage_accounts_payable',
  MANAGE_ACCOUNTS_RECEIVABLE = 'manage_accounts_receivable',
  MANAGE_BUDGET = 'manage_budget',
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',
  MANAGE_EXPENSES = 'manage_expenses',
  APPROVE_EXPENSES = 'approve_expenses',
  MANAGE_VENDORS = 'manage_vendors',
  MANAGE_CUSTOMERS = 'manage_customers',
  PROCESS_PAYMENTS = 'process_payments',
  MANAGE_INVOICES = 'manage_invoices',
  MANAGE_BENEFITS = 'manage_benefits',
  PROCESS_REIMBURSEMENTS = 'process_reimbursements',
  
  // Time & Attendance
  APPROVE_LEAVES = 'approve_leaves',
  MANAGE_LEAVE_POLICIES = 'manage_leave_policies',
  VIEW_TEAM_ATTENDANCE = 'view_team_attendance',
  MANAGE_SHIFTS = 'manage_shifts',
  MANAGE_HOLIDAYS = 'manage_holidays',
  VIEW_TEAM_LEAVE_BALANCE = 'view_team_leave_balance',
  MANAGE_TEAM_SHIFTS = 'manage_team_shifts',
  
  // Team Management
  VIEW_TEAM_DATA = 'view_team_data',
  MANAGE_TEAM_PERFORMANCE = 'manage_team_performance',
  APPROVE_TEAM_EXPENSES = 'approve_team_expenses',
  VIEW_TEAM_EXPENSES = 'view_team_expenses',
  VIEW_TEAM_EMPLOYEES = 'view_team_employees',
  VIEW_TEAM_CALENDAR = 'view_team_calendar',
  
  // Reports & Analytics
  VIEW_ALL_REPORTS = 'view_all_reports',
  CREATE_CUSTOM_REPORTS = 'create_custom_reports',
  EXPORT_DATA = 'export_data',
  VIEW_HR_REPORTS = 'view_hr_reports',
  VIEW_RECRUITMENT_REPORTS = 'view_recruitment_reports',
  VIEW_ATTENDANCE_REPORTS = 'view_attendance_reports',
  EXPORT_HR_DATA = 'export_hr_data',
  CREATE_FINANCIAL_REPORTS = 'create_financial_reports',
  EXPORT_FINANCIAL_DATA = 'export_financial_data',
  VIEW_TEAM_REPORTS = 'view_team_reports',
  VIEW_TEAM_PERFORMANCE_REPORTS = 'view_team_performance_reports',
  
  // Communication
  SEND_ANNOUNCEMENTS = 'send_announcements',
  MANAGE_COMMUNICATIONS = 'manage_communications',
  
  // Employee Self-Service
  VIEW_OWN_DATA = 'view_own_data',
  APPLY_LEAVE = 'apply_leave',
  VIEW_PAYSLIPS = 'view_payslips',
  UPDATE_PROFILE = 'update_profile',
  SUBMIT_EXPENSES = 'submit_expenses',
  VIEW_OWN_ATTENDANCE = 'view_own_attendance',
  VIEW_OWN_PERFORMANCE = 'view_own_performance',
  ACCESS_TRAINING_MATERIALS = 'access_training_materials',
  VIEW_COMPANY_DIRECTORY = 'view_company_directory',
  VIEW_ANNOUNCEMENTS = 'view_announcements',
  PARTICIPATE_IN_SURVEYS = 'participate_in_surveys',
  
  // Limited Access Permissions
  VIEW_EMPLOYEE_BASIC_INFO = 'view_employee_basic_info',
  VIEW_SALARY_INFO = 'view_salary_info',
  
  // Legacy permissions for backward compatibility
  ADMIN_ACCESS = "admin_access",
  MANAGE_FINANCE = "manage_finance", 
  MANAGE_TEAM = "manage_team",
  EMPLOYEE_READ = "employee_read"
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
  imageUrl: string;
  role: UserRole;
  permissions: Permission[];
  organizationId?: string;
  publicMetadata?: {
    isApproved?: boolean;
    organizationId?: string;
    employeeId?: string;
    departmentId?: string;
    managerId?: string;
    joinDate?: string;
    [key: string]: any;
  };
}

// Enhanced role configuration
export interface RoleConfig {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  shortName: string;
  level: number; // Hierarchy level (1-5, where 1 is highest)
}

// Permission configuration for UI
export interface PermissionConfig {
  name: string;
  description: string;
  category: string;
  level: 'basic' | 'advanced' | 'critical';
  requiresApproval?: boolean;
}

// User session and context
export interface UserSession {
  userId: string;
  sessionId: string;
  loginTime: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
  isActive: boolean;
}

export interface UserContext {
  user: AuthUser;
  session: UserSession;
  organization?: {
    id: string;
    name: string;
    domain: string;
  };
  department?: {
    id: string;
    name: string;
  };
  manager?: {
    id: string;
    name: string;
    email: string;
  };
}

// Permission check results
export interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
  alternatives?: Permission[];
  requiredRole?: UserRole;
}

// Advanced permission checking
export interface PermissionRequest {
  userId: string;
  permission: Permission | Permission[];
  resource?: string;
  context?: Record<string, any>;
}

// Audit trail for permission changes
export interface PermissionAudit {
  id: string;
  userId: string;
  action: 'granted' | 'revoked' | 'checked';
  permission: Permission;
  resource?: string;
  timestamp: Date;
  adminId?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

// Role transition tracking
export interface RoleTransition {
  id: string;
  userId: string;
  fromRole: UserRole;
  toRole: UserRole;
  effectiveDate: Date;
  requestedBy: string;
  approvedBy?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  metadata?: Record<string, any>;
}

// Organization-specific role customization
export interface OrganizationRoleConfig {
  organizationId: string;
  role: UserRole;
  customPermissions: Permission[];
  removedPermissions: Permission[];
  description?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type guards
export function isValidUserRole(role: any): role is UserRole {
  return Object.values(UserRole).includes(role);
}

export function isValidPermission(permission: any): permission is Permission {
  return Object.values(Permission).includes(permission);
}

// Utility types
export type PermissionMap = Record<Permission, boolean>;
export type RoleHierarchy = Record<UserRole, UserRole[]>;
export type PermissionCategory = keyof typeof Permission;

// API response types
export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface PermissionCheckResponse {
  allowed: boolean;
  permissions: PermissionMap;
  metadata?: Record<string, any>;
}

// Hook return types
export interface UseAuthReturn {
  user: AuthUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  checkPermission: (permission: Permission) => boolean;
  checkPermissions: (permissions: Permission[], requireAll?: boolean) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  checkRole: (role: UserRole) => boolean;
  checkRoles: (roles: UserRole[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasRoles: (roles: UserRole[]) => boolean;
  isAdmin: boolean;
  isHRManager: boolean;
  isFinanceManager: boolean;
  isSupervisor: boolean;
  isEmployee: boolean;
  canManageUsers: boolean;
  canManageEmployees: boolean;
  canManageFinance: boolean;
  canViewReports: boolean;
  canApproveLeaves: boolean;
  canManagePayroll: boolean;
  canAccessRecruitment: boolean;
  userDisplayName: string;
  userInitials: string;
  userRoleDisplay: string;
  organizationContext: string | null;
}