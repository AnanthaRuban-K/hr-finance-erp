import postgres from 'postgres'
import * as dotenv from 'dotenv'

dotenv.config()

async function testNeonConnection() {
  try {
    console.log('🧪 Testing Neon database connection...')
    
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    
    console.log('📡 Connecting to Neon...')
    
    const sql = postgres(databaseUrl, {
      ssl: 'require',
      max: 1,
    })
    
    // Test connection with simple query
    const result = await sql`SELECT 
      version() as postgres_version,
      current_database() as database_name,
      current_user as user_name,
      NOW() as current_time
    `
    
    console.log('✅ Successfully connected to Neon PostgreSQL!')
    console.log('📊 Database info:')
    console.log('  - Database:', result[0].database_name)
    console.log('  - User:', result[0].user_name)
    console.log('  - PostgreSQL version:', result[0].postgres_version)
    console.log('  - Current time:', result[0].current_time)
    
    await sql.end()
    console.log('🔚 Connection closed successfully')
    
  } catch (error) {
    console.error('❌ Neon connection failed:')
    console.error(error)
    process.exit(1)
  }
}

testNeonConnection()