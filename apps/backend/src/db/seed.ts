import * as dotenv from 'dotenv'

// Load environment variables FIRST before importing connection
dotenv.config()

import { db } from './connection'
import { employees, users, departments, type NewEmployee } from './schema'

async function seed() {
  try {
    console.log('🌱 Seeding HR-Finance ERP database...')
    console.log('📊 Database URL configured:', process.env.DATABASE_URL ? 'Yes' : 'No')

    // Create sample employees
    const employeeData: NewEmployee[] = [
      {
        employeeId: 'EMP001',
        firstName: 'Ruban',
        lastName: 'Ash',
        email: 'ruban@sbrosenterpriseerp.com',
        phone: '+91-9876543210',
        department: 'Information Technology',
        position: 'Senior Developer',
        joiningDate: '2024-01-15',
        salary: '75000.00',
        address: 'Chennai, Tamil Nadu, India',
        emergencyContact: 'Emergency Contact',
        emergencyPhone: '+91-9876543211'
      },
      {
        employeeId: 'EMP002',
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya@sbrosenterpriseerp.com',
        phone: '+91-9876543212',
        department: 'Human Resources',
        position: 'HR Manager',
        joiningDate: '2023-06-01',
        salary: '85000.00',
        address: 'Mumbai, Maharashtra, India',
        emergencyContact: 'Emergency Contact',
        emergencyPhone: '+91-9876543213'
      },
      {
        employeeId: 'EMP003',
        firstName: 'Arjun',
        lastName: 'Patel',
        email: 'arjun@sbrosenterpriseerp.com',
        phone: '+91-9876543214',
        department: 'Finance',
        position: 'Finance Manager',
        joiningDate: '2023-03-20',
        salary: '90000.00',
        address: 'Bangalore, Karnataka, India',
        emergencyContact: 'Emergency Contact',
        emergencyPhone: '+91-9876543215'
      }
    ]

    const createdEmployees = await db.insert(employees)
      .values(employeeData)
      .returning()

    console.log(`✅ Created ${createdEmployees.length} employees`)
    console.log('🎉 Database seeding completed successfully!')
    
    // Display created employees
    console.log('\n📋 Created Employees:')
    createdEmployees.forEach((emp, index) => {
      console.log(`  ${index + 1}. ${emp.firstName} ${emp.lastName} (${emp.employeeId}) - ${emp.department}`)
    })
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

export { seed }