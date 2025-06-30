// apps/backend/src/app.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { clerkMiddleware } from '@hono/clerk-auth';
import { trpcServer } from '@hono/trpc-server';
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

// Clerk authentication middleware
app.use('*', clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
}));

// tRPC endpoint with proper context
app.use('/trpc/*', (c, next) => {
  return trpcServer({
    router: appRouter,
    createContext: (opts) => createTRPCContext(opts, c),
  })(c, next);
});

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ERP Backend'
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
    }
  });
});

export { app };