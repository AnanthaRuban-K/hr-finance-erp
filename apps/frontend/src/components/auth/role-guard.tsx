'use client';

import { useUser } from '@clerk/nextjs';
import { UserRole, Permission } from '@/types/auth';
import { hasPermission, hasAnyPermission } from '@/lib/auth/roles';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  loadingVariant?: 'skeleton' | 'spinner' | 'pulse' | 'dots' | 'shimmer';
  className?: string;
}

// Modern Loading Components
const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse space-y-3", className)}>
    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md bg-[length:200%_100%] animate-shimmer"></div>
    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md bg-[length:200%_100%] animate-shimmer w-3/4"></div>
    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md bg-[length:200%_100%] animate-shimmer w-1/2"></div>
  </div>
);

const SpinnerLoader = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center", className)}>
    <div className="relative">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-r-primary/40 rounded-full animate-spin animate-reverse delay-150"></div>
    </div>
  </div>
);

const PulseLoader = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center space-x-2", className)}>
    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
    <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-75"></div>
    <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150"></div>
  </div>
);

const DotsLoader = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center space-x-1", className)}>
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
  </div>
);

const ShimmerLoader = ({ className }: { className?: string }) => (
  <div className={cn("relative overflow-hidden bg-gray-200 rounded-lg h-20", className)}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
  </div>
);

const ModernLoadingCard = ({ 
  variant = 'spinner', 
  className 
}: { 
  variant?: 'skeleton' | 'spinner' | 'pulse' | 'dots' | 'shimmer';
  className?: string;
}) => {
  const LoaderComponent = {
    skeleton: SkeletonLoader,
    spinner: SpinnerLoader,
    pulse: PulseLoader,
    dots: DotsLoader,
    shimmer: ShimmerLoader
  }[variant];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-6 min-h-[120px]",
      "bg-gradient-to-br from-background to-muted/30",
      "border border-border/50 rounded-xl shadow-sm",
      "backdrop-blur-sm",
      className
    )}>
      <LoaderComponent className="mb-3" />
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground/80">
          Loading...
        </p>
        <p className="text-xs text-muted-foreground">
          Verifying permissions
        </p>
      </div>
    </div>
  );
};

export function RoleGuard({
  children,
  allowedRoles,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  fallback = null,
  loadingVariant = 'spinner',
  className
}: RoleGuardProps) {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return (
      <ModernLoadingCard 
        variant={loadingVariant} 
        className={className}
      />
    );
  }
  
  if (!user) {
    return fallback;
  }
  
  const userRole = (user.publicMetadata?.role as UserRole) || UserRole.EMPLOYEE;
  
  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return fallback;
  }
  
  // Check single permission
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return fallback;
  }
  
  // Check multiple permissions
  if (requiredPermissions) {
    const hasAccess = requireAll 
      ? requiredPermissions.every(permission => hasPermission(userRole, permission))
      : hasAnyPermission(userRole, requiredPermissions);
      
    if (!hasAccess) {
      return fallback;
    }
  }
  
  return <>{children}</>;
}