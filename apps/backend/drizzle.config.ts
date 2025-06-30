// ✅ CORRECT drizzle.config.ts for Neon
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/*',
  out: './src/db/migrations',
  dialect: 'postgresql', // Use dialect instead of driver
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Use url instead of connectionString
  },
  verbose: true,
  strict: true,
} satisfies Config;