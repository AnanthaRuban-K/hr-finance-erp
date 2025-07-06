import { pgTable, uuid, varchar, date, timestamp, decimal, boolean } from 'drizzle-orm/pg-core'

export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: varchar('employee_id', { length: 20 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  department: varchar('department', { length: 100 }),
  position: varchar('position', { length: 100 }),
  joiningDate: date('joining_date'),
  salary: decimal('salary', { precision: 12, scale: 2 }),
  status: varchar('status', { length: 20 }).default('active'),
  address: varchar('address', { length: 500 }),
  emergencyContact: varchar('emergency_contact', { length: 100 }),
  emergencyPhone: varchar('emergency_phone', { length: 20 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export type Employee = typeof employees.$inferSelect
export type NewEmployee = typeof employees.$inferInsert