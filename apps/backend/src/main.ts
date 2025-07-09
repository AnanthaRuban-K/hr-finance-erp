import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { db } from './db/connection'
import { employees, departments, positions } from './db/schema'
import { eq, ilike, or, and, count } from 'drizzle-orm'

const app = new Hono()

// Enhanced CORS configuration
app.use('*', logger())
app.use('*', cors({
  origin: [
    'https://erp.sbrosenterpriseerp.com',
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',  // Add your current frontend port
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    // Add any other origins you need
  ],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposeHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 600
}))

// Add preflight OPTIONS handler for all routes
app.options('*', (c) => {
  return c.text('', 200)
})

// Health check with enhanced CORS headers
app.get('/health', async (c) => {
  // Add explicit CORS headers
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  try {
    await db.select().from(employees).limit(1)
    
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'HR Finance ERP Backend',
      version: '1.0.0',
      database: 'connected',
      provider: 'Neon PostgreSQL',
      cors: 'enabled'
    })
  } catch (error) {
    return c.json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Helper function to generate employee ID
async function generateEmployeeId(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `EMP${year}`
  
  try {
    // Get count of employees with current year prefix
    const [result] = await db
      .select({ count: count() })
      .from(employees)
      .where(ilike(employees.employeeId, `${prefix}%`))
    
    const nextNumber = ((result?.count || 0) + 1).toString().padStart(3, '0')
    return `${prefix}${nextNumber}`
  } catch (error) {
    // Fallback to timestamp-based ID
    const timestamp = Date.now().toString().slice(-6)
    return `${prefix}${timestamp}`
  }
}

// Validation helper
function validateEmployeeData(data: any) {
  const errors: string[] = []
  
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters')
  }
  
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters')
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email address is required')
  }
  
  if (!data.joiningDate) {
    errors.push('Joining date is required')
  }
  
  return errors
}

// EMPLOYEES ENDPOINTS

// Get all employees
app.get('/api/employees', async (c) => {
  try {
    const allEmployees = await db
      .select({
        id: employees.id,
        employeeId: employees.employeeId,
        clerkId: employees.clerkId,
        firstName: employees.firstName,
        lastName: employees.lastName,
        email: employees.email,
        phone: employees.phone,
        alternatePhone: employees.alternatePhone,
        address: employees.address,
        city: employees.city,
        state: employees.state,
        pincode: employees.pincode,
        country: employees.country,
        departmentId: employees.departmentId,
        positionId: employees.positionId,
        managerId: employees.managerId,
        joiningDate: employees.joiningDate,
        probationEndDate: employees.probationEndDate,
        employmentType: employees.employmentType,
        workLocation: employees.workLocation,
        shift: employees.shift,
        basicSalary: employees.basicSalary,
        currency: employees.currency,
        dateOfBirth: employees.dateOfBirth,
        gender: employees.gender,
        maritalStatus: employees.maritalStatus,
        bloodGroup: employees.bloodGroup,
        emergencyContactName: employees.emergencyContactName,
        emergencyContactPhone: employees.emergencyContactPhone,
        emergencyContactRelation: employees.emergencyContactRelation,
        aadharNumber: employees.aadharNumber,
        panNumber: employees.panNumber,
        passportNumber: employees.passportNumber,
        status: employees.status,
        profilePicture: employees.profilePicture,
        notes: employees.notes,
        createdAt: employees.createdAt,
        updatedAt: employees.updatedAt,
        createdBy: employees.createdBy,
        updatedBy: employees.updatedBy
      })
      .from(employees)
      .orderBy(employees.createdAt)

    return c.json({
      success: true,
      data: allEmployees,
      count: allEmployees.length
    })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get single employee
app.get('/api/employees/:id', async (c) => {
  try {
    const employeeId = c.req.param('id')
    
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId))
    
    if (!employee) {
      return c.json({
        success: false,
        error: 'Employee not found'
      }, 404)
    }
    
    return c.json({
      success: true,
      data: employee
    })
  } catch (error) {
    console.error('Error fetching employee:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Create new employee
app.post('/api/employees', async (c) => {
  try {
    const body = await c.req.json()
    
    // Validate required fields
    const validationErrors = validateEmployeeData(body)
    if (validationErrors.length > 0) {
      return c.json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      }, 400)
    }
    
    // Check if email already exists
    const [existingEmployee] = await db
      .select()
      .from(employees)
      .where(eq(employees.email, body.email))
    
    if (existingEmployee) {
      return c.json({
        success: false,
        error: 'Employee with this email already exists'
      }, 400)
    }
    
    // Generate employee ID
    const employeeId = await generateEmployeeId()
    
    // Prepare employee data
    const employeeData = {
      employeeId,
      clerkId: body.clerkId || null,
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone || null,
      alternatePhone: body.alternatePhone || null,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      pincode: body.pincode || null,
      country: body.country || 'India',
      departmentId: body.departmentId || null,
      positionId: body.positionId || null,
      managerId: body.managerId || null,
      joiningDate: body.joiningDate,
      probationEndDate: body.probationEndDate || null,
      employmentType: body.employmentType || 'full_time',
      workLocation: body.workLocation || null,
      shift: body.shift || 'day',
      basicSalary: body.basicSalary || null,
      currency: body.currency || 'INR',
      dateOfBirth: body.dateOfBirth || null,
      gender: body.gender || null,
      maritalStatus: body.maritalStatus || null,
      bloodGroup: body.bloodGroup || null,
      emergencyContactName: body.emergencyContactName || null,
      emergencyContactPhone: body.emergencyContactPhone || null,
      emergencyContactRelation: body.emergencyContactRelation || null,
      aadharNumber: body.aadharNumber || null,
      panNumber: body.panNumber || null,
      passportNumber: body.passportNumber || null,
      status: 'active',
      profilePicture: body.profilePicture || null,
      notes: body.notes || null,
      createdBy: body.createdBy || null,
      updatedBy: body.updatedBy || null
    }
    
    const [newEmployee] = await db
      .insert(employees)
      .values(employeeData)
      .returning()
    
    return c.json({
      success: true,
      data: newEmployee,
      message: 'Employee created successfully'
    }, 201)
  } catch (error) {
    console.error('Error creating employee:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Update employee
app.put('/api/employees/:id', async (c) => {
  try {
    const employeeId = c.req.param('id')
    const body = await c.req.json()
    
    // Check if employee exists
    const [existingEmployee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId))
    
    if (!existingEmployee) {
      return c.json({
        success: false,
        error: 'Employee not found'
      }, 404)
    }
    
    // Validate if email is being changed and doesn't conflict
    if (body.email && body.email !== existingEmployee.email) {
      const [emailConflict] = await db
        .select()
        .from(employees)
        .where(and(
          eq(employees.email, body.email),
          eq(employees.id, employeeId)
        ))
      
      if (emailConflict) {
        return c.json({
          success: false,
          error: 'Email already exists for another employee'
        }, 400)
      }
    }
    
    // Prepare update data (only include fields that are provided)
    const updateData: any = {
      updatedAt: new Date(),
      updatedBy: body.updatedBy || null
    }
    
    // Add only provided fields
    const allowedFields = [
      'firstName', 'lastName', 'email', 'phone', 'alternatePhone',
      'address', 'city', 'state', 'pincode', 'country',
      'departmentId', 'positionId', 'managerId', 'joiningDate', 'probationEndDate',
      'employmentType', 'workLocation', 'shift', 'basicSalary', 'currency',
      'dateOfBirth', 'gender', 'maritalStatus', 'bloodGroup',
      'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation',
      'aadharNumber', 'panNumber', 'passportNumber', 'profilePicture', 'notes'
    ]
    
    allowedFields.forEach(field => {
      if (body.hasOwnProperty(field)) {
        updateData[field] = body[field]
      }
    })
    
    const [updatedEmployee] = await db
      .update(employees)
      .set(updateData)
      .where(eq(employees.id, employeeId))
      .returning()
    
    return c.json({
      success: true,
      data: updatedEmployee,
      message: 'Employee updated successfully'
    })
  } catch (error) {
    console.error('Error updating employee:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Update employee status
app.patch('/api/employees/:id/status', async (c) => {
  try {
    const employeeId = c.req.param('id')
    const { status } = await c.req.json()
    
    if (!['active', 'inactive', 'terminated'].includes(status)) {
      return c.json({
        success: false,
        error: 'Invalid status. Must be active, inactive, or terminated'
      }, 400)
    }
    
    const [updatedEmployee] = await db
      .update(employees)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(employees.id, employeeId))
      .returning()
    
    if (!updatedEmployee) {
      return c.json({
        success: false,
        error: 'Employee not found'
      }, 404)
    }
    
    return c.json({
      success: true,
      data: updatedEmployee,
      message: `Employee status updated to ${status}`
    })
  } catch (error) {
    console.error('Error updating employee status:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Delete employee
app.delete('/api/employees/:id', async (c) => {
  try {
    const employeeId = c.req.param('id')
    
    const [deletedEmployee] = await db
      .delete(employees)
      .where(eq(employees.id, employeeId))
      .returning()
    
    if (!deletedEmployee) {
      return c.json({
        success: false,
        error: 'Employee not found'
      }, 404)
    }
    
    return c.json({
      success: true,
      message: 'Employee deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Search employees
app.get('/api/employees/search', async (c) => {
  try {
    const searchTerm = c.req.query('search') || ''
    
    if (!searchTerm.trim()) {
      return c.json({
        success: false,
        error: 'Search term is required'
      }, 400)
    }
    
    const searchResults = await db
      .select()
      .from(employees)
      .where(
        or(
          ilike(employees.firstName, `%${searchTerm}%`),
          ilike(employees.lastName, `%${searchTerm}%`),
          ilike(employees.email, `%${searchTerm}%`),
          ilike(employees.employeeId, `%${searchTerm}%`)
        )
      )
      .orderBy(employees.firstName)
    
    return c.json({
      success: true,
      data: searchResults,
      count: searchResults.length
    })
  } catch (error) {
    console.error('Error searching employees:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get employees by department
app.get('/api/employees/department/:departmentId', async (c) => {
  try {
    const departmentId = c.req.param('departmentId')
    
    const departmentEmployees = await db
      .select()
      .from(employees)
      .where(eq(employees.departmentId, departmentId))
      .orderBy(employees.firstName)
    
    return c.json({
      success: true,
      data: departmentEmployees,
      count: departmentEmployees.length
    })
  } catch (error) {
    console.error('Error fetching department employees:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get employees by manager
app.get('/api/employees/manager/:managerId', async (c) => {
  try {
    const managerId = c.req.param('managerId')
    
    const managerEmployees = await db
      .select()
      .from(employees)
      .where(eq(employees.managerId, managerId))
      .orderBy(employees.firstName)
    
    return c.json({
      success: true,
      data: managerEmployees,
      count: managerEmployees.length
    })
  } catch (error) {
    console.error('Error fetching manager employees:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get employee count for ID generation
app.get('/api/employees/count', async (c) => {
  try {
    const prefix = c.req.query('prefix') || ''
    
    if (prefix) {
      const [result] = await db
        .select({ count: count() })
        .from(employees)
        .where(ilike(employees.employeeId, `${prefix}%`))
      
      return c.json({
        success: true,
        data: { count: result?.count || 0 }
      })
    } else {
      const [result] = await db
        .select({ count: count() })
        .from(employees)
      
      return c.json({
        success: true,
        data: { count: result?.count || 0 }
      })
    }
  } catch (error) {
    console.error('Error getting employee count:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// DEPARTMENTS ENDPOINTS

// Get all departments
app.get('/api/departments', async (c) => {
  try {
    const allDepartments = await db
      .select()
      .from(departments)
      .orderBy(departments.name)
    
    return c.json({
      success: true,
      data: allDepartments,
      count: allDepartments.length
    })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// POSITIONS ENDPOINTS

// Get all positions
app.get('/api/positions', async (c) => {
  try {
    const allPositions = await db
      .select()
      .from(positions)
      .orderBy(positions.title)
    
    return c.json({
      success: true,
      data: allPositions,
      count: allPositions.length
    })
  } catch (error) {
    console.error('Error fetching positions:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get positions by department
app.get('/api/positions/department/:departmentId', async (c) => {
  try {
    const departmentId = c.req.param('departmentId')
    
    const departmentPositions = await db
      .select()
      .from(positions)
      .where(eq(positions.departmentId, departmentId))
      .orderBy(positions.title)
    
    return c.json({
      success: true,
      data: departmentPositions,
      count: departmentPositions.length
    })
  } catch (error) {
    console.error('Error fetching department positions:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Error handling middleware
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({
    success: false,
    error: 'Internal server error',
    message: err.message
  }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  }, 404)
})

export { app }