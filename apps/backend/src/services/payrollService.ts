import { db } from "../db/schema/customer.js";
import { payroll } from "../db/schema/payrollSchema.js";
import { eq, desc } from "drizzle-orm";

export const runPayroll = async (
  employeeId: string,
  month: string,
  baseSalary: number,
  bonus: number = 0,
  deductions: number = 0,
  netPay?: number
) => {
  try {
    console.log('🔍 Creating payroll with data:', {
      employeeId,
      month,
      baseSalary,
      bonus,
      deductions,
      netPay
    });

    // Validate required fields
    if (!employeeId || !month || baseSalary === undefined) {
      throw new Error('Missing required fields: employeeId, month, baseSalary');
    }

    // Calculate net pay if not provided
    const calculatedNetPay = netPay !== undefined ? netPay : (baseSalary + bonus - deductions);

    // Insert payroll record - let UUID auto-generate
    const result = await db.insert(payroll).values({
      employeeId,
      month,
      baseSalary: baseSalary.toString(),
      bonus: bonus.toString(),
      deductions: deductions.toString(),
      netPay: calculatedNetPay.toString(),
      isPaid: false,
      // Don't specify id, createdAt, updatedAt - they auto-generate
    }).returning();

    console.log('✅ Payroll created successfully:', result[0]);
    return result;
  } catch (error) {
    console.error('❌ Error in runPayroll:', error);
    console.error('❌ Error details:', {
      employeeId,
      month,
      baseSalary: baseSalary.toString(),
      bonus: bonus.toString(),
      deductions: deductions.toString()
    });
    throw error;
  }
};

export const getPayrolls = async () => {
  try {
    const result = await db.select().from(payroll).orderBy(desc(payroll.createdAt));
    console.log(`📊 Retrieved ${result.length} payroll records`);
    return result;
  } catch (error) {
    console.error('❌ Error fetching payrolls:', error);
    throw error;
  }
};

export const getPayrollById = async (id: string) => {
  try {
    const result = await db.select().from(payroll).where(eq(payroll.id, id));
    console.log(`🔍 Found payroll by ID ${id}:`, result[0] || 'Not found');
    return result[0] || null;
  } catch (error) {
    console.error(`❌ Error fetching payroll by ID ${id}:`, error);
    throw error;
  }
};

export const updatePayroll = async (id: string, updateData: any) => {
  try {
    console.log(`🔄 Updating payroll ${id} with data:`, updateData);
    
    const { baseSalary, bonus, deductions, netPay, ...otherData } = updateData;

    // Recalculate netPay if any financial fields are being updated
    let updateValues = { 
      ...otherData,
      updatedAt: new Date()
    };

    if (baseSalary !== undefined || bonus !== undefined || deductions !== undefined || netPay !== undefined) {
      // Get current record to calculate netPay if needed
      const current = await getPayrollById(id);
      if (!current) {
        console.log(`❌ Payroll ${id} not found for update`);
        return null;
      }

      const newBaseSalary = baseSalary !== undefined ? Number(baseSalary) : Number(current.baseSalary);
      const newBonus = bonus !== undefined ? Number(bonus) : Number(current.bonus);
      const newDeductions = deductions !== undefined ? Number(deductions) : Number(current.deductions);
      const newNetPay = netPay !== undefined ? Number(netPay) : (newBaseSalary + newBonus - newDeductions);

      updateValues = {
        ...updateValues,
        ...(baseSalary !== undefined && { baseSalary: baseSalary.toString() }),
        ...(bonus !== undefined && { bonus: bonus.toString() }),
        ...(deductions !== undefined && { deductions: deductions.toString() }),
        netPay: newNetPay.toString()
      };
    }

    const result = await db.update(payroll)
      .set(updateValues)
      .where(eq(payroll.id, id))
      .returning();
    
    console.log(`✅ Payroll ${id} updated successfully:`, result[0]);
    return result;
  } catch (error) {
    console.error(`❌ Error updating payroll ${id}:`, error);
    throw error;
  }
};

export const deletePayroll = async (id: string) => {
  try {
    console.log(`🗑️ Deleting payroll ${id}`);
    
    const result = await db.delete(payroll)
      .where(eq(payroll.id, id))
      .returning();
    
    console.log(`✅ Payroll ${id} deleted successfully`);
    return result;
  } catch (error) {
    console.error(`❌ Error deleting payroll ${id}:`, error);
    throw error;
  }
};

export const markAsPaid = async (id: string) => {
  try {
    console.log(`💰 Marking payroll ${id} as paid`);
    
    const result = await db.update(payroll)
      .set({ 
        isPaid: true, 
        payDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date()
      })
      .where(eq(payroll.id, id))
      .returning();
    
    console.log(`✅ Payroll ${id} marked as paid:`, result[0]);
    return result;
  } catch (error) {
    console.error(`❌ Error marking payroll ${id} as paid:`, error);
    throw error;
  }
};