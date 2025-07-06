// middleware.ts

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected and public routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/employees(.*)',
  '/payroll(.*)',
  '/reports(.*)',
  '/settings(.*)',
  '/api/trpc(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/clerk',
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    // ✅ Allow public routes
    return;
  }

  if (isProtectedRoute(req)) {
    // ✅ Clerk will automatically block unauthorized requests
    // ⛔ NO `auth().protect()` needed!
    return;
  }

  // For all other routes, do nothing
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
