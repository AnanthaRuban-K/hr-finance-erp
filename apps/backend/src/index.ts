// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import employeesRouter from './routes/employees.js';
import uploadRouter from './routes/upload.js'; // ✅ NEW: Import upload routes
import { trpcServer } from '@hono/trpc-server';

const app = new Hono();

// ✅ FIX: Updated CORS configuration with correct frontend URL
const allowedOrigins = [
  'http://localhost:3000', // Development frontend
  'https://erp.sbrosenterpriseerp.com', // ✅ FIXED: Correct production frontend URL
  'https://api.sbrosenterpriseerp.com', // Allow direct IP access for testing
];

// ✅ FIX: Correct CORS configuration with proper property names
app.use('/*', cors({
  origin: allowedOrigins,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
}));

// Debug middleware - logs all requests
app.use('*', async (c, next) => {
  console.log(`${new Date().toISOString()} - ${c.req.method} ${c.req.path}`);
  console.log('Origin:', c.req.header('origin'));
  if (c.req.method === 'POST' || c.req.method === 'PUT') {
    console.log('Content-Type:', c.req.header('content-type'));
  }
  await next();
});

// Health check
app.get('/', (c) => {
  return c.json({ 
    message: 'HR Backend API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '3001',
    // ✅ NEW: Show available routes
    routes: [
      'GET /',
      'GET /health',
      'POST /api/upload',
      'DELETE /api/delete/:employeeId/:documentType/:fileName',
      'GET /api/download/:employeeId/:documentType/:fileName',
      'GET /api/test',
      '/employees/* (existing employee routes)'
    ]
  });
});

// Health check specifically for Coolify
app.get('/health', (c) => {
  return c.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ✅ NEW: MinIO Upload routes
app.route('/api', uploadRouter);

// Employee routes (existing)
app.route('/employees', employeesRouter);

// Global error handler
app.onError((err, c) => {
  console.error('Global error:', err);
  return c.json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  }, 500);
});

// 404 handler
app.notFound((c) => {
  console.log(`❌ 404 Not Found: ${c.req.method} ${c.req.path}`); // ✅ NEW: Better logging
  return c.json({
    success: false,
    error: 'Not found',
    message: `Route ${c.req.method} ${c.req.path} not found`,
    availableRoutes: [
      'GET /',
      'GET /health', 
      'POST /api/upload',
      'GET /api/test',
      '/employees/*'
    ]
  }, 404);
});

const port = parseInt(process.env.PORT || '3001');

console.log(`🚀 Server starting on port ${port}`);
console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📊 Database URL configured: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
console.log(`📁 MinIO configured: ${process.env.MINIO_ACCESS_KEY ? 'Yes' : 'No'}`); // ✅ NEW: MinIO check

// ✅ NEW: Log available routes
console.log(`📋 Available routes:`);
console.log(`   GET  /`);
console.log(`   GET  /health`);
console.log(`   POST /api/upload`);
console.log(`   GET  /api/test`);
console.log(`   DELETE /api/delete/:employeeId/:documentType/:fileName`);
console.log(`   GET  /api/download/:employeeId/:documentType/:fileName`);
console.log(`   *    /employees/* (existing routes)`);

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0', // ✅ Important for Docker containers
});

export default app;