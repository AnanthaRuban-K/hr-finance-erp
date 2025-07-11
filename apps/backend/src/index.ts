// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import employeesRouter from './routes/employees.js';

const app = new Hono();

// CORS middleware - configured for both development and production
app.use('/*', cors({
  origin: [
    'http://localhost:3000', // Development frontend
    'https://erp.sbrosenterpriseerp.com', // Production frontend
  ],
  credentials: true,
}));

// Debug middleware - logs all requests
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.path}`);
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
    environment: process.env.NODE_ENV || 'development'
  });
});

// Employee routes
app.route('/employees', employeesRouter);

// Global error handler
app.onError((err, c) => {
  console.error('Global error:', err);
  return c.json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not found',
    message: `Route ${c.req.method} ${c.req.path} not found`,
  }, 404);
});

const port = parseInt(process.env.PORT || '3001');

console.log(`🚀 Server starting on port ${port}`);
console.log(`📍 Health check: http://localhost:${port}`);
console.log(`👥 Employees API: http://localhost:${port}/employees`);
console.log(`🌐 CORS enabled for: http://localhost:3000, https://erp.sbrosenterpriseerp.com`);
console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;