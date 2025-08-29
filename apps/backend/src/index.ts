// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import employeesRouter from './routes/employees.js';
import uploadRouter from './routes/upload.js';
import { trpcServer } from '@hono/trpc-server';
import { 
  createBucketIfNotExists, 
  testMinIOConnection,
  checkBucketPolicy,
  setBucketPublicPolicy 
} from './lib/minio.js';

const app = new Hono();

// ✅ Updated CORS configuration with correct frontend URL
const allowedOrigins = [
  'http://localhost:3200', // Development frontend
  'https://erp.sbrosenterpriseerp.com', // Production frontend
  'https://api.sbrosenterpriseerp.com', // Backend API
  'https://minio-console.sbrosenterpriseerp.com', // MinIO Console
];

// ✅ Enhanced CORS configuration
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

// ✅ Enhanced health check with MinIO status
app.get('/health', async (c) => {
  try {
    // Test MinIO connection
    const minioStatus = await testMinIOConnection();
    
    // Initialize bucket if needed
    if (minioStatus.connected && !minioStatus.bucketExists) {
      console.log('🔧 Initializing MinIO bucket...');
      await createBucketIfNotExists();
    }
    
    return c.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        minio: minioStatus.connected ? 'healthy' : 'unhealthy',
        bucket: minioStatus.bucketExists ? 'exists' : 'missing',
        policy: minioStatus.hasPolicy ? 'configured' : 'not-set'
      },
      config: {
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || '3001',
        minioEndpoint: process.env.MINIO_ENDPOINT || 'not-configured',
        bucketName: process.env.MINIO_BUCKET_NAME || 'employee-documents'
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

// ✅ Main route with enhanced info
app.get('/', async (c) => {
  try {
    const minioStatus = await testMinIOConnection();
    
    return c.json({ 
      message: 'HR-Finance ERP Backend API is running! 🚀',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || '3201',
      services: {
        api: 'running',
        minio: minioStatus.connected ? 'connected' : 'disconnected',
        bucket: minioStatus.bucketExists ? 'ready' : 'not-found'
      },
      endpoints: {
        health: 'GET /health',
        minioInit: 'GET /init-minio',
        minioTest: 'GET /test-minio',
        upload: 'POST /api/upload',
        download: 'GET /api/download/:employeeId/:documentType/:fileName',
        delete: 'DELETE /api/delete/:employeeId/:documentType/:fileName',
        employees: '/employees/* (existing employee routes)'
      },
      urls: {
        frontend: 'https://erp.sbrosenterpriseerp.com',
        api: 'https://api.sbrosenterpriseerp.com',
        minioConsole: 'https://minio-console.sbrosenterpriseerp.com',
        minioApi: process.env.MINIO_ENDPOINT || 'not-configured'
      }
    });
  } catch (error) {
    return c.json({ 
      message: 'HR-Finance ERP Backend API is running! 🚀',
      timestamp: new Date().toISOString(),
      error: 'MinIO connection check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ✅ NEW: MinIO initialization endpoint
app.get('/init-minio', async (c) => {
  try {
    console.log('🔧 Initializing MinIO...');
    const result = await createBucketIfNotExists();
    
    return c.json({ 
      success: true, 
      message: 'MinIO initialized successfully ✅',
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

// ✅ NEW: MinIO connection test endpoint
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
      },
      credentials: {
        accessKey: process.env.MINIO_ACCESS_KEY ? '✅ Configured' : '❌ Missing',
        secretKey: process.env.MINIO_SECRET_KEY ? '✅ Configured' : '❌ Missing',
        endpoint: process.env.MINIO_ENDPOINT || '❌ Not configured'
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
      credentials: {
        accessKey: process.env.MINIO_ACCESS_KEY ? '✅ Configured' : '❌ Missing',
        secretKey: process.env.MINIO_SECRET_KEY ? '✅ Configured' : '❌ Missing',
        endpoint: process.env.MINIO_ENDPOINT || '❌ Not configured'
      }
    }, 500);
  }
});

// ✅ NEW: Set bucket policy endpoint
app.get('/set-bucket-policy', async (c) => {
  try {
    console.log('🔧 Setting bucket policy...');
    const policySet = await setBucketPublicPolicy();
    const currentPolicy = await checkBucketPolicy();
    
    return c.json({
      success: true,
      message: 'Bucket policy configured ✅',
      policySet: policySet,
      currentPolicy: currentPolicy
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Policy setup failed'
    }, 500);
  }
});

// ✅ Upload routes (MinIO integration)
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
    timestamp: new Date().toISOString(),
  }, 500);
});

// 404 handler
app.notFound((c) => {
  console.log(`❌ 404 Not Found: ${c.req.method} ${c.req.path}`);
  return c.json({
    success: false,
    error: 'Not found',
    message: `Route ${c.req.method} ${c.req.path} not found`,
    availableEndpoints: {
      main: 'GET /',
      health: 'GET /health',
      minioInit: 'GET /init-minio',
      minioTest: 'GET /test-minio',
      setBucketPolicy: 'GET /set-bucket-policy',
      upload: 'POST /api/upload',
      download: 'GET /api/download/:employeeId/:documentType/:fileName',
      delete: 'DELETE /api/delete/:employeeId/:documentType/:fileName',
      employees: '/employees/* (existing routes)'
    }
  }, 404);
});

const port = parseInt(process.env.PORT || '3201');

// ✅ Enhanced startup logging
console.log('🚀 Starting HR-Finance ERP Backend Server...');
console.log('===============================================');
console.log(`🌐 Server port: ${port}`);
console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🌍 CORS enabled for: ${allowedOrigins.join(', ')}`);
console.log(`📊 Database configured: ${process.env.DATABASE_URL ? '✅ Yes' : '❌ No'}`);

// ✅ MinIO configuration check
console.log('\n📁 MinIO Configuration:');
console.log(`   Access Key: ${process.env.MINIO_ACCESS_KEY ? '✅ Configured' : '❌ Missing'}`);
console.log(`   Secret Key: ${process.env.MINIO_SECRET_KEY ? '✅ Configured' : '❌ Missing'}`);
console.log(`   Endpoint: ${process.env.MINIO_ENDPOINT || '❌ Not configured'}`);
console.log(`   Bucket: ${process.env.MINIO_BUCKET_NAME || 'employee-documents (default)'}`);

// ✅ Available endpoints
console.log('\n📋 Available Endpoints:');
console.log('   Main Routes:');
console.log('     GET  / - API info and status');
console.log('     GET  /health - Health check with MinIO status');
console.log('   MinIO Management:');
console.log('     GET  /init-minio - Initialize MinIO bucket');
console.log('     GET  /test-minio - Test MinIO connection');
console.log('     GET  /set-bucket-policy - Configure bucket policy');
console.log('   File Operations:');
console.log('     POST /api/upload - Upload employee documents');
console.log('     GET  /api/download/:employeeId/:documentType/:fileName');
console.log('     DELETE /api/delete/:employeeId/:documentType/:fileName');
console.log('   Employee Management:');
console.log('     *    /employees/* - Employee CRUD operations');

console.log('\n🌐 Service URLs:');
console.log(`   Frontend: https://erp.sbrosenterpriseerp.com`);
console.log(`   Backend:  https://api.sbrosenterpriseerp.com`);
console.log(`   MinIO Console: https://minio-console.sbrosenterpriseerp.com`);
console.log(`   MinIO API: ${process.env.MINIO_ENDPOINT || 'Not configured'}`);

// ✅ Initialize MinIO on startup
(async () => {
  try {
    console.log('\n🔧 Initializing MinIO on startup...');
    const result = await createBucketIfNotExists();
    console.log(`✅ MinIO initialization completed`);
    console.log(`   Bucket exists: ${result.bucketExists}`);
    console.log(`   Policy set: ${result.policySet}`);
  } catch (error) {
    console.error('❌ MinIO initialization failed:', error);
    console.log('⚠️  Server will continue, but file uploads may not work');
  }
})();

console.log('\n===============================================');
console.log('✅ Server started successfully!');

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0', // Important for Docker containers
});

export default app;