import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const healthRouter = router({
  check: publicProcedure
    .query(() => {
      return {
        status: 'ok' as const,
        timestamp: new Date().toISOString(),
        service: 'ERP Backend',
      };
    }),
});