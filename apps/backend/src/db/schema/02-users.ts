import { boolean, date, integer, json, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizations } from "./01-organization";


// User Master
export const users = pgTable('users', {
  userId: uuid('user_id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.organizationId).notNull(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  status: varchar('status', { length: 20 }).default('ACTIVE'), // 'ACTIVE', 'INACTIVE', 'SUSPENDED'
  emailVerified: boolean('email_verified').default(false),
  phoneVerified: boolean('phone_verified').default(false),
  lastLoginAt: timestamp('last_login_at'),
  passwordChangedAt: timestamp('password_changed_at'),
  failedLoginAttempts: integer('failed_login_attempts').default(0),
  accountLockedUntil: timestamp('account_locked_until'),
  preferredLanguage: varchar('preferred_language', { length: 10 }).default('en'),
  timezone: varchar('timezone', { length: 50 }).default('Asia/Kolkata'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Role Master
export const roles = pgTable('roles', {
  roleId: uuid('role_id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.organizationId),
  roleName: varchar('role_name', { length: 100 }).notNull(),
  roleCode: varchar('role_code', { length: 50 }).notNull(),
  description: text('description'),
  isSystemRole: boolean('is_system_role').default(false),
  permissions: json('permissions').$type<string[]>(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// User Role Assignment
export const userRoles = pgTable('user_roles', {
  userRoleId: uuid('user_role_id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.userId).notNull(),
  roleId: uuid('role_id').references(() => roles.roleId).notNull(),
  assignedBy: uuid('assigned_by').references(() => users.userId).notNull(),
  assignedAt: timestamp('assigned_at').defaultNow(),
  validFrom: date('valid_from').notNull(),
  validTo: date('valid_to'),
  isActive: boolean('is_active').default(true)
});

// Permission Master
export const permissions = pgTable('permissions', {
  permissionId: uuid('permission_id').primaryKey().defaultRandom(),
  permissionName: varchar('permission_name', { length: 100 }).notNull(),
  permissionCode: varchar('permission_code', { length: 50 }).notNull().unique(),
  moduleName: varchar('module_name', { length: 100 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true)
});

// User Sessions
export const userSessions = pgTable('user_sessions', {
  sessionId: uuid('session_id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.userId).notNull(),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  userAgent: text('user_agent'),
  deviceFingerprint: varchar('device_fingerprint', { length: 255 }),
  loginAt: timestamp('login_at').defaultNow(),
  lastActivityAt: timestamp('last_activity_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  logoutAt: timestamp('logout_at'),
  logoutReason: varchar('logout_reason', { length: 50 }),
  isActive: boolean('is_active').default(true)
});

// Audit Log
export const auditLog = pgTable('audit_log', {
  auditId: uuid('audit_id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.organizationId).notNull(),
  userId: uuid('user_id').references(() => users.userId),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: varchar('entity_id', { length: 255 }),
  oldValues: json('old_values'),
  newValues: json('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow()
});