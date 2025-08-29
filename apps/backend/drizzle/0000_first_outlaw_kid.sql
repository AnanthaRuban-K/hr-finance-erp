DO $$ BEGIN
 CREATE TYPE "bank_type" AS ENUM('dbs', 'ocbc', 'uob', 'citibank', 'hsbc', 'maybank', 'others');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "department" AS ENUM('hr', 'it', 'finance', 'marketing', 'operations', 'sales');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "document_type" AS ENUM('nric', 'fin', 'passport', 'workpass', 'driving_license', 'degree_certificate', 'professional_certificate');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "education_level" AS ENUM('primary', 'secondary', 'diploma', 'bachelor', 'master', 'phd', 'professional');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "employment_type" AS ENUM('permanent', 'contract', 'temporary', 'internship', 'freelance');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "gender" AS ENUM('male', 'female', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "marital_status" AS ENUM('single', 'married', 'divorced', 'widowed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "nationality" AS ENUM('singapore', 'malaysia', 'china', 'india', 'others');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "payment_mode" AS ENUM('bank', 'cash', 'cheque');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "residential_status" AS ENUM('citizen', 'pr', 'workpass', 'dependent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('active', 'inactive', 'terminated', 'resigned');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "application_source" AS ENUM('company_website', 'linkedin', 'jobstreet', 'indeed', 'glassdoor', 'referral', 'recruitment_agency', 'job_fair', 'social_media', 'direct_application', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "application_status" AS ENUM('received', 'screening', 'shortlisted', 'interview_scheduled', 'interviewed', 'technical_test', 'reference_check', 'offer_extended', 'offer_accepted', 'offer_declined', 'rejected', 'withdrawn', 'on_hold');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "job_status" AS ENUM('draft', 'active', 'paused', 'closed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "work_arrangement" AS ENUM('office', 'remote', 'hybrid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenant_configurations" (
	"config_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"config_key" varchar(100) NOT NULL,
	"config_value" text,
	"config_type" varchar(50) DEFAULT 'string',
	"is_encrypted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenants" (
	"tenant_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_name" varchar(255) NOT NULL,
	"tenant_code" varchar(50) NOT NULL,
	"subscription_plan" varchar(50) DEFAULT 'basic',
	"subscription_status" varchar(20) DEFAULT 'active',
	"max_users" integer DEFAULT 10,
	"max_employees" integer DEFAULT 50,
	"features" json,
	"database_url" varchar(500),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tenants_tenant_code_unique" UNIQUE("tenant_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "departments" (
	"department_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"parent_department_id" uuid,
	"department_name" varchar(255) NOT NULL,
	"department_code" varchar(50) NOT NULL,
	"description" text,
	"manager_id" uuid,
	"cost_center_id" uuid,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "designations" (
	"designation_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"designation_name" varchar(255) NOT NULL,
	"designation_code" varchar(50) NOT NULL,
	"level" integer DEFAULT 1,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "locations" (
	"location_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"location_name" varchar(255) NOT NULL,
	"location_code" varchar(50) NOT NULL,
	"location_type" varchar(50) NOT NULL,
	"address_line_1" varchar(255) NOT NULL,
	"address_line_2" varchar(255),
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(100) NOT NULL,
	"contact_phone" varchar(20),
	"manager_id" uuid,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_addresses" (
	"address_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"address_type" varchar(50) NOT NULL,
	"address_line_1" varchar(255) NOT NULL,
	"address_line_2" varchar(255),
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(100) NOT NULL,
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"organization_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"organization_name" varchar(255) NOT NULL,
	"legal_name" varchar(255) NOT NULL,
	"organization_code" varchar(50) NOT NULL,
	"registration_number" varchar(100),
	"pan_number" varchar(10),
	"gstin_number" varchar(15),
	"tan_number" varchar(10),
	"industry_type" varchar(100),
	"business_nature" text,
	"incorporation_date" date,
	"financial_year_start" date NOT NULL,
	"financial_year_end" date NOT NULL,
	"currency_code" varchar(3) DEFAULT 'INR',
	"timezone" varchar(50) DEFAULT 'Asia/Kolkata',
	"logo_url" varchar(500),
	"website_url" varchar(255),
	"contact_email" varchar(320),
	"contact_phone" varchar(20),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_log" (
	"audit_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" varchar(255),
	"old_values" json,
	"new_values" json,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"permission_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"permission_name" varchar(100) NOT NULL,
	"permission_code" varchar(50) NOT NULL,
	"module_name" varchar(100) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "permissions_permission_code_unique" UNIQUE("permission_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"role_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"role_name" varchar(100) NOT NULL,
	"role_code" varchar(50) NOT NULL,
	"description" text,
	"is_system_role" boolean DEFAULT false,
	"permissions" json,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"user_role_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assigned_by" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now(),
	"valid_from" date NOT NULL,
	"valid_to" date,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_sessions" (
	"session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_token" varchar(255) NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"user_agent" text,
	"device_fingerprint" varchar(255),
	"login_at" timestamp DEFAULT now(),
	"last_activity_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL,
	"logout_at" timestamp,
	"logout_reason" varchar(50),
	"is_active" boolean DEFAULT true,
	CONSTRAINT "user_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(320) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone_number" varchar(20),
	"avatar_url" varchar(500),
	"status" varchar(20) DEFAULT 'ACTIVE',
	"email_verified" boolean DEFAULT false,
	"phone_verified" boolean DEFAULT false,
	"last_login_at" timestamp,
	"password_changed_at" timestamp,
	"failed_login_attempts" integer DEFAULT 0,
	"account_locked_until" timestamp,
	"preferred_language" varchar(10) DEFAULT 'en',
	"timezone" varchar(50) DEFAULT 'Asia/Kolkata',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_bank_accounts" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"employee_id" varchar(128) NOT NULL,
	"bank_name" varchar(100) NOT NULL,
	"bank_code" varchar(10),
	"branch_name" varchar(255),
	"branch_code" varchar(10),
	"account_number" varchar(50) NOT NULL,
	"account_type" varchar(50) DEFAULT 'savings' NOT NULL,
	"account_holder_name" varchar(255) NOT NULL,
	"swift_code" varchar(11),
	"is_primary" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"verified_by" varchar(128),
	"verified_at" timestamp,
	"bank_statement_url" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"created_by" varchar(128)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_documents" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"employee_id" varchar(128) NOT NULL,
	"document_type" "document_type" NOT NULL,
	"document_name" varchar(255) NOT NULL,
	"document_number" varchar(100),
	"document_url" varchar(500) NOT NULL,
	"file_size" numeric(10, 0),
	"mime_type" varchar(100),
	"issue_date" varchar(10),
	"expiry_date" varchar(10),
	"issuing_authority" varchar(255),
	"is_verified" boolean DEFAULT false,
	"verified_by" varchar(128),
	"verified_at" timestamp,
	"verification_notes" text,
	"is_active" boolean DEFAULT true,
	"uploaded_at" timestamp DEFAULT now(),
	"uploaded_by" varchar(128)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_education" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"employee_id" varchar(128) NOT NULL,
	"education_level" "education_level" NOT NULL,
	"degree" varchar(255) NOT NULL,
	"field_of_study" varchar(255),
	"institution" varchar(255) NOT NULL,
	"university" varchar(255),
	"country" varchar(100) DEFAULT 'Singapore',
	"start_year" numeric(4, 0) NOT NULL,
	"end_year" numeric(4, 0),
	"grade" varchar(50),
	"percentage" numeric(5, 2),
	"cgpa" numeric(3, 2),
	"is_highest_qualification" boolean DEFAULT false,
	"certificate_url" varchar(500),
	"is_verified" boolean DEFAULT false,
	"verified_by" varchar(128),
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"created_by" varchar(128)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_emergency_contacts" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"employee_id" varchar(128) NOT NULL,
	"contact_name" varchar(200) NOT NULL,
	"relationship" varchar(50) NOT NULL,
	"contact_phone" varchar(20) NOT NULL,
	"contact_email" varchar(320),
	"address" text,
	"is_primary" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"created_by" varchar(128)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_experience" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"employee_id" varchar(128) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"designation" varchar(255) NOT NULL,
	"department" varchar(255),
	"industry" varchar(100),
	"location" varchar(255),
	"start_date" varchar(10) NOT NULL,
	"end_date" varchar(10),
	"is_current" boolean DEFAULT false,
	"description" text,
	"key_achievements" text,
	"skills" text,
	"last_salary" numeric(15, 2),
	"currency" varchar(3) DEFAULT 'SGD',
	"reason_for_leaving" text,
	"supervisor_name" varchar(200),
	"supervisor_contact" varchar(20),
	"supervisor_email" varchar(320),
	"is_referenceable" boolean DEFAULT true,
	"verification_status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"created_by" varchar(128)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_family" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"employee_id" varchar(128) NOT NULL,
	"member_name" varchar(200) NOT NULL,
	"relationship" varchar(50) NOT NULL,
	"date_of_birth" varchar(10),
	"gender" "gender",
	"nric_fin_passport" varchar(50),
	"is_dependent" boolean DEFAULT false,
	"is_emergency_contact" boolean DEFAULT false,
	"contact_phone" varchar(20),
	"medical_conditions" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"created_by" varchar(128)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"organization_id" varchar(128),
	"user_id" varchar(128),
	"full_name" varchar(100) NOT NULL,
	"nric_fin_passport" varchar(50) NOT NULL,
	"date_of_birth" varchar(10) NOT NULL,
	"gender" "gender" NOT NULL,
	"nationality" "nationality" NOT NULL,
	"marital_status" "marital_status" NOT NULL,
	"residential_status" "residential_status" NOT NULL,
	"race" varchar(50),
	"religion" varchar(50),
	"email" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(50),
	"postal_code" varchar(10),
	"emergency_contact" varchar(100) NOT NULL,
	"emergency_phone" varchar(20) NOT NULL,
	"emergency_relationship" varchar(50),
	"employee_id" varchar(50) NOT NULL,
	"department" "department" NOT NULL,
	"position" varchar(100) NOT NULL,
	"join_date" varchar(10) NOT NULL,
	"confirmation_date" varchar(10),
	"employment_type" "employment_type" NOT NULL,
	"reporting_manager" varchar(100),
	"reporting_manager_id" varchar(128),
	"location_id" varchar(128),
	"basic_salary" numeric(10, 2) NOT NULL,
	"payment_mode" "payment_mode" NOT NULL,
	"bank_name" varchar(100),
	"account_number" varchar(30),
	"cpf_number" varchar(15),
	"tax_number" varchar(30),
	"work_pass_type" varchar(50),
	"work_pass_number" varchar(50),
	"work_pass_expiry" varchar(10),
	"skills" text,
	"certifications" text,
	"notes" text,
	"probation_period_months" numeric(3, 1) DEFAULT '6',
	"notice_period_days" numeric(3, 0) DEFAULT '30',
	"profile_picture_url" varchar(500),
	"status" "status" DEFAULT 'active' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"termination_date" varchar(10),
	"termination_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(128),
	"updated_by" varchar(128),
	CONSTRAINT "employees_nric_fin_passport_unique" UNIQUE("nric_fin_passport"),
	CONSTRAINT "employees_email_unique" UNIQUE("email"),
	CONSTRAINT "employees_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_applications" (
	"application_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_code" varchar(50) NOT NULL,
	"job_posting_id" uuid NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"current_salary" numeric(12, 2),
	"expected_salary" numeric(12, 2),
	"currency" varchar(3) DEFAULT 'SGD',
	"notice_period" integer,
	"total_experience" integer,
	"current_job_title" varchar(255),
	"current_company" varchar(255),
	"resume_url" varchar(500),
	"resume_file_name" varchar(255),
	"cover_letter" text,
	"application_source" "application_source" DEFAULT 'company_website' NOT NULL,
	"status" "application_status" DEFAULT 'received' NOT NULL,
	"ai_screening_score" numeric(3, 2),
	"ai_screening_notes" text,
	"skills_match_percentage" integer,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"last_status_update" timestamp DEFAULT now() NOT NULL,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_postings" (
	"job_posting_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_code" varchar(50) NOT NULL,
	"organization_id" uuid NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"department_id" uuid,
	"designation_id" uuid,
	"reporting_manager_id" uuid,
	"job_description" text NOT NULL,
	"key_responsibilities" json,
	"required_skills" json,
	"preferred_skills" json,
	"qualifications" json,
	"employment_type" "employment_type" DEFAULT 'permanent' NOT NULL,
	"work_arrangement" "work_arrangement" DEFAULT 'office' NOT NULL,
	"number_of_vacancies" integer DEFAULT 1 NOT NULL,
	"min_salary" numeric(12, 2),
	"max_salary" numeric(12, 2),
	"currency" varchar(3) DEFAULT 'SGD' NOT NULL,
	"min_experience" integer,
	"max_experience" integer,
	"education_level" varchar(100),
	"application_deadline" date,
	"allow_cover_letter" boolean DEFAULT true,
	"require_cover_letter" boolean DEFAULT false,
	"status" "job_status" DEFAULT 'draft' NOT NULL,
	"is_published" boolean DEFAULT false,
	"published_date" timestamp,
	"total_views" integer DEFAULT 0,
	"total_applications" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_applications_code_idx" ON "job_applications" ("application_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_applications_job_posting_idx" ON "job_applications" ("job_posting_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_applications_status_idx" ON "job_applications" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_applications_email_idx" ON "job_applications" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_postings_org_code_idx" ON "job_postings" ("organization_id","job_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_postings_status_idx" ON "job_postings" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_postings_published_idx" ON "job_postings" ("is_published");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_postings_department_idx" ON "job_postings" ("department_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tenant_configurations" ADD CONSTRAINT "tenant_configurations_tenant_id_tenants_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "departments" ADD CONSTRAINT "departments_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "designations" ADD CONSTRAINT "designations_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "locations" ADD CONSTRAINT "locations_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_addresses" ADD CONSTRAINT "organization_addresses_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizations" ADD CONSTRAINT "organizations_tenant_id_tenants_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_users_user_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_posting_id_job_postings_job_posting_id_fk" FOREIGN KEY ("job_posting_id") REFERENCES "job_postings"("job_posting_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_updated_by_employees_employee_id_fk" FOREIGN KEY ("updated_by") REFERENCES "employees"("employee_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_organization_id_organizations_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_department_id_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_designation_id_designations_designation_id_fk" FOREIGN KEY ("designation_id") REFERENCES "designations"("designation_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_reporting_manager_id_employees_employee_id_fk" FOREIGN KEY ("reporting_manager_id") REFERENCES "employees"("employee_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_created_by_employees_employee_id_fk" FOREIGN KEY ("created_by") REFERENCES "employees"("employee_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_updated_by_employees_employee_id_fk" FOREIGN KEY ("updated_by") REFERENCES "employees"("employee_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
