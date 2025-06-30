// apps/backend/src/app.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { appRouter } from './trpc/app-router';
import { createTRPCContext } from './trpc/context';

const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Simple tRPC handler without @hono/trpc-server (since it might not be available)
app.all('/trpc/*', async (c) => {
  try {
    // Basic tRPC handling - you can expand this later
    return c.json({ message: 'tRPC endpoint - implementation needed' });
  } catch (error) {
    console.error('tRPC error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ERP Backend',
    version: '1.0.0'
  });
});

// API info endpoint
app.get('/', (c) => {
  return c.json({
    message: 'HR Finance ERP Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      trpc: '/trpc',
    },
    status: 'running'
  });
});

export { app };