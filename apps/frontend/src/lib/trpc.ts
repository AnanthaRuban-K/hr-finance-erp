// apps/frontend/src/lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { environment } from '../environments/environment';

// Import the AppRouter type from backend
import type { AppRouter } from '../../../backend/src/trpc/app-router';

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient(getToken?: () => Promise<string | null>) {
  return trpc.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: `${environment.apiUrl}/trpc`,
        async headers() {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          
          // Add auth token if available
          if (getToken) {
            try {
              const token = await getToken();
              if (token) {
                headers.Authorization = `Bearer ${token}`;
              }
            } catch (error) {
              console.warn('Failed to get auth token:', error);
            }
          }
          
          return headers;
        },
      }),
    ],
  });
}