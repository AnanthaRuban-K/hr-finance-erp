import { pgTable, uuid, varchar, text, date, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { departments } from './departments'
import { positions } from './positions'

export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: varchar('employee_id', { length: 20 }).notNull().unique(),
  clerkId: varchar('clerk_id', { length: 255 }).unique(), // Link to Clerk user
  
  // Personal Information
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  alternatePhone: varchar('alternate_phone', { length: 20 }),
  
  // Address Information
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),
  country: varchar('country', { length: 100 }).default('India'),
  
  // Professional Information
  departmentId: uuid('department_id').references(() => departments.id),
  positionId: uuid('position_id').references(() => positions.id),
  managerId: uuid('manager_id'), // Self-reference, will add constraint later
  joiningDate: date('joining_date').notNull(),
  probationEndDate: date('probation_end_date'),
  
  // Employment Details
  employmentType: varchar('employment_type', { length: 50 }).default('full_time'), 
  workLocation: varchar('work_location', { length: 100 }),
  shift: varchar('shift', { length: 50 }).default('day'),
  
  // Salary Information
  basicSalary: integer('basic_salary'),
  currency: varchar('currency', { length: 10 }).default('INR'),
  
  // Personal Details
  dateOfBirth: date('date_of_birth'),
  gender: varchar('gender', { length: 20 }),
  maritalStatus: varchar('marital_status', { length: 20 }),
  bloodGroup: varchar('blood_group', { length: 5 }),
  
  // Emergency Contact
  emergencyContactName: varchar('emergency_contact_name', { length: 100 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 20 }),
  emergencyContactRelation: varchar('emergency_contact_relation', { length: 50 }),
  
  // Documents
  aadharNumber: varchar('aadhar_number', { length: 20 }),
  panNumber: varchar('pan_number', { length: 20 }),
  passportNumber: varchar('passport_number', { length: 20 }),
  
  // System Fields
  status: varchar('status', { length: 20 }).default('active'), // active, inactive, terminated
  profilePicture: text('profile_picture'),
  notes: text('notes'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: uuid('created_by'), // Will reference employees.id
  updatedBy: uuid('updated_by')  // Will reference employees.id
})

export const employeeDocuments = pgTable('employee_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  documentType: varchar('document_type', { length: 50 }).notNull(), 
  documentName: varchar('document_name', { length: 255 }).notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  uploadedBy: uuid('uploaded_by').references(() => employees.id)
})

export type Employee = typeof employees.$inferSelect
export type NewEmployee = typeof employees.$inferInsert
export type EmployeeDocument = typeof employeeDocuments.$inferSelect
export type NewEmployeeDocument = typeof employeeDocuments.$inferInsert