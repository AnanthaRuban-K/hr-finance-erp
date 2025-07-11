// src/db/schema.ts
import { pgTable, varchar, text, boolean, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Enums matching your frontend
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const nationalityEnum = pgEnum('nationality', ['singapore', 'malaysia', 'china', 'india', 'others']);
export const maritalStatusEnum = pgEnum('marital_status', ['single', 'married', 'divorced', 'widowed']);
export const residentialStatusEnum = pgEnum('residential_status', ['citizen', 'pr', 'workpass', 'dependent']);
export const departmentEnum = pgEnum('department', ['hr', 'it', 'finance', 'marketing', 'operations', 'sales']);
export const employmentTypeEnum = pgEnum('employment_type', ['fulltime', 'parttime', 'contract', 'intern']);
export const paymentModeEnum = pgEnum('payment_mode', ['bank', 'cash', 'cheque']);
export const statusEnum = pgEnum('status', ['active', 'inactive', 'terminated', 'resigned']);

export const employees = pgTable('employees', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  
  // Personal Information
  fullName: varchar('full_name', { length: 100 }).notNull(),
  nricFinPassport: varchar('nric_fin_passport', { length: 50 }).notNull().unique(),
  dateOfBirth: varchar('date_of_birth', { length: 10 }).notNull(),
  gender: genderEnum('gender').notNull(),
  nationality: nationalityEnum('nationality').notNull(),
  maritalStatus: maritalStatusEnum('marital_status').notNull(),
  residentialStatus: residentialStatusEnum('residential_status').notNull(),
  race: varchar('race', { length: 50 }),
  religion: varchar('religion', { length: 50 }),
  
  // Contact Information
  email: varchar('email', { length: 100 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 50 }),
  postalCode: varchar('postal_code', { length: 10 }),
  emergencyContact: varchar('emergency_contact', { length: 100 }).notNull(),
  emergencyPhone: varchar('emergency_phone', { length: 20 }).notNull(),
  
  // Employment Information
  employeeId: varchar('employee_id', { length: 50 }).notNull().unique(),
  department: departmentEnum('department').notNull(),
  position: varchar('position', { length: 100 }).notNull(),
  joinDate: varchar('join_date', { length: 10 }).notNull(),
  employmentType: employmentTypeEnum('employment_type').notNull(),
  reportingManager: varchar('reporting_manager', { length: 100 }),
  
  // Salary Information
  basicSalary: decimal('basic_salary', { precision: 10, scale: 2 }).notNull(),
  paymentMode: paymentModeEnum('payment_mode').notNull(),
  bankName: varchar('bank_name', { length: 100 }),
  accountNumber: varchar('account_number', { length: 30 }),
  cpfNumber: varchar('cpf_number', { length: 15 }),
  taxNumber: varchar('tax_number', { length: 30 }),
  
  // Additional Information
  skills: text('skills'),
  certifications: text('certifications'),
  notes: text('notes'),
  
  // Status
  status: statusEnum('status').notNull().default('active'),
  isActive: boolean('is_active').notNull().default(true),
  terminationDate: varchar('termination_date', { length: 10 }),
  terminationReason: text('termination_reason'),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;