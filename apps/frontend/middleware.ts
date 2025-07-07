import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { UserRole } from '@/types/auth';

interface SessionMetadata {
  role?: UserRole;
  [key: string]: unknown;
}

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/clerk',
  '/api/webhooks(.*)',
]);

// Define auth routes (sign-in, sign-up pages)
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

// Role-based route permissions
const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/admin': [UserRole.ADMIN],
  '/hr': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/finance': [UserRole.ADMIN, UserRole.FINANCE_MANAGER],
  '/supervisor': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR],
  '/employee': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/dashboard': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/employees': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/payroll': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER],
  '/reports': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER],
  '/settings': [UserRole.ADMIN],
};

function getRedirectPath(role: UserRole): string {
  const roleRedirects: Record<UserRole, string> = {
    [UserRole.ADMIN]: '/admin',
    [UserRole.HR_MANAGER]: '/hr',
    [UserRole.FINANCE_MANAGER]: '/finance',
    [UserRole.SUPERVISOR]: '/supervisor',
    [UserRole.EMPLOYEE]: '/employee',
  };
  return roleRedirects[role] || '/dashboard';
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Allow public routes through without any checks
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Get authentication data
  const authData = await auth();
  const { userId, sessionClaims } = authData;

  // Redirect unauthenticated users to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Extract user role from session metadata
  const userRole: UserRole =
    ((sessionClaims?.metadata as SessionMetadata)?.role as UserRole) || UserRole.EMPLOYEE;

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(request)) {
    const redirectPath = getRedirectPath(userRole);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Handle root path redirect for authenticated users
  if (pathname === '/') {
    const redirectPath = getRedirectPath(userRole);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Role-based access control
  for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(routePrefix)) {
      if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard if user doesn't have permission
        const redirectPath = getRedirectPath(userRole);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
      break; // Found matching route, stop checking
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};