import { pgTable, uuid, varchar, numeric, date, boolean, timestamp } from "drizzle-orm/pg-core";

export const payroll = pgTable("payroll", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: varchar("employee_id", { length: 50 }).notNull(), // ← Changed from uuid to varchar
  month: varchar("month", { length: 20 }).notNull(),
  baseSalary: numeric("base_salary", { precision: 10, scale: 2 }).notNull(),
  bonus: numeric("bonus", { precision: 10, scale: 2 }).default("0"),
  deductions: numeric("deductions", { precision: 10, scale: 2 }).default("0"),
  netPay: numeric("net_pay", { precision: 10, scale: 2 }).notNull(),
  payDate: date("pay_date"),
  isPaid: boolean("is_paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});