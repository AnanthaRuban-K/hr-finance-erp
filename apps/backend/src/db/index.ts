// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5kQNWL3flIRE@ep-silent-meadow-a11p1i58-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });