import { Context } from "hono";
import * as payrollService from "../services/payrollService.js";

// Helper function to safely get error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
};

export const createPayroll = async (c: Context) => {
  try {
    console.log('📝 Received payroll creation request');
    
    const body = await c.req.json();
    console.log('📋 Request body:', body);
    
    const { employeeId, month, baseSalary, bonus, deductions, netPay } = body;

    // Enhanced validation
    if (!employeeId || !month || baseSalary === undefined) {
      console.log('❌ Validation failed - missing required fields');
      return c.json({ 
        success: false,
        error: "Missing required fields", 
        details: "employeeId, month, and baseSalary are required",
        received: { employeeId, month, baseSalary }
      }, 400);
    }

    // Validate data types
    const salary = Number(baseSalary);
    const bonusAmount = Number(bonus) || 0;
    const deductionAmount = Number(deductions) || 0;
    const netPayAmount = netPay !== undefined ? Number(netPay) : (salary + bonusAmount - deductionAmount);

    if (isNaN(salary) || salary <= 0) {
      console.log('❌ Invalid base salary:', baseSalary);
      return c.json({ 
        success: false,
        error: "Invalid base salary", 
        details: "Base salary must be a positive number" 
      }, 400);
    }

    console.log('✅ Validation passed, creating payroll...');
    console.log('📊 Processed data:', {
      employeeId,
      month,
      baseSalary: salary,
      bonus: bonusAmount,
      deductions: deductionAmount,
      netPay: netPayAmount
    });

    const result = await payrollService.runPayroll(
      employeeId,
      month,
      salary,
      bonusAmount,
      deductionAmount,
      netPayAmount
    );

    console.log('🎉 Payroll created successfully:', result[0]);

    return c.json({
      success: true,
      data: result[0],
      message: "Payroll created successfully"
    }, 201);

  } catch (error: unknown) {
    console.error("💥 Error creating payroll:", error);
    
    const errorMessage = getErrorMessage(error);
    
    // More detailed error handling
    if (errorMessage.includes('uuid')) {
      return c.json({ 
        success: false,
        error: "Database error - Invalid ID format",
        details: errorMessage
      }, 500);
    }

    if (errorMessage.includes('constraint')) {
      return c.json({ 
        success: false,
        error: "Database constraint violation",
        details: errorMessage
      }, 500);
    }

    return c.json({ 
      success: false,
      error: "Failed to create payroll record",
      details: errorMessage
    }, 500);
  }
};

export const listPayrolls = async (c: Context) => {
  try {
    console.log('📋 Fetching all payrolls...');
    
    const result = await payrollService.getPayrolls();
    
    console.log(`📊 Retrieved ${result.length} payroll records`);
    
    return c.json({
      success: true,
      data: result,
      count: result.length
    });
  } catch (error: unknown) {
    console.error("💥 Error fetching payrolls:", error);
    return c.json({ 
      success: false,
      error: "Failed to fetch payroll records",
      details: getErrorMessage(error)
    }, 500);
  }
};

export const getPayrollById = async (c: Context) => {
  try {
    const id = c.req.param("id");
    console.log(`🔍 Fetching payroll by ID: ${id}`);
    
    if (!id) {
      return c.json({ 
        success: false,
        error: "Missing payroll ID" 
      }, 400);
    }

    const result = await payrollService.getPayrollById(id);

    if (!result) {
      console.log(`❌ Payroll not found: ${id}`);
      return c.json({ 
        success: false,
        error: "Payroll record not found" 
      }, 404);
    }

    console.log(`✅ Found payroll: ${id}`);
    return c.json({
      success: true,
      data: result
    });
  } catch (error: unknown) {
    console.error("💥 Error fetching payroll:", error);
    return c.json({ 
      success: false,
      error: "Failed to fetch payroll record",
      details: getErrorMessage(error)
    }, 500);
  }
};

export const updatePayroll = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const updateData = await c.req.json();
    
    console.log(`🔄 Updating payroll ${id} with:`, updateData);

    if (!id) {
      return c.json({ 
        success: false,
        error: "Missing payroll ID" 
      }, 400);
    }

    const result = await payrollService.updatePayroll(id, updateData);

    if (!result || result.length === 0) {
      console.log(`❌ Payroll not found for update: ${id}`);
      return c.json({ 
        success: false,
        error: "Payroll record not found" 
      }, 404);
    }

    console.log(`✅ Payroll updated: ${id}`);
    return c.json({
      success: true,
      data: result[0],
      message: "Payroll updated successfully"
    });
  } catch (error: unknown) {
    console.error("💥 Error updating payroll:", error);
    return c.json({ 
      success: false,
      error: "Failed to update payroll record",
      details: getErrorMessage(error)
    }, 500);
  }
};

export const deletePayroll = async (c: Context) => {
  try {
    const id = c.req.param("id");
    console.log(`🗑️ Deleting payroll: ${id}`);

    if (!id) {
      return c.json({ 
        success: false,
        error: "Missing payroll ID" 
      }, 400);
    }

    const result = await payrollService.deletePayroll(id);

    if (!result || result.length === 0) {
      console.log(`❌ Payroll not found for deletion: ${id}`);
      return c.json({ 
        success: false,
        error: "Payroll record not found" 
      }, 404);
    }

    console.log(`✅ Payroll deleted: ${id}`);
    return c.json({ 
      success: true,
      message: "Payroll record deleted successfully" 
    });
  } catch (error: unknown) {
    console.error("💥 Error deleting payroll:", error);
    return c.json({ 
      success: false,
      error: "Failed to delete payroll record",
      details: getErrorMessage(error)
    }, 500);
  }
};

export const payPayroll = async (c: Context) => {
  try {
    const id = c.req.param("id");
    console.log(`💰 Marking payroll as paid: ${id}`);

    if (!id) {
      return c.json({ 
        success: false,
        error: "Missing payroll ID" 
      }, 400);
    }

    const result = await payrollService.markAsPaid(id);

    if (!result || result.length === 0) {
      console.log(`❌ Payroll not found for payment: ${id}`);
      return c.json({ 
        success: false,
        error: "Payroll record not found" 
      }, 404);
    }

    console.log(`✅ Payroll marked as paid: ${id}`);
    return c.json({
      success: true,
      data: result[0],
      message: "Payroll marked as paid successfully"
    });
  } catch (error: unknown) {
    console.error("💥 Error marking payroll as paid:", error);
    return c.json({ 
      success: false,
      error: "Failed to mark payroll as paid",
      details: getErrorMessage(error)
    }, 500);
  }
};
