import { pgTable, uuid, varchar, text, timestamp, boolean, decimal } from 'drizzle-orm/pg-core'

export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  headOfDepartment: uuid('head_of_department'), // FK to employees
  budget: decimal('budget', { precision: 15, scale: 2 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export type Department = typeof departments.$inferSelect
export type NewDepartment = typeof departments.$inferInsert