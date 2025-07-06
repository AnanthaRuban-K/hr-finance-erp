import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { departments } from './departments'

export const positions = pgTable('positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 100 }).notNull(),
  departmentId: uuid('department_id').references(() => departments.id),
  level: varchar('level', { length: 50 }), // Junior, Senior, Lead, Manager
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export type Position = typeof positions.$inferSelect
export type NewPosition = typeof positions.$inferInsert