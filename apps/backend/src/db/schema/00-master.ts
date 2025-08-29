
import { pgTable, uuid, integer, varchar, json, boolean, timestamp, text } from "drizzle-orm/pg-core";


// Tenant Management for Multi-Organization Support
export const tenants = pgTable('tenants', {
  tenantId: uuid('tenant_id').primaryKey().defaultRandom(),
  tenantName: varchar('tenant_name', { length: 255 }).notNull(),
  tenantCode: varchar('tenant_code', { length: 50 }).notNull().unique(),
  subscriptionPlan: varchar('subscription_plan', { length: 50 }).default('basic'),
  subscriptionStatus: varchar('subscription_status', { length: 20 }).default('active'),
  maxUsers: integer('max_users').default(10),
  maxEmployees: integer('max_employees').default(50),
  features: json('features').$type<string[]>(),
  databaseUrl: varchar('database_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Database Configurations per Tenant
export const tenantConfigurations = pgTable('tenant_configurations', {
  configId: uuid('config_id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.tenantId).notNull(),
  configKey: varchar('config_key', { length: 100 }).notNull(),
  configValue: text('config_value'),
  configType: varchar('config_type', { length: 50 }).default('string'),
  isEncrypted: boolean('is_encrypted').default(false),
  createdAt: timestamp('created_at').defaultNow()
});