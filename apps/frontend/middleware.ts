import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { UserRole } from '@/types/auth';

interface SessionMetadata {
  role?: UserRole;
  isApproved?: boolean;
  organizationId?: string;
  [key: string]: unknown;
}

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/clerk',
  '/api/webhooks(.*)',
  '/debug-user', // Development debug page
  '/setup-profile', // Role selection page
  '/unauthorized', // Unauthorized access page
  '/pending-approval', // Pending approval page
]);

// Define auth routes (sign-in, sign-up pages)
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

// Enhanced role-based route permissions with more granular control
const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // Admin routes
  '/admin': [UserRole.ADMIN],
  
  // HR routes
  '/hr': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/hr/recruitment': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/hr/employees': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/hr/onboarding': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/hr/training': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/hr/performance': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR],
  '/hr/exit': [UserRole.ADMIN, UserRole.HR_MANAGER],
  
  // Finance routes
  '/finance': [UserRole.ADMIN, UserRole.FINANCE_MANAGER],
  '/finance/accounts-receivable': [UserRole.ADMIN, UserRole.FINANCE_MANAGER],
  '/finance/accounts-payable': [UserRole.ADMIN, UserRole.FINANCE_MANAGER],
  '/finance/general-ledger': [UserRole.ADMIN, UserRole.FINANCE_MANAGER],
  '/finance/budget': [UserRole.ADMIN, UserRole.FINANCE_MANAGER],
  '/finance/cash-flow': [UserRole.ADMIN, UserRole.FINANCE_MANAGER],
  
  // Payroll routes
  '/payroll': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER],
  '/payroll/processing': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER],
  '/payroll/salary': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER],
  '/payroll/payslips': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER],
  '/payroll/benefits': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/payroll/statutory': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER],
  
  // Time & Attendance routes
  '/attendance': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR],
  '/attendance/leave': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/attendance/leave/approvals': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR],
  '/attendance/holidays': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/attendance/shifts': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR],
  
  // Employee Self-Service routes
  '/employee': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/employee/profile': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/employee/payslips': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/employee/leave': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/employee/attendance': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/employee/expenses': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  
  // Reports & Analytics routes
  '/reports': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR],
  '/reports/financial': [UserRole.ADMIN, UserRole.FINANCE_MANAGER],
  '/reports/hr': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/reports/payroll': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER],
  '/reports/recruitment': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/reports/custom': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER],
  
  // Communication routes
  '/communication': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/communication/announcements': [UserRole.ADMIN, UserRole.HR_MANAGER],
  '/communication/messages': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  
  // Settings routes
  '/settings': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/settings/preferences': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  '/settings/security': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  
  // Dashboard - accessible to all authenticated users
  '/dashboard': [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
};

function getRedirectPath(role: UserRole): string {
  const roleRedirects: Record<UserRole, string> = {
    [UserRole.ADMIN]: '/dashboard',
    [UserRole.HR_MANAGER]: '/dashboard',
    [UserRole.FINANCE_MANAGER]: '/dashboard',
    [UserRole.SUPERVISOR]: '/dashboard',
    [UserRole.EMPLOYEE]: '/dashboard',
  };
  return roleRedirects[role] || '/dashboard';
}

function getUserRole(sessionClaims: any): UserRole | null {
  // Try to get role from different metadata sources
  const publicRole = sessionClaims?.publicMetadata?.role;
  const unsafeRole = sessionClaims?.unsafeMetadata?.role;
  const metadataRole = (sessionClaims?.metadata as SessionMetadata)?.role;
  
  return publicRole || unsafeRole || metadataRole || null;
}

function getUserApprovalStatus(sessionClaims: any): boolean | null {
  // Try to get approval status from different metadata sources
  const publicApproved = sessionClaims?.publicMetadata?.isApproved;
  const unsafeApproved = sessionClaims?.unsafeMetadata?.isApproved;
  const metadataApproved = (sessionClaims?.metadata as SessionMetadata)?.isApproved;
  
  return publicApproved ?? unsafeApproved ?? metadataApproved ?? null;
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

  // Extract user role and approval status from session metadata
  const userRole = getUserRole(sessionClaims);
  const isApproved = getUserApprovalStatus(sessionClaims);

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware Debug:', {
      pathname,
      userId,
      userRole,
      isApproved,
      publicMetadata: sessionClaims?.publicMetadata,
      unsafeMetadata: sessionClaims?.unsafeMetadata
    });
  }

  // Handle users without roles
  if (!userRole) {
    // Allow access to debug page in development
    if (process.env.NODE_ENV === 'development' && pathname === '/debug-user') {
      return NextResponse.next();
    }
    
    // Allow access to setup profile page
    if (pathname === '/setup-profile') {
      return NextResponse.next();
    }
    
    // Redirect to setup profile if no role assigned
    console.warn(`User ${userId} has no role assigned, redirecting to setup-profile`);
    return NextResponse.redirect(new URL('/setup-profile', request.url));
  }

  // Handle users pending approval
  if (isApproved === false) {
    if (pathname === '/pending-approval') {
      return NextResponse.next();
    }
    console.warn(`User ${userId} is not approved, redirecting to pending-approval`);
    return NextResponse.redirect(new URL('/pending-approval', request.url));
  }

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
  let hasAccess = true;
  let requiredRoles: UserRole[] = [];

  // Find the most specific matching route
  const matchingRoutes = Object.keys(ROUTE_PERMISSIONS)
    .filter(routePrefix => pathname.startsWith(routePrefix))
    .sort((a, b) => b.length - a.length); // Sort by length (most specific first)

  if (matchingRoutes.length > 0) {
    const mostSpecificRoute = matchingRoutes[0];
    requiredRoles = ROUTE_PERMISSIONS[mostSpecificRoute];
    hasAccess = requiredRoles.includes(userRole);
  }

  // If user doesn't have access, redirect to unauthorized page
  if (!hasAccess && requiredRoles.length > 0) {
    console.warn(`Access denied for user ${userId}:`, {
      path: pathname,
      userRole,
      requiredRoles,
      isApproved
    });
    
    // Create informative unauthorized URL with query parameters
    const unauthorizedUrl = new URL('/unauthorized', request.url);
    unauthorizedUrl.searchParams.set('path', pathname);
    unauthorizedUrl.searchParams.set('required', requiredRoles.join(','));
    unauthorizedUrl.searchParams.set('current', userRole);
    
    return NextResponse.redirect(unauthorizedUrl);
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