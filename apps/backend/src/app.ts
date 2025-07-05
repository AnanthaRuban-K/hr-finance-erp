import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'HR Finance ERP Backend',
    version: '1.0.0'
  })
})

// API info
app.get('/', (c) => {
  return c.json({
    message: 'HR Finance ERP Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
    },
    status: 'running'
  })
})

// Basic API routes
app.get('/api/test', (c) => {
  return c.json({
    message: 'API is working!',
    timestamp: new Date().toISOString()
  })
})

export { app }