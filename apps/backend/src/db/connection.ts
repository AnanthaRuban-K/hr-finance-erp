import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Load environment variables FIRST
dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set')
  console.error('Current working directory:', process.cwd())
  console.error('Environment variables loaded:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set'
  })
  throw new Error('DATABASE_URL environment variable is required')
}

console.log('✅ Database connection string loaded')

// Configure postgres connection for Neon
const sql = postgres(connectionString, {
  ssl: 'require', // Required for Neon
  max: 1, // Limit connections for serverless
})

const db = drizzle(sql, { schema })

export { db, sql }