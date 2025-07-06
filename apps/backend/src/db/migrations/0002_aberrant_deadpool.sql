CREATE TABLE "positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(100) NOT NULL,
	"department_id" uuid,
	"level" varchar(50),
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "employee_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"document_type" varchar(50) NOT NULL,
	"document_name" varchar(255) NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer,
	"mime_type" varchar(100),
	"uploaded_at" timestamp DEFAULT now(),
	"uploaded_by" uuid
);
--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "joining_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "address" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "manager_id" uuid;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "clerk_id" varchar(255);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "alternate_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "state" varchar(100);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "pincode" varchar(10);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "country" varchar(100) DEFAULT 'India';--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "department_id" uuid;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "position_id" uuid;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "manager_id" uuid;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "probation_end_date" date;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "employment_type" varchar(50) DEFAULT 'full_time';--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "work_location" varchar(100);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "shift" varchar(50) DEFAULT 'day';--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "basic_salary" integer;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "currency" varchar(10) DEFAULT 'INR';--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "gender" varchar(20);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "marital_status" varchar(20);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "blood_group" varchar(5);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "emergency_contact_name" varchar(100);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "emergency_contact_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "emergency_contact_relation" varchar(50);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "aadhar_number" varchar(20);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "pan_number" varchar(20);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "passport_number" varchar(20);--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "profile_picture" text;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_uploaded_by_employees_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" DROP COLUMN "head_of_department";--> statement-breakpoint
ALTER TABLE "departments" DROP COLUMN "budget";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "department";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "position";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "salary";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "emergency_contact";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "emergency_phone";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_clerk_id_unique" UNIQUE("clerk_id");