// File: src/db/schema/customer.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, serial, varchar, text, boolean, decimal, timestamp } from 'drizzle-orm/pg-core';

// Database Schema
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  billingAddress: text('billing_address').notNull(),
  billingCity: varchar('billing_city', { length: 255 }).notNull(),
  billingState: varchar('billing_state', { length: 255 }).notNull(),
  billingZipCode: varchar('billing_zip_code', { length: 20 }).notNull(),
  billingTerms: varchar('billing_terms', { length: 255 }),
  sameAsBilling: boolean('same_as_billing').default(false),
  shippingAddress: text('shipping_address'),
  shippingCity: varchar('shipping_city', { length: 255 }),
  shippingState: varchar('shipping_state', { length: 255 }),
  shippingZipCode: varchar('shipping_zip_code', { length: 20 }),
  openBalance: decimal('open_balance', { precision: 10, scale: 2 }).default('0.00'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

// Database Connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

// Test Connection Function
export const testConnection = async () => {
  try {
    await client`SELECT 1`;
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};
