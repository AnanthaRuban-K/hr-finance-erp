// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import employeesRouter from './routes/employees.js';

const app = new Hono();

// CORS middleware - configured for both development and production
const allowedOrigins = [
  'http://localhost:3000', // Development frontend
  'https://erp.sbrosenterpriseerp.com', // Production frontend
];

app.use('/*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Debug middleware - logs all requests (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use('*', async (c, next) => {
    console.log(`${c.req.method} ${c.req.path}`);
    if (c.req.method === 'POST' || c.req.method === 'PUT') {
      console.log('Content-Type:', c.req.header('content-type'));
    }
    await next();
  });
}

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
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
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
console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;