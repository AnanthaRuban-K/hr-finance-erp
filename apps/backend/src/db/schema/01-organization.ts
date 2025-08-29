import { boolean, date, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { tenants } from "./00-master";

// Organization Master
export const organizations = pgTable('organizations', {
  organizationId: uuid('organization_id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.tenantId).notNull(),
  organizationName: varchar('organization_name', { length: 255 }).notNull(),
  legalName: varchar('legal_name', { length: 255 }).notNull(),
  organizationCode: varchar('organization_code', { length: 50 }).notNull(),
  registrationNumber: varchar('registration_number', { length: 100 }),
  panNumber: varchar('pan_number', { length: 10 }),
  gstinNumber: varchar('gstin_number', { length: 15 }),
  tanNumber: varchar('tan_number', { length: 10 }),
  industryType: varchar('industry_type', { length: 100 }),
  businessNature: text('business_nature'),
  incorporationDate: date('incorporation_date'),
  financialYearStart: date('financial_year_start').notNull(),
  financialYearEnd: date('financial_year_end').notNull(),
  currencyCode: varchar('currency_code', { length: 3 }).default('INR'),
  timezone: varchar('timezone', { length: 50 }).default('Asia/Kolkata'),
  logoUrl: varchar('logo_url', { length: 500 }),
  websiteUrl: varchar('website_url', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 320 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Address Management
export const organizationAddresses = pgTable('organization_addresses', {
  addressId: uuid('address_id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.organizationId).notNull(),
  addressType: varchar('address_type', { length: 50 }).notNull(), // 'REGISTERED', 'BILLING', 'SHIPPING'
  addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line_2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// Department Structure - Fixed circular reference
export const departments = pgTable('departments', {
  departmentId: uuid('department_id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.organizationId).notNull(),
  // Fix: Use string UUID instead of direct self-reference to avoid circular dependency
  parentDepartmentId: uuid('parent_department_id'), // Remove .references() to avoid circular reference
  departmentName: varchar('department_name', { length: 255 }).notNull(),
  departmentCode: varchar('department_code', { length: 50 }).notNull(),
  description: text('description'),
  managerId: uuid('manager_id'), // References employees.employeeId
  costCenterId: uuid('cost_center_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Designation/Position Master
export const designations = pgTable('designations', {
  designationId: uuid('designation_id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.organizationId).notNull(),
  designationName: varchar('designation_name', { length: 255 }).notNull(),
  designationCode: varchar('designation_code', { length: 50 }).notNull(),
  level: integer('level').default(1),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// Location/Branch Master
export const locations = pgTable('locations', {
  locationId: uuid('location_id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.organizationId).notNull(),
  locationName: varchar('location_name', { length: 255 }).notNull(),
  locationCode: varchar('location_code', { length: 50 }).notNull(),
  locationType: varchar('location_type', { length: 50 }).notNull(), // 'HEAD_OFFICE', 'BRANCH', 'WAREHOUSE'
  addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line_2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }),
  managerId: uuid('manager_id'), // References employees.employeeId
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// Add relations after table definitions to handle the self-reference properly
// This approach allows you to define foreign key constraints at the database level
// while avoiding TypeScript circular reference issues

// Alternative approach using relations (if you're using drizzle relations)
/*
import { relations } from 'drizzle-orm';

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  parentDepartment: one(departments, {
    fields: [departments.parentDepartmentId],
    references: [departments.departmentId],
  }),
  childDepartments: many(departments),
  organization: one(organizations, {
    fields: [departments.organizationId],
    references: [organizations.organizationId],
  }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  departments: many(departments),
  addresses: many(organizationAddresses),
  designations: many(designations),
  locations: many(locations),
}));
*/

// Type exports for TypeScript
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type OrganizationAddress = typeof organizationAddresses.$inferSelect;
export type NewOrganizationAddress = typeof organizationAddresses.$inferInsert;
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
export type Designation = typeof designations.$inferSelect;
export type NewDesignation = typeof designations.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;