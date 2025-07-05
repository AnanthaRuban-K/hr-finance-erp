import { serve } from '@hono/node-server'
import { app } from './app'

const port = Number(process.env.PORT) || 3001

console.log(`🚀 Starting HR Finance ERP Backend on port ${port}`)
console.log(`📅 Started at: ${new Date().toISOString()}`)
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)

serve({
  fetch: app.fetch,
  port: port,
}, (info) => {
  console.log(`✅ Backend running at http://localhost:${info.port}`)
  console.log(`🔗 Health check: http://localhost:${info.port}/health`)
  console.log(`📡 API info: http://localhost:${info.port}/`)
})