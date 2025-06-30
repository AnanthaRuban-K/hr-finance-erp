import type { Context } from 'hono';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getAuth } from '@hono/clerk-auth';

export async function createTRPCContext(
  opts: FetchCreateContextFnOptions,
  c: Context
): Promise<{ userId: string | null; sessionId: string | null }> {
  try {
    const auth = getAuth(c);
    return {
      userId: auth?.userId || null,
      sessionId: auth?.sessionId || null,
    };
  } catch (error) {
    console.warn('Failed to get auth context:', error);
    return {
      userId: null,
      sessionId: null,
    };
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;