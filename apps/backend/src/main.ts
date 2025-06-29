import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ 
    message: 'HR & Finance ERP API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ERP Backend'
  });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

console.log(`🚀 Starting ERP Backend on port ${port}`);

serve({
  fetch: app.fetch,
  port: port,
});

console.log(`✅ ERP Backend running on http://localhost:${port}`);