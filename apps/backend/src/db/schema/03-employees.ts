// Import dependencies
import { pgTable, varchar, text, boolean, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Singapore-specific Enums (matching your current schema)
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const nationalityEnum = pgEnum('nationality', ['singapore', 'malaysia', 'china', 'india', 'others']);
export const maritalStatusEnum = pgEnum('marital_status', ['single', 'married', 'divorced', 'widowed']);
export const residentialStatusEnum = pgEnum('residential_status', ['citizen', 'pr', 'workpass', 'dependent']);
export const departmentEnum = pgEnum('department', ['hr', 'it', 'finance', 'marketing', 'operations', 'sales']);
export const employmentTypeEnum = pgEnum('employment_type', ['fulltime', 'parttime', 'contract', 'intern']);
export const paymentModeEnum = pgEnum('payment_mode', ['bank', 'cash', 'cheque']);
export const statusEnum = pgEnum('status', ['active', 'inactive', 'terminated', 'resigned']);

// Additional Enums for enhanced functionality
export const documentTypeEnum = pgEnum('document_type', ['nric', 'fin', 'passport', 'workpass', 'driving_license', 'degree_certificate', 'professional_certificate']);
export const educationLevelEnum = pgEnum('education_level', ['primary', 'secondary', 'diploma', 'bachelor', 'master', 'phd', 'professional']);
export const bankTypeEnum = pgEnum('bank_type', ['dbs', 'ocbc', 'uob', 'citibank', 'hsbc', 'maybank', 'others']);

// Employee Master Table (Updated to match your current structure)
export const employees = pgTable('employees', {
  // Primary Key (using your CUID approach)
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  
  // Foreign Keys (multi-tenant support)
  organizationId: varchar('organization_id', { length: 128 }), // Reference to organizations table
  userId: varchar('user_id', { length: 128 }), // Reference to users table for login access
  
  // Personal Information (Singapore-specific)
  fullName: varchar('full_name', { length: 100 }).notNull(),
  nricFinPassport: varchar('nric_fin_passport', { length: 50 }).notNull().unique(),
  dateOfBirth: varchar('date_of_birth', { length: 10 }).notNull(), // Format: YYYY-MM-DD
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
  emergencyRelationship: varchar('emergency_relationship', { length: 50 }),
  
  // Employment Information
  employeeId: varchar('employee_id', { length: 50 }).notNull().unique(), // Company employee ID
  department: departmentEnum('department').notNull(),
  position: varchar('position', { length: 100 }).notNull(),
  joinDate: varchar('join_date', { length: 10 }).notNull(), // Format: YYYY-MM-DD
  confirmationDate: varchar('confirmation_date', { length: 10 }), // After probation
  employmentType: employmentTypeEnum('employment_type').notNull(),
  reportingManager: varchar('reporting_manager', { length: 100 }),
  reportingManagerId: varchar('reporting_manager_id', { length: 128 }), // FK to employees.id
  locationId: varchar('location_id', { length: 128 }), // FK to locations table
  
  // Salary Information (Singapore-specific)
  basicSalary: decimal('basic_salary', { precision: 10, scale: 2 }).notNull(),
  paymentMode: paymentModeEnum('payment_mode').notNull(),
  bankName: varchar('bank_name', { length: 100 }),
  accountNumber: varchar('account_number', { length: 30 }),
  cpfNumber: varchar('cpf_number', { length: 15 }), // Singapore CPF
  taxNumber: varchar('tax_number', { length: 30 }), // Singapore tax reference
  
  // Work Pass Information (Singapore-specific)
  workPassType: varchar('work_pass_type', { length: 50 }), // EP, SP, WP, etc.
  workPassNumber: varchar('work_pass_number', { length: 50 }),
  workPassExpiry: varchar('work_pass_expiry', { length: 10 }), // Format: YYYY-MM-DD
  
  // Professional Information
  skills: text('skills'),
  certifications: text('certifications'),
  notes: text('notes'),
  probationPeriodMonths: decimal('probation_period_months', { precision: 3, scale: 1 }).default('6'),
  noticePeriodDays: decimal('notice_period_days', { precision: 3, scale: 0 }).default('30'),
  
  // Profile and Documents
  profilePictureUrl: varchar('profile_picture_url', { length: 500 }),
  
  // Status and Termination
  status: statusEnum('status').notNull().default('active'),
  isActive: boolean('is_active').notNull().default(true),
  terminationDate: varchar('termination_date', { length: 10 }),
  terminationReason: text('termination_reason'),
  
  // Audit Information
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: varchar('created_by', { length: 128 }), // FK to users.id
  updatedBy: varchar('updated_by', { length: 128 }), // FK to users.id
});

// Employee Documents (Enhanced for Singapore requirements)
export const employeeDocuments = pgTable('employee_documents', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  employeeId: varchar('employee_id', { length: 128 }).notNull(),
  documentType: documentTypeEnum('document_type').notNull(),
  documentName: varchar('document_name', { length: 255 }).notNull(),
  documentNumber: varchar('document_number', { length: 100 }),
  documentUrl: varchar('document_url', { length: 500 }).notNull(),
  fileSize: decimal('file_size', { precision: 10, scale: 0 }), // in bytes
  mimeType: varchar('mime_type', { length: 100 }),
  issueDate: varchar('issue_date', { length: 10 }), // Format: YYYY-MM-DD
  expiryDate: varchar('expiry_date', { length: 10 }), // Format: YYYY-MM-DD
  issuingAuthority: varchar('issuing_authority', { length: 255 }),
  isVerified: boolean('is_verified').default(false),
  verifiedBy: varchar('verified_by', { length: 128 }), // FK to users.id
  verifiedAt: timestamp('verified_at'),
  verificationNotes: text('verification_notes'),
  isActive: boolean('is_active').default(true),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  uploadedBy: varchar('uploaded_by', { length: 128 }), // FK to users.id
});

// Employee Education (Singapore education system)
export const employeeEducation = pgTable('employee_education', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  employeeId: varchar('employee_id', { length: 128 }).notNull(),
  educationLevel: educationLevelEnum('education_level').notNull(),
  degree: varchar('degree', { length: 255 }).notNull(),
  fieldOfStudy: varchar('field_of_study', { length: 255 }),
  institution: varchar('institution', { length: 255 }).notNull(),
  university: varchar('university', { length: 255 }),
  country: varchar('country', { length: 100 }).default('Singapore'),
  startYear: decimal('start_year', { precision: 4, scale: 0 }).notNull(),
  endYear: decimal('end_year', { precision: 4, scale: 0 }),
  grade: varchar('grade', { length: 50 }),
  percentage: decimal('percentage', { precision: 5, scale: 2 }),
  cgpa: decimal('cgpa', { precision: 3, scale: 2 }),
  isHighestQualification: boolean('is_highest_qualification').default(false),
  certificateUrl: varchar('certificate_url', { length: 500 }),
  isVerified: boolean('is_verified').default(false),
  verifiedBy: varchar('verified_by', { length: 128 }), // FK to users.id
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: varchar('created_by', { length: 128 }), // FK to users.id
});

// Employee Experience (Previous work history)
export const employeeExperience = pgTable('employee_experience', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  employeeId: varchar('employee_id', { length: 128 }).notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  designation: varchar('designation', { length: 255 }).notNull(),
  department: varchar('department', { length: 255 }),
  industry: varchar('industry', { length: 100 }),
  location: varchar('location', { length: 255 }),
  startDate: varchar('start_date', { length: 10 }).notNull(), // Format: YYYY-MM-DD
  endDate: varchar('end_date', { length: 10 }), // Format: YYYY-MM-DD
  isCurrent: boolean('is_current').default(false),
  description: text('description'),
  keyAchievements: text('key_achievements'),
  skills: text('skills'),
  lastSalary: decimal('last_salary', { precision: 15, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('SGD'),
  reasonForLeaving: text('reason_for_leaving'),
  supervisorName: varchar('supervisor_name', { length: 200 }),
  supervisorContact: varchar('supervisor_contact', { length: 20 }),
  supervisorEmail: varchar('supervisor_email', { length: 320 }),
  isReferenceable: boolean('is_referenceable').default(true),
  verificationStatus: varchar('verification_status', { length: 50 }).default('pending'), // 'pending', 'verified', 'failed'
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: varchar('created_by', { length: 128 }), // FK to users.id
});

// Employee Bank Accounts (Singapore banking)
export const employeeBankAccounts = pgTable('employee_bank_accounts', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  employeeId: varchar('employee_id', { length: 128 }).notNull(),
  bankName: varchar('bank_name', { length: 100 }).notNull(),
  bankCode: varchar('bank_code', { length: 10 }), // Singapore bank codes
  branchName: varchar('branch_name', { length: 255 }),
  branchCode: varchar('branch_code', { length: 10 }),
  accountNumber: varchar('account_number', { length: 50 }).notNull(),
  accountType: varchar('account_type', { length: 50 }).notNull().default('savings'), // 'savings', 'current'
  accountHolderName: varchar('account_holder_name', { length: 255 }).notNull(),
  swiftCode: varchar('swift_code', { length: 11 }), // For international transfers
  isPrimary: boolean('is_primary').default(false),
  isActive: boolean('is_active').default(true),
  isVerified: boolean('is_verified').default(false),
  verifiedBy: varchar('verified_by', { length: 128 }), // FK to users.id
  verifiedAt: timestamp('verified_at'),
  bankStatementUrl: varchar('bank_statement_url', { length: 500 }), // For verification
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: varchar('created_by', { length: 128 }), // FK to users.id
});

// Employee Emergency Contacts (Additional contacts beyond primary)
export const employeeEmergencyContacts = pgTable('employee_emergency_contacts', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  employeeId: varchar('employee_id', { length: 128 }).notNull(),
  contactName: varchar('contact_name', { length: 200 }).notNull(),
  relationship: varchar('relationship', { length: 50 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }).notNull(),
  contactEmail: varchar('contact_email', { length: 320 }),
  address: text('address'),
  isPrimary: boolean('is_primary').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: varchar('created_by', { length: 128 }), // FK to users.id
});

// Employee Family Information (For benefits and emergency purposes)
export const employeeFamily = pgTable('employee_family', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  employeeId: varchar('employee_id', { length: 128 }).notNull(),
  memberName: varchar('member_name', { length: 200 }).notNull(),
  relationship: varchar('relationship', { length: 50 }).notNull(), // 'spouse', 'child', 'parent', 'sibling'
  dateOfBirth: varchar('date_of_birth', { length: 10 }), // Format: YYYY-MM-DD
  gender: genderEnum('gender'),
  nricFinPassport: varchar('nric_fin_passport', { length: 50 }),
  isDependent: boolean('is_dependent').default(false),
  isEmergencyContact: boolean('is_emergency_contact').default(false),
  contactPhone: varchar('contact_phone', { length: 20 }),
  medicalConditions: text('medical_conditions'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: varchar('created_by', { length: 128 }), // FK to users.id
});

// Type exports for TypeScript
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type EmployeeDocument = typeof employeeDocuments.$inferSelect;
export type NewEmployeeDocument = typeof employeeDocuments.$inferInsert;
export type EmployeeEducation = typeof employeeEducation.$inferSelect;
export type NewEmployeeEducation = typeof employeeEducation.$inferInsert;
export type EmployeeExperience = typeof employeeExperience.$inferSelect;
export type NewEmployeeExperience = typeof employeeExperience.$inferInsert;
export type EmployeeBankAccount = typeof employeeBankAccounts.$inferSelect;
export type NewEmployeeBankAccount = typeof employeeBankAccounts.$inferInsert;
export type EmployeeEmergencyContact = typeof employeeEmergencyContacts.$inferSelect;
export type NewEmployeeEmergencyContact = typeof employeeEmergencyContacts.$inferInsert;
export type EmployeeFamily = typeof employeeFamily.$inferSelect;
export type NewEmployeeFamily = typeof employeeFamily.$inferInsert;