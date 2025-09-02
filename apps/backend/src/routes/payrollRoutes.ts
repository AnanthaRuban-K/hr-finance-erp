import { Hono } from "hono";
import { 
  createPayroll, 
  listPayrolls, 
  payPayroll,
  getPayrollById,
  updatePayroll,
  deletePayroll 
} from "../controllers/payrollController.js";

const payrollRoutes = new Hono();

// Create new payroll record
payrollRoutes.post("/", createPayroll);

// Get all payroll records
payrollRoutes.get("/", listPayrolls);

// Get payroll record by ID
payrollRoutes.get("/:id", getPayrollById);

// Update payroll record
payrollRoutes.put("/:id", updatePayroll);

// Delete payroll record
payrollRoutes.delete("/:id", deletePayroll);

// Mark payroll as paid (special action)
payrollRoutes.patch("/:id/pay", payPayroll);

export default payrollRoutes;