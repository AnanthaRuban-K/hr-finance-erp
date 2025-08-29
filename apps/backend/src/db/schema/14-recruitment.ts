import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
  json,
  pgEnum,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';

// Import existing schemas (update import paths as needed)
import { organizations, departments, designations } from './01-organization';
import { employees } from './03-employees';

// Enums
export const jobStatusEnum = pgEnum('job_status', [
  'draft', 'active', 'paused', 'closed', 'cancelled'
]);

export const employmentTypeEnum = pgEnum('employment_type', [
  'permanent', 'contract', 'temporary', 'internship', 'freelance'
]);

export const workArrangementEnum = pgEnum('work_arrangement', [
  'office', 'remote', 'hybrid'
]);

export const applicationStatusEnum = pgEnum('application_status', [
  'received', 'screening', 'shortlisted', 'interview_scheduled',
  'interviewed', 'technical_test', 'reference_check', 'offer_extended',
  'offer_accepted', 'offer_declined', 'rejected', 'withdrawn', 'on_hold'
]);

export const applicationSourceEnum = pgEnum('application_source', [
  'company_website', 'linkedin', 'jobstreet', 'indeed', 'glassdoor',
  'referral', 'recruitment_agency', 'job_fair', 'social_media',
  'direct_application', 'other'
]);

// Job Postings Table
export const jobPostings = pgTable('job_postings', {
  jobPostingId: uuid('job_posting_id').primaryKey().defaultRandom(),
  jobCode: varchar('job_code', { length: 50 }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.organizationId, { onDelete: 'cascade' }).notNull(),
  
  // Job details
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  departmentId: uuid('department_id').references(() => departments.departmentId, { onDelete: 'set null' }),
  designationId: uuid('designation_id').references(() => designations.designationId, { onDelete: 'set null' }),
  reportingManagerId: varchar('reporting_manager_id', { length: 128 }).references(() => employees.id, { onDelete: 'set null' }), // FIXED: Changed to varchar
  
  jobDescription: text('job_description').notNull(),
  keyResponsibilities: json('key_responsibilities').$type<string[]>(),
  requiredSkills: json('required_skills').$type<string[]>(),
  preferredSkills: json('preferred_skills').$type<string[]>(),
  qualifications: json('qualifications').$type<string[]>(),
  
  // Employment details
  employmentType: employmentTypeEnum('employment_type').notNull().default('permanent'),
  workArrangement: workArrangementEnum('work_arrangement').notNull().default('office'),
  numberOfVacancies: integer('number_of_vacancies').notNull().default(1),
  
  // Salary
  minSalary: decimal('min_salary', { precision: 12, scale: 2 }),
  maxSalary: decimal('max_salary', { precision: 12, scale: 2 }),
  currency: varchar('currency', { length: 3 }).notNull().default('SGD'),
  
  // Experience
  minExperience: integer('min_experience'), // in months
  maxExperience: integer('max_experience'), // in months
  educationLevel: varchar('education_level', { length: 100 }),
  
  // Application settings
  applicationDeadline: date('application_deadline'),
  allowCoverLetter: boolean('allow_cover_letter').default(true),
  requireCoverLetter: boolean('require_cover_letter').default(false),
  
  // Status
  status: jobStatusEnum('status').notNull().default('draft'),
  isPublished: boolean('is_published').default(false),
  publishedDate: timestamp('published_date'),
  
  // Analytics
  totalViews: integer('total_views').default(0),
  totalApplications: integer('total_applications').default(0),
  
  // Audit
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 128 }).references(() => employees.id, { onDelete: 'set null' }), // FIXED: Changed to varchar
  updatedBy: varchar('updated_by', { length: 128 }).references(() => employees.id, { onDelete: 'set null' })  // FIXED: Changed to varchar
}, (table) => ({
  orgJobCodeIdx: uniqueIndex('job_postings_org_code_idx').on(table.organizationId, table.jobCode),
  statusIdx: index('job_postings_status_idx').on(table.status),
  publishedIdx: index('job_postings_published_idx').on(table.isPublished),
  departmentIdx: index('job_postings_department_idx').on(table.departmentId)
}));

// Job Applications Table
export const jobApplications = pgTable('job_applications', {
  applicationId: uuid('application_id').primaryKey().defaultRandom(),
  applicationCode: varchar('application_code', { length: 50 }).notNull(),
  jobPostingId: uuid('job_posting_id').references(() => jobPostings.jobPostingId, { onDelete: 'cascade' }).notNull(),
  
  // Candidate info
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  
  // Employment details
  currentSalary: decimal('current_salary', { precision: 12, scale: 2 }),
  expectedSalary: decimal('expected_salary', { precision: 12, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('SGD'),
  noticePeriod: integer('notice_period'), // in days
  
  // Experience
  totalExperience: integer('total_experience'), // in months
  currentJobTitle: varchar('current_job_title', { length: 255 }),
  currentCompany: varchar('current_company', { length: 255 }),
  
  // Documents
  resumeUrl: varchar('resume_url', { length: 500 }),
  resumeFileName: varchar('resume_file_name', { length: 255 }),
  coverLetter: text('cover_letter'),
  
  // Application tracking
  applicationSource: applicationSourceEnum('application_source').notNull().default('company_website'),
  status: applicationStatusEnum('status').notNull().default('received'),
  
  // AI screening
  aiScreeningScore: decimal('ai_screening_score', { precision: 3, scale: 2 }),
  aiScreeningNotes: text('ai_screening_notes'),
  skillsMatchPercentage: integer('skills_match_percentage'),
  
  // Audit
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  lastStatusUpdate: timestamp('last_status_update').defaultNow().notNull(),
  updatedBy: varchar('updated_by', { length: 128 }).references(() => employees.id, { onDelete: 'set null' }) // FIXED: Changed to varchar
}, (table) => ({
  applicationCodeIdx: uniqueIndex('job_applications_code_idx').on(table.applicationCode),
  jobPostingIdx: index('job_applications_job_posting_idx').on(table.jobPostingId),
  statusIdx: index('job_applications_status_idx').on(table.status),
  emailIdx: index('job_applications_email_idx').on(table.email)
}));

// Export types
export type JobPosting = typeof jobPostings.$inferSelect;
export type NewJobPosting = typeof jobPostings.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;