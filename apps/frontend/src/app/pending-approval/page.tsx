// File: app/pending-approval/page.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  Mail, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  User,
  Shield
} from 'lucide-react';

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  'admin': 'System Administrator',
  'hr_manager': 'HR Manager',
  'finance_manager': 'Finance Manager',
  'supervisor': 'Team Supervisor',
  'employee': 'Employee',
};

export default function PendingApprovalPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Auto-refresh every 30 seconds to check approval status
  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        await user.reload();
        const publicApproved = user.publicMetadata?.isApproved as boolean | undefined;
        const unsafeApproved = user.unsafeMetadata?.isApproved as boolean | undefined;
        const isApproved = publicApproved || unsafeApproved;
        
        if (isApproved === true) {
          router.push('/dashboard');
        }
        setLastChecked(new Date());
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, router]);

  const handleRefresh = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      await user.reload();
      const publicApproved = user.publicMetadata?.isApproved as boolean | undefined;
      const unsafeApproved = user.unsafeMetadata?.isApproved as boolean | undefined;
      const isApproved = publicApproved || unsafeApproved;
      
      if (isApproved === true) {
        router.push('/dashboard');
      } else {
        setLastChecked(new Date());
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleContactAdmin = () => {
    const subject = 'Account Approval Request';
    const body = `Hello Administrator,

I am waiting for my account to be approved for the HR Finance ERP system.

User Details:
- Name: ${userName}
- Email: ${user?.emailAddresses[0]?.emailAddress || 'Not available'}
- User ID: ${user?.id || 'Not available'}
- Requested Role: ${userRole ? (ROLE_DISPLAY_NAMES[userRole] || userRole) : 'Not specified'}
- Request Date: ${formatDate(requestDate)}

Please approve my account so I can access the system.

Thank you,
${user?.firstName || 'User'}`;

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

  const userRole = (user?.publicMetadata?.role || user?.unsafeMetadata?.role) as string | undefined;
  const userName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';
  const requestDate = (user?.publicMetadata?.roleRequestDate || user?.unsafeMetadata?.roleRequestDate) as string | undefined;

  // Helper function to safely format date
  const formatDate = (dateValue: string | undefined): string => {
    if (!dateValue) return 'Unknown';
    try {
      return new Date(dateValue).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl text-yellow-900">Account Pending Approval</CardTitle>
          <p className="text-gray-600 mt-2">
            Your account is waiting for administrator approval
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
              <span className="text-sm font-medium text-gray-700">Email:</span>
              <span className="text-sm">{user?.emailAddresses[0]?.emailAddress}</span>
            </div>
            
            {userRole && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Requested Role:</span>
                <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                  {ROLE_DISPLAY_NAMES[userRole] || userRole}
                </Badge>
              </div>
            )}

            {requestDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Request Date:</span>
                <span className="text-sm">
                  {formatDate(requestDate)}
                </span>
              </div>
            )}
          </div>

          {/* Status Information */}
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>What's happening?</strong> An administrator needs to review and approve your account 
              before you can access the system. This usually takes 1-2 business days.
            </AlertDescription>
          </Alert>

          {/* Auto-refresh status */}
          <div className="text-center text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Auto-checking for approval every 30 seconds</span>
            </div>
            <p className="mt-1">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Checking Status...' : 'Check Approval Status'}
            </Button>
            
            <Button 
              onClick={handleContactAdmin}
              variant="outline"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Administrator
            </Button>
          </div>

          {/* Development Mode */}
          {process.env.NODE_ENV === 'development' && (
            <div className="pt-4 border-t">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Development Mode:</strong> You can approve yourself using the debug panel.
                </AlertDescription>
              </Alert>
              <div className="flex space-x-2 mt-3">
                <Button 
                  onClick={() => router.push('/debug-user')} 
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Debug Panel
                </Button>
                <Button 
                  onClick={async () => {
                    try {
                      await user?.update({
                        unsafeMetadata: {
                          ...user.unsafeMetadata,
                          isApproved: true,
                          approvedDate: new Date().toISOString(),
                          approvedBy: 'self-dev'
                        }
                      });
                      setTimeout(() => router.push('/dashboard'), 1000);
                    } catch (error) {
                      console.error('Error approving self:', error);
                    }
                  }} 
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Self-Approve
                </Button>
              </div>
            </div>
          )}

          {/* Help Information */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">
              Need immediate access? Contact your administrator at:
            </p>
            <div className="space-y-1">
              <p className="text-sm font-medium">admin@yourcompany.com</p>
              <p className="text-sm text-gray-500">or call: +1 (555) 123-4567</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}