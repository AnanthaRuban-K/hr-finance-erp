import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { db } from './db/connection'
import { employees } from './db/schema'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: [
    'https://erp.sbrosenterpriseerp.com',
    'http://localhost:3000'
  ],
  credentials: true,
}))

// Health check with Neon
app.get('/health', async (c) => {
  try {
    await db.select().from(employees).limit(1)
    
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'HR Finance ERP Backend',
      version: '1.0.0',
      database: 'connected',
      provider: 'Neon PostgreSQL'
    })
  } catch (error) {
    return c.json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Employees API
app.get('/api/employees', async (c) => {
  try {
    const allEmployees = await db.select().from(employees)
    return c.json({
      success: true,
      data: allEmployees,
      count: allEmployees.length
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export { app }