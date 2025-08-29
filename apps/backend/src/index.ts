// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';

// Add global error handlers first
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = new Hono();

// Basic CORS configuration that won't fail
const allowedOrigins = [
  'http://localhost:3200',
  'https://erp.sbrosenterpriseerp.com',
  'https://api.sbrosenterpriseerp.com',
  'https://minio-console.sbrosenterpriseerp.com',
];

app.use('/*', cors({
  origin: allowedOrigins,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
}));

// Debug middleware - simplified
app.use('*', async (c, next) => {
  console.log(`${new Date().toISOString()} - ${c.req.method} ${c.req.path}`);
  await next();
});

// Simple health check without MinIO dependencies for now
app.get('/health', async (c) => {
  try {
    return c.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy'
      },
      config: {
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || '3201'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return c.json({ 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Simple main route
app.get('/', async (c) => {
  return c.json({ 
    message: 'HR-Finance ERP Backend API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '3201',
    status: 'running'
  });
});

// Load routes conditionally to avoid import errors
try {
  // Only import if files exist and are properly built
  const employeesRouter = await import('./routes/employees.js').catch(() => null);
  const uploadRouter = await import('./routes/upload.js').catch(() => null);
  
  if (employeesRouter) {
    app.route('/employees', employeesRouter.default);
    console.log('✅ Employee routes loaded');
  } else {
    console.log('⚠️ Employee routes not available');
  }
  
  if (uploadRouter) {
    app.route('/api', uploadRouter.default);
    console.log('✅ Upload routes loaded');
  } else {
    console.log('⚠️ Upload routes not available');
  }
  
} catch (error) {
  console.error('Error loading routes:', error);
  console.log('⚠️ Server will continue with basic routes only');
}

// Load MinIO functions conditionally
let minIOAvailable = false;
try {
  const minioModule = await import('./lib/minio.js').catch(() => null);
  if (minioModule) {
    const { createBucketIfNotExists, testMinIOConnection, checkBucketPolicy, setBucketPublicPolicy } = minioModule;
    minIOAvailable = true;
    
    // Add MinIO routes only if available
    app.get('/init-minio', async (c) => {
      try {
        console.log('Initializing MinIO...');
        const result = await createBucketIfNotExists();
        return c.json({ 
          success: true, 
          message: 'MinIO initialized successfully',
          bucket: 'employee-documents',
          bucketExists: result.bucketExists,
          policySet: result.policySet,
          endpoint: process.env.MINIO_ENDPOINT || 'not-configured'
        });
      } catch (error) {
        console.error('MinIO initialization failed:', error);
        return c.json({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Initialization failed'
        }, 500);
      }
    });

    app.get('/test-minio', async (c) => {
      try {
        const connectionTest = await testMinIOConnection();
        const policyTest = await checkBucketPolicy();
        
        return c.json({
          success: true,
          message: 'MinIO test completed',
          connection: connectionTest,
          policy: {
            exists: !!policyTest,
            details: policyTest
          }
        });
      } catch (error) {
        return c.json({
          success: false,
          error: error instanceof Error ? error.message : 'Test failed'
        }, 500);
      }
    });

    console.log('✅ MinIO integration loaded');
  } else {
    console.log('⚠️ MinIO integration not available');
  }
} catch (error) {
  console.error('MinIO module load error:', error);
  console.log('⚠️ MinIO features disabled');
}

// Global error handler
app.onError((err, c) => {
  console.error('Global error:', err);
  return c.json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    timestamp: new Date().toISOString(),
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not found',
    message: `Route ${c.req.method} ${c.req.path} not found`,
    availableEndpoints: {
      main: 'GET /',
      health: 'GET /health'
    }
  }, 404);
});

const port = parseInt(process.env.PORT || '3201');

// Startup logging
console.log('Starting HR-Finance ERP Backend Server...');
console.log(`Server port: ${port}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`MinIO available: ${minIOAvailable}`);

// Initialize MinIO only if available
if (minIOAvailable) {
  (async () => {
    try {
      console.log('Initializing MinIO on startup...');
      const { createBucketIfNotExists } = await import('./lib/minio.js');
      const result = await createBucketIfNotExists();
      console.log(`MinIO initialization completed: bucket=${result.bucketExists}, policy=${result.policySet}`);
    } catch (error) {
      console.error('MinIO initialization failed:', error);
      console.log('Server will continue without MinIO features');
    }
  })();
}

// Start server with error handling
try {
  serve({
    fetch: app.fetch,
    port,
    hostname: '0.0.0.0', // Important for Docker containers
  });
  
  console.log('Server started successfully!');
  console.log(`Health check available at: http://localhost:${port}/health`);
  
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

export default app;