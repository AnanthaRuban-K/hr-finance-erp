'use client';

import { useUser } from '@clerk/nextjs';
import { UserRole, Permission } from '@/types/auth';
import { hasPermission, hasAnyPermission } from '@/lib/auth/roles';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Shield, Lock, AlertTriangle, Clock, Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  loadingVariant?: 'skeleton' | 'spinner' | 'pulse' | 'dots' | 'shimmer';
  className?: string;
  showAccessDenied?: boolean;
  customMessage?: string;
}

// Enhanced Loading Components with modern design
const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse space-y-3", className)}>
    {[...Array(3)].map((_, i) => (
      <div 
        key={i}
        className={cn(
          "h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md",
          "bg-[length:200%_100%] animate-shimmer",
          i === 1 && "w-3/4",
          i === 2 && "w-1/2"
        )}
      />
    ))}
  </div>
);

const SpinnerLoader = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center", className)}>
    <div className="relative">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-r-primary/40 rounded-full animate-spin animate-reverse delay-150"></div>
    </div>
  </div>
);

const PulseLoader = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center space-x-2", className)}>
    {[...Array(3)].map((_, i) => (
      <div 
        key={i}
        className={cn(
          "w-3 h-3 bg-primary rounded-full animate-pulse",
          i === 1 && "delay-75",
          i === 2 && "delay-150"
        )}
      />
    ))}
  </div>
);

const DotsLoader = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center space-x-1", className)}>
    {[...Array(3)].map((_, i) => (
      <div 
        key={i}
        className={cn(
          "w-2 h-2 bg-primary rounded-full animate-bounce",
          i === 1 && "delay-100",
          i === 2 && "delay-200"
        )}
      />
    ))}
  </div>
);

const ShimmerLoader = ({ className }: { className?: string }) => (
  <div className={cn("relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg h-20", className)}>
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
      "flex flex-col items-center justify-center p-8 min-h-[160px]",
      "bg-gradient-to-br from-background via-background to-muted/20",
      "border border-border/50 rounded-xl shadow-sm",
      "backdrop-blur-sm transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
        <Clock className="w-6 h-6 text-primary" />
      </div>
      <LoaderComponent className="mb-4" />
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-foreground/90">
          Loading...
        </p>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          Verifying your permissions and access rights
        </p>
      </div>
    </div>
  );
};

const AccessDeniedCard = ({ 
  message, 
  userRole,
  className 
}: { 
  message?: string;
  userRole?: UserRole;
  className?: string;
}) => {
  const roleNames = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.HR_MANAGER]: 'HR Manager', 
    [UserRole.FINANCE_MANAGER]: 'Finance Manager',
    [UserRole.SUPERVISOR]: 'Supervisor',
    [UserRole.EMPLOYEE]: 'Employee'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 min-h-[200px]",
      "bg-gradient-to-br from-red-50/50 via-background to-red-50/30",
      "border border-red-200/50 rounded-xl shadow-sm",
      "backdrop-blur-sm",
      className
    )}>
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <Shield className="w-8 h-8 text-red-600" />
      </div>
      
      <div className="text-center space-y-3 max-w-sm">
        <h3 className="text-lg font-semibold text-red-900">
          Access Restricted
        </h3>
        
        <p className="text-sm text-red-700">
          {message || "You don't have permission to view this content."}
        </p>
        
        {userRole && (
          <div className="flex items-center justify-center space-x-2 mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <Lock className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-red-800">
              Current Role: {roleNames[userRole]}
            </span>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-4">
          Contact your administrator if you believe this is an error
        </p>
      </div>
    </div>
  );
};

const UnauthorizedCard = ({ className }: { className?: string }) => (
  <div className={cn(
    "flex flex-col items-center justify-center p-8 min-h-[180px]",
    "bg-gradient-to-br from-orange-50/50 via-background to-orange-50/30",
    "border border-orange-200/50 rounded-xl shadow-sm",
    "backdrop-blur-sm",
    className
  )}>
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
      <AlertTriangle className="w-8 h-8 text-orange-600" />
    </div>
    
    <div className="text-center space-y-3">
      <h3 className="text-lg font-semibold text-orange-900">
        Authentication Required
      </h3>
      
      <p className="text-sm text-orange-700 max-w-sm">
        Please sign in to access this content
      </p>
      
      <p className="text-xs text-muted-foreground">
        You'll be redirected to the login page shortly
      </p>
    </div>
  </div>
);

export function RoleGuard({
  children,
  allowedRoles,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  fallback = null,
  loadingVariant = 'spinner',
  className,
  showAccessDenied = true,
  customMessage
}: RoleGuardProps) {
  const { user, isLoaded } = useUser();
  
  // Loading state with enhanced UI
  if (!isLoaded) {
    return (
      <ModernLoadingCard 
        variant={loadingVariant} 
        className={className}
      />
    );
  }
  
  // Not authenticated
  if (!user) {
    if (fallback) return <>{fallback}</>;
    return showAccessDenied ? <UnauthorizedCard className={className} /> : null;
  }
  
  const userRole = (user.publicMetadata?.role as UserRole) || UserRole.EMPLOYEE;
  
  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (fallback) return <>{fallback}</>;
    return showAccessDenied ? (
      <AccessDeniedCard 
        message={customMessage || `This feature requires ${allowedRoles.join(', ')} access level.`}
        userRole={userRole}
        className={className}
      />
    ) : null;
  }
  
  // Check single permission
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    if (fallback) return <>{fallback}</>;
    return showAccessDenied ? (
      <AccessDeniedCard 
        message={customMessage || `This action requires '${requiredPermission}' permission.`}
        userRole={userRole}
        className={className}
      />
    ) : null;
  }
  
  // Check multiple permissions
  if (requiredPermissions) {
    const hasAccess = requireAll 
      ? requiredPermissions.every(permission => hasPermission(userRole, permission))
      : hasAnyPermission(userRole, requiredPermissions);
      
    if (!hasAccess) {
      if (fallback) return <>{fallback}</>;
      return showAccessDenied ? (
        <AccessDeniedCard 
          message={customMessage || `This feature requires ${requireAll ? 'all of' : 'one of'} the following permissions: ${requiredPermissions.join(', ')}.`}
          userRole={userRole}
          className={className}
        />
      ) : null;
    }
  }
  
  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminOnly({ children, fallback, className }: { 
  children: ReactNode; 
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <RoleGuard 
      allowedRoles={[UserRole.ADMIN]} 
      fallback={fallback}
      className={className}
      customMessage="Administrator access required for this feature."
    >
      {children}
    </RoleGuard>
  );
}

export function HRManagerOnly({ children, fallback, className }: { 
  children: ReactNode; 
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <RoleGuard 
      allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER]} 
      fallback={fallback}
      className={className}
      customMessage="HR Manager access required for this feature."
    >
      {children}
    </RoleGuard>
  );
}

export function FinanceManagerOnly({ children, fallback, className }: { 
  children: ReactNode; 
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <RoleGuard 
      allowedRoles={[UserRole.ADMIN, UserRole.FINANCE_MANAGER]} 
      fallback={fallback}
      className={className}
      customMessage="Finance Manager access required for this feature."
    >
      {children}
    </RoleGuard>
  );
}

export function SupervisorAndAbove({ children, fallback, className }: { 
  children: ReactNode; 
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <RoleGuard 
      allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR]} 
      fallback={fallback}
      className={className}
      customMessage="Supervisor level access or higher required."
    >
      {children}
    </RoleGuard>
  );
}