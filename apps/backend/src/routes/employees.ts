// src/routes/employees.ts
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/index.js';
import { employees } from '../db/schema.js';
import { eq, ilike, or, and, desc, asc, sql } from 'drizzle-orm';

const employeesRouter = new Hono();

// Employee validation schema (matching your frontend exactly)
const employeeSchema = z.object({
  fullName: z.string().min(1).max(100),
  nricFinPassport: z.string().min(1),
  dateOfBirth: z.string().min(1),
  gender: z.enum(['male', 'female', 'other']),
  nationality: z.enum(['singapore', 'malaysia', 'china', 'india', 'others']),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
  residentialStatus: z.enum(['citizen', 'pr', 'workpass', 'dependent']),
  race: z.string().optional(),
  religion: z.string().optional(),
  email: z.string().email().max(100),
  phone: z.string().min(1),
  address: z.string().min(10).max(200),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  emergencyContact: z.string().min(1),
  emergencyPhone: z.string().min(1),
  employeeId: z.string().min(1),
  department: z.enum(['hr', 'it', 'finance', 'marketing', 'operations', 'sales']),
  position: z.string().min(1),
  joinDate: z.string().min(1),
  employmentType: z.enum(['fulltime', 'parttime', 'contract', 'intern']),
  reportingManager: z.string().optional(),
  basicSalary: z.number().positive().max(999999),
  paymentMode: z.enum(['bank', 'cash', 'cheque']),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  cpfNumber: z.string().optional(),
  taxNumber: z.string().optional(),
  skills: z.string().optional(),
  certifications: z.string().optional(),
  notes: z.string().optional(),
  uploadedFiles: z.array(z.string()).optional(), // For file names
});

// GET / - Get all employees with filtering and pagination
employeesRouter.get('/', async (c) => {
  try {
    const url = new URL(c.req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || undefined;
    const department = url.searchParams.get('department') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          ilike(employees.fullName, `%${search}%`),
          ilike(employees.email, `%${search}%`),
          ilike(employees.employeeId, `%${search}%`),
          ilike(employees.position, `%${search}%`)
        )
      );
    }

    if (department) {
      conditions.push(eq(employees.department, department as any));
    }

    if (status) {
      conditions.push(eq(employees.status, status as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Define sort mapping
    const sortMapping: Record<string, any> = {
      'createdAt': employees.createdAt,
      'fullName': employees.fullName,
      'joinDate': employees.joinDate,
      'department': employees.department,
    };

    const sortColumn = sortMapping[sortBy] || employees.createdAt;
    const orderFn = sortOrder === 'asc' ? asc : desc;

    // Get employees
    const employeesList = await db
      .select()
      .from(employees)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(employees)
      .where(whereClause);

    return c.json({
      success: true,
      data: employeesList,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// GET /:id - Get employee by ID
employeesRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);

    if (!employee.length) {
      return c.json({ success: false, error: 'Employee not found' }, 404);
    }

    return c.json({
      success: true,
      employee: employee[0], // Frontend expects 'employee' not 'data'
    });
  } catch (error: any) {
    console.error('Error fetching employee:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// POST / - Create new employee
employeesRouter.post('/', async (c) => {
  try {
    // Better JSON parsing with error handling
    let body;
    try {
      body = await c.req.json();
      console.log('Received data:', JSON.stringify(body, null, 2));
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return c.json({ 
        success: false, 
        error: 'Invalid JSON in request body. Please check your Content-Type header is application/json' 
      }, 400);
    }
    
    const validatedData = employeeSchema.parse(body);

    const [newEmployee] = await db
      .insert(employees)
      .values({
        ...validatedData,
        basicSalary: validatedData.basicSalary.toString(),
      })
      .returning();

    return c.json({
      success: true,
      employee: newEmployee, // Frontend expects 'employee' not 'data'
    }, 201);
  } catch (error: any) {
    console.error('Error creating employee:', error);
    
    if (error.name === 'ZodError') {
      return c.json({ 
        success: false, 
        error: 'Validation failed',
        details: error.errors 
      }, 400);
    }
    
    if (error.code === '23505') { // Unique constraint violation
      return c.json({ 
        success: false, 
        error: 'Employee ID, NRIC/FIN/Passport, or Email already exists' 
      }, 400);
    }
    
    return c.json({ success: false, error: 'Failed to create employee' }, 500);
  }
});

// PUT /:id - Update employee
employeesRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Better JSON parsing with error handling
    let body;
    try {
      body = await c.req.json();
      console.log('Received update data:', JSON.stringify(body, null, 2));
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return c.json({ 
        success: false, 
        error: 'Invalid JSON in request body. Please check your Content-Type header is application/json' 
      }, 400);
    }
    
    const validatedData = employeeSchema.partial().parse(body);

    const updateData = {
      ...validatedData,
      basicSalary: validatedData.basicSalary?.toString(),
      updatedAt: new Date(),
    };

    const [updatedEmployee] = await db
      .update(employees)
      .set(updateData)
      .where(eq(employees.id, id))
      .returning();

    if (!updatedEmployee) {
      return c.json({ success: false, error: 'Employee not found' }, 404);
    }

    return c.json({
      success: true,
      employee: updatedEmployee, // Frontend expects 'employee' not 'data'
    });
  } catch (error: any) {
    console.error('Error updating employee:', error);
    
    if (error.name === 'ZodError') {
      return c.json({ 
        success: false, 
        error: 'Validation failed',
        details: error.errors 
      }, 400);
    }
    
    if (error.code === '23505') {
      return c.json({ 
        success: false, 
        error: 'NRIC/FIN/Passport or Email already exists' 
      }, 400);
    }
    
    return c.json({ success: false, error: 'Failed to update employee' }, 500);
  }
});

// DELETE /:id - Delete employee
employeesRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const [deletedEmployee] = await db
      .delete(employees)
      .where(eq(employees.id, id))
      .returning();

    if (!deletedEmployee) {
      return c.json({ success: false, error: 'Employee not found' }, 404);
    }

    return c.json({
      success: true,
      employee: deletedEmployee, // Frontend expects 'employee' not 'data'
    });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    return c.json({ success: false, error: 'Failed to delete employee' }, 500);
  }
});

export default employeesRouter;