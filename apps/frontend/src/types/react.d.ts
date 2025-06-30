// apps/frontend/src/types/react.d.ts
import 'react';

declare module 'react' {
  // Extend ReactNode to include bigint
  type ReactNode =
    | React.ReactElement
    | string
    | number
    | bigint
    | React.ReactFragment
    | React.ReactPortal
    | boolean
    | null
    | undefined;
}

// apps/frontend/src/types/global.d.ts
import type { Clerk } from '@clerk/types';

declare global {
  interface Window {
    Clerk?: Clerk;
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_FRONTEND_URL: string;
      DATABASE_URL: string;
    }
  }
}

export {};