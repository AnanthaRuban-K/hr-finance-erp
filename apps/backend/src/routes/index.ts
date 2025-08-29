import { Hono } from 'hono';
import recruitmentRoutes from './recruitment';
import careersRoutes from './careers';

// Create main router instance
const app = new Hono();