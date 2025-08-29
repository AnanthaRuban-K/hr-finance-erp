// File: app/unauthorized/page.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Mail, 
  Shield, 
  Home,
  RefreshCw,
  Info
} from 'lucide-react';

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  'admin': 'System Administrator',
  'hr_manager': 'HR Manager',
  'finance_manager': 'Finance Manager',
  'supervisor': 'Team Supervisor',
  'employee': 'Employee',
};

const ROLE_COLORS: Record<string, string> = {
  'admin': 'bg-red-500',
  'hr_manager': 'bg-blue-500',
  'finance_manager': 'bg-green-500',
  'supervisor': 'bg-purple-500',
  'employee': 'bg-gray-500',
};

export default function UnauthorizedPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get parameters from URL
  const attemptedPath = searchParams.get('path') || 'this page';
  const requiredRoles = searchParams.get('required')?.split(',') || [];
  const currentRole = searchParams.get('current');

  // User info
  const userRole = (user?.publicMetadata?.role as string) || currentRole;
  const userName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';
  const isApproved = user?.publicMetadata?.isApproved as boolean;

  // Auto-redirect if user gets proper permissions
  useEffect(() => {
    if (isLoaded && user && userRole && requiredRoles.includes(userRole)) {
      setTimeout(() => {
        router.push(attemptedPath === 'this page' ? '/dashboard' : attemptedPath);
      }, 2000);
    }
  }, [isLoaded, user, userRole, requiredRoles, attemptedPath, router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Force refresh user data
      await user?.reload();
      
      // Check if user now has access
      const updatedRole = user?.publicMetadata?.role as string;
      if (updatedRole && requiredRoles.includes(updatedRole)) {
        router.push(attemptedPath === 'this page' ? '/dashboard' : attemptedPath);
      } else {
        // Just refresh the page to update the display
        window.location.reload();
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRequestAccess = () => {
    const subject = `Access Request for ${attemptedPath}`;
    const body = `Hello,

I need access to: ${attemptedPath}
My current role: ${userRole || 'Not assigned'}
Required roles: ${requiredRoles.join(', ')}
User ID: ${user?.id}
Email: ${user?.emailAddresses[0]?.emailAddress}

Please grant me the necessary permissions.

Thank you,
${userName}`;

    const mailtoLink = `mailto:admin@yourcompany.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-25 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">Access Denied</CardTitle>
          <p className="text-gray-600 mt-2">
            You don't have permission to access this resource
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* User Information */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">User:</span>
              <span className="font-semibold">{userName}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Current Role:</span>
              {userRole ? (
                <Badge 
                  className={`${ROLE_COLORS[userRole] || 'bg-gray-500'} text-white`}
                >
                  {ROLE_DISPLAY_NAMES[userRole] || userRole}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  No Role Assigned
                </Badge>
              )}
            </div>

            {isApproved === false && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  Pending Approval
                </Badge>
              </div>
            )}
          </div>

          {/* Access Requirements */}
          {requiredRoles.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-900">
                    Required Access Level:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {requiredRoles.map((role) => (
                      <Badge 
                        key={role}
                        variant="outline" 
                        className="text-blue-700 border-blue-300"
                      >
                        {ROLE_DISPLAY_NAMES[role] || role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Path Information */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Attempted to access: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{attemptedPath}</code>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => router.back()} 
                variant="outline" 
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              
              <Button 
                onClick={() => router.push('/dashboard')} 
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleRefresh}
                variant="outline" 
                className="w-full"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                onClick={handleRequestAccess}
                variant="outline" 
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Request Access
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">
              If you believe this is an error, please contact your administrator
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 font-medium mb-2">
                  🚧 Development Mode
                </p>
                <p className="text-xs text-yellow-700">
                  Visit <code>/debug-user</code> to assign roles for testing
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}