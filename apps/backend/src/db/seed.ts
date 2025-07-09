import { db } from './connection'
import { departments, positions, employees } from './schema'
import { eq } from 'drizzle-orm'

async function seedDatabase() {
  console.log('🌱 Seeding database...')

  try {
    // Seed Departments
    console.log('📁 Creating departments...')
    const departmentData = [
      {
        name: 'Engineering',
        description: 'Software development and technical operations',
        code: 'ENG',
        isActive: true
      },
      {
        name: 'Human Resources',
        description: 'Employee management and organizational development',
        code: 'HR',
        isActive: true
      },
      {
        name: 'Finance',
        description: 'Financial planning, accounting, and budget management',
        code: 'FIN',
        isActive: true
      },
      {
        name: 'Sales',
        description: 'Revenue generation and client relationship management',
        code: 'SALES',
        isActive: true
      },
      {
        name: 'Marketing',
        description: 'Brand promotion and customer acquisition',
        code: 'MKT',
        isActive: true
      },
      {
        name: 'Operations',
        description: 'Day-to-day business operations and process management',
        code: 'OPS',
        isActive: true
      }
    ]

    const insertedDepartments = await db
      .insert(departments)
      .values(departmentData)
      .returning()

    console.log(`✅ Created ${insertedDepartments.length} departments`)

    // Seed Positions
    console.log('💼 Creating positions...')
    const positionData = [
      // Engineering positions
      {
        title: 'Software Engineer',
        departmentId: insertedDepartments.find(d => d.code === 'ENG')!.id,
        description: 'Develop and maintain software applications',
        level: 'junior',
        isActive: true
      },
      {
        title: 'Senior Software Engineer',
        departmentId: insertedDepartments.find(d => d.code === 'ENG')!.id,
        description: 'Lead software development projects and mentor junior developers',
        level: 'senior',
        isActive: true
      },
      {
        title: 'Engineering Manager',
        departmentId: insertedDepartments.find(d => d.code === 'ENG')!.id,
        description: 'Manage engineering team and technical strategy',
        level: 'manager',
        isActive: true
      },
      
      // HR positions
      {
        title: 'HR Specialist',
        departmentId: insertedDepartments.find(d => d.code === 'HR')!.id,
        description: 'Handle employee relations and HR processes',
        level: 'junior',
        isActive: true
      },
      {
        title: 'HR Manager',
        departmentId: insertedDepartments.find(d => d.code === 'HR')!.id,
        description: 'Lead HR strategy and team management',
        level: 'manager',
        isActive: true
      },
      
      // Finance positions
      {
        title: 'Accountant',
        departmentId: insertedDepartments.find(d => d.code === 'FIN')!.id,
        description: 'Manage financial records and transactions',
        level: 'junior',
        isActive: true
      },
      {
        title: 'Finance Manager',
        departmentId: insertedDepartments.find(d => d.code === 'FIN')!.id,
        description: 'Oversee financial operations and strategy',
        level: 'manager',
        isActive: true
      },
      
      // Sales positions
      {
        title: 'Sales Representative',
        departmentId: insertedDepartments.find(d => d.code === 'SALES')!.id,
        description: 'Generate leads and close sales deals',
        level: 'junior',
        isActive: true
      },
      {
        title: 'Sales Manager',
        departmentId: insertedDepartments.find(d => d.code === 'SALES')!.id,
        description: 'Lead sales team and develop sales strategies',
        level: 'manager',
        isActive: true
      },
      
      // Marketing positions
      {
        title: 'Marketing Specialist',
        departmentId: insertedDepartments.find(d => d.code === 'MKT')!.id,
        description: 'Execute marketing campaigns and strategies',
        level: 'junior',
        isActive: true
      },
      {
        title: 'Marketing Manager',
        departmentId: insertedDepartments.find(d => d.code === 'MKT')!.id,
        description: 'Develop marketing strategy and manage campaigns',
        level: 'manager',
        isActive: true
      },
      
      // Operations positions
      {
        title: 'Operations Coordinator',
        departmentId: insertedDepartments.find(d => d.code === 'OPS')!.id,
        description: 'Coordinate daily operations and processes',
        level: 'junior',
        isActive: true
      },
      {
        title: 'Operations Manager',
        departmentId: insertedDepartments.find(d => d.code === 'OPS')!.id,
        description: 'Oversee operations strategy and efficiency',
        level: 'manager',
        isActive: true
      }
    ]

    const insertedPositions = await db
      .insert(positions)
      .values(positionData)
      .returning()

    console.log(`✅ Created ${insertedPositions.length} positions`)

    // Seed Sample Employees
    console.log('👥 Creating sample employees...')
    const employeeData = [
      {
        employeeId: 'EMP2024001',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@company.com',
        phone: '+91 98765 43210',
        departmentId: insertedDepartments.find(d => d.code === 'ENG')!.id,
        positionId: insertedPositions.find(p => p.title === 'Engineering Manager')!.id,
        joiningDate: '2023-01-15',
        employmentType: 'full_time',
        basicSalary: 150000,
        currency: 'INR',
        status: 'active',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India'
      },
      {
        employeeId: 'EMP2024002',
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@company.com',
        phone: '+91 98765 43211',
        departmentId: insertedDepartments.find(d => d.code === 'HR')!.id,
        positionId: insertedPositions.find(p => p.title === 'HR Manager')!.id,
        joiningDate: '2023-02-01',
        employmentType: 'full_time',
        basicSalary: 120000,
        currency: 'INR',
        status: 'active',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India'
      },
      {
        employeeId: 'EMP2024003',
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.patel@company.com',
        phone: '+91 98765 43212',
        departmentId: insertedDepartments.find(d => d.code === 'FIN')!.id,
        positionId: insertedPositions.find(p => p.title === 'Finance Manager')!.id,
        joiningDate: '2023-03-01',
        employmentType: 'full_time',
        basicSalary: 130000,
        currency: 'INR',
        status: 'active',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India'
      },
      {
        employeeId: 'EMP2024004',
        firstName: 'Sneha',
        lastName: 'Reddy',
        email: 'sneha.reddy@company.com',
        phone: '+91 98765 43213',
        departmentId: insertedDepartments.find(d => d.code === 'ENG')!.id,
        positionId: insertedPositions.find(p => p.title === 'Senior Software Engineer')!.id,
        managerId: null, // Will be set to Rajesh's ID after creation
        joiningDate: '2023-04-15',
        employmentType: 'full_time',
        basicSalary: 95000,
        currency: 'INR',
        status: 'active',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India'
      },
      {
        employeeId: 'EMP2024005',
        firstName: 'Rohit',
        lastName: 'Singh',
        email: 'rohit.singh@company.com',
        phone: '+91 98765 43214',
        departmentId: insertedDepartments.find(d => d.code === 'SALES')!.id,
        positionId: insertedPositions.find(p => p.title === 'Sales Manager')!.id,
        joiningDate: '2023-05-01',
        employmentType: 'full_time',
        basicSalary: 110000,
        currency: 'INR',
        status: 'active',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India'
      }
    ]

    const insertedEmployees = await db
      .insert(employees)
      .values(employeeData)
      .returning()

    // Update Sneha's manager to be Rajesh
    const rajeshId = insertedEmployees.find(e => e.firstName === 'Rajesh')!.id
    await db
      .update(employees)
      .set({ managerId: rajeshId })
      .where(eq(employees.firstName, 'Sneha'))

    console.log(`✅ Created ${insertedEmployees.length} sample employees`)

    console.log('🎉 Database seeding completed successfully!')
    
    // Print summary
    console.log('\n📊 Seeding Summary:')
    console.log(`- Departments: ${insertedDepartments.length}`)
    console.log(`- Positions: ${insertedPositions.length}`)
    console.log(`- Employees: ${insertedEmployees.length}`)
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding process completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }
