import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const authRouter = router({
  getUser: protectedProcedure
    .query(({ ctx }) => {
      return {
        userId: ctx.userId,
        message: 'User authenticated successfully',
      };
    }),
    
  ping: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(({ input }) => {
      return {
        message: `Pong: ${input.message}`,
        timestamp: new Date().toISOString(),
      };
    }),
});