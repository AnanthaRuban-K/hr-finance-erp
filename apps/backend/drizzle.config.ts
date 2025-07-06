import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(`
❌ DATABASE_URL environment variable is not set.

Please add your Neon connection string to .env:
DATABASE_URL=postgresql://user:pass@host/database

Current DATABASE_URL: ${databaseUrl}
`)
}

export default {
  schema: './src/db/schema/*',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
} satisfies Config