import { relations } from 'drizzle-orm'
import { employees } from './employees'
import { departments } from './departments'
import { positions } from './positions'
import { employeeDocuments } from './employees'

// Department relations
export const departmentsRelations = relations(departments, ({ one, many }) => ({
  manager: one(employees, {
    fields: [departments.managerId],
    references: [employees.id],
  }),
  employees: many(employees),
  positions: many(positions),
}))

// Position relations
export const positionsRelations = relations(positions, ({ one, many }) => ({
  department: one(departments, {
    fields: [positions.departmentId],
    references: [departments.id],
  }),
  employees: many(employees),
}))

// Employee relations
export const employeesRelations = relations(employees, ({ one, many }) => ({
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  position: one(positions, {
    fields: [employees.positionId],
    references: [positions.id],
  }),
  manager: one(employees, {
    fields: [employees.managerId],
    references: [employees.id],
    relationName: 'ManagerSubordinate',
  }),
  subordinates: many(employees, {
    relationName: 'ManagerSubordinate',
  }),
  documents: many(employeeDocuments),
  createdEmployees: many(employees, {
    relationName: 'CreatedBy',
  }),
  updatedEmployees: many(employees, {
    relationName: 'UpdatedBy',
  }),
}))

// Employee documents relations
export const employeeDocumentsRelations = relations(employeeDocuments, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeDocuments.employeeId],
    references: [employees.id],
  }),
  uploadedBy: one(employees, {
    fields: [employeeDocuments.uploadedBy],
    references: [employees.id],
  }),
}))