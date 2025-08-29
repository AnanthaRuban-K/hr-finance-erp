// File: app/debug-user/page.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Shield, 
  RefreshCw, 
  Trash2,
  CheckCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

const AVAILABLE_ROLES = [
  { id: 'admin', name: 'System Administrator', color: 'bg-red-500' },
  { id: 'hr_manager', name: 'HR Manager', color: 'bg-blue-500' },
  { id: 'finance_manager', name: 'Finance Manager', color: 'bg-green-500' },
  { id: 'supervisor', name: 'Team Supervisor', color: 'bg-purple-500' },
  { id: 'employee', name: 'Employee', color: 'bg-gray-500' },
];

export default function DebugUserPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const [showRawData, setShowRawData] = useState(false);

  const updateUserRole = async (role: string) => {
    if (!user) return;
    
    setIsUpdating(true);
    setLastAction(`Assigning role: ${role}`);
    
    try {
      // Use the correct Clerk method to update public metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: role,
          isApproved: true,
          assignedDate: new Date().toISOString(),
          assignedBy: 'debug-tool',
          organizationId: 'default-org'
        }
      });
      
      setLastAction(`✅ Successfully assigned role: ${role}`);
      
      // Auto-refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error updating user role:', error);
      
      // Try alternative method using Clerk's backend API
      try {
        const response = await fetch('/api/update-user-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, role, isApproved: true })
        });
        
        if (response.ok) {
          setLastAction(`✅ Successfully assigned role via API: ${role}`);
          setTimeout(() => window.location.reload(), 2000);
        } else {
          throw new Error('API request failed');
        }
      } catch (apiError) {
        setLastAction(`❌ Error assigning role: ${error}`);
        console.error('API error:', apiError);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const clearRole = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    setLastAction('Clearing role...');
    
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: undefined,
          isApproved: undefined,
          assignedDate: undefined,
          assignedBy: undefined,
        }
      });
      
      setLastAction('✅ Role cleared successfully');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error clearing role:', error);
      setLastAction(`❌ Error clearing role: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    setLastAction('Refreshing user data...');
    
    try {
      await user.reload();
      setLastAction('✅ User data refreshed');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setLastAction(`❌ Error refreshing: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setLastAction('📋 Copied to clipboard');
  };

  const testRouteAccess = (path: string) => {
    router.push(path);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No user found. Please sign in first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Try to get role from both publicMetadata and unsafeMetadata
  const currentRole = (user.publicMetadata?.role || user.unsafeMetadata?.role) as string;
  const isApproved = (user.publicMetadata?.isApproved || user.unsafeMetadata?.isApproved) as boolean;

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">User Debug Panel</h1>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Development Only
          </Badge>
        </div>
        
        <Button onClick={() => router.push('/dashboard')} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      {/* Warning */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Warning:</strong> This debug panel should only be used in development. 
          It allows direct modification of user roles and permissions.
        </AlertDescription>
      </Alert>

      {/* Instructions */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Instructions:</strong> If role assignment fails, you may need to create an API route 
          at <code>/api/update-user-role</code> or use the browser console method below.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>User Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">User ID:</label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">
                    {user.id}
                  </code>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => copyToClipboard(user.id)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email:</label>
                <p className="text-sm mt-1">{user.emailAddresses[0]?.emailAddress}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Name:</label>
                <p className="text-sm mt-1">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Current Role:</label>
                <div className="mt-1">
                  {currentRole ? (
                    <Badge className={`${AVAILABLE_ROLES.find(r => r.id === currentRole)?.color} text-white`}>
                      {AVAILABLE_ROLES.find(r => r.id === currentRole)?.name}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      No Role Assigned
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Approved:</label>
                <div className="mt-1">
                  <Badge variant={isApproved ? "default" : "outline"}>
                    {isApproved ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Organization:</label>
                <p className="text-sm mt-1">
                  {(user.publicMetadata?.organizationId || user.unsafeMetadata?.organizationId) as string || 'Not Set'}
                </p>
              </div>
            </div>

            {/* Raw Metadata */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Metadata:
                </label>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setShowRawData(!showRawData)}
                >
                  {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {showRawData && (
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Public Metadata:</p>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
                      {JSON.stringify(user.publicMetadata, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Unsafe Metadata:</p>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
                      {JSON.stringify(user.unsafeMetadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Role Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Assign Role:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {AVAILABLE_ROLES.map((role) => (
                  <Button
                    key={role.id}
                    onClick={() => updateUserRole(role.id)}
                    disabled={isUpdating}
                    variant={currentRole === role.id ? "default" : "outline"}
                    className={`justify-start ${currentRole === role.id ? role.color : ''}`}
                    size="sm"
                  >
                    {currentRole === role.id && <CheckCircle className="w-4 h-4 mr-2" />}
                    {role.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={clearRole}
                disabled={isUpdating}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Role
              </Button>
              
              <Button
                onClick={refreshUser}
                disabled={isUpdating}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                Refresh User Data
              </Button>
            </div>

            {/* Status */}
            {lastAction && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-mono">{lastAction}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Browser Console Alternative */}
      <Card>
        <CardHeader>
          <CardTitle>Browser Console Method (Alternative)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            If the above buttons don't work, copy and paste this code in your browser console (F12):
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <code className="text-xs block whitespace-pre-wrap">
{`// To assign HR Manager role:
window.Clerk?.user?.update({
  unsafeMetadata: {
    role: 'hr_manager',
    isApproved: true,
    organizationId: 'default-org'
  }
}).then(() => {
  console.log('Role updated successfully');
  window.location.reload();
});

// To assign Admin role:
window.Clerk?.user?.update({
  unsafeMetadata: {
    role: 'admin',
    isApproved: true,
    organizationId: 'default-org'
  }
}).then(() => {
  console.log('Role updated successfully');
  window.location.reload();
});`}
            </code>
          </div>
          <Button 
            onClick={() => copyToClipboard(`window.Clerk?.user?.update({
  unsafeMetadata: {
    role: 'hr_manager',
    isApproved: true,
    organizationId: 'default-org'
  }
}).then(() => {
  console.log('Role updated successfully');
  window.location.reload();
});`)}
            size="sm"
            variant="outline"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy HR Manager Code
          </Button>
        </CardContent>
      </Card>

      {/* Route Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Test Route Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button 
              onClick={() => testRouteAccess('/admin')} 
              variant="outline" 
              size="sm"
            >
              Admin Panel
            </Button>
            <Button 
              onClick={() => testRouteAccess('/hr/recruitment')} 
              variant="outline" 
              size="sm"
            >
              Recruitment
            </Button>
            <Button 
              onClick={() => testRouteAccess('/finance')} 
              variant="outline" 
              size="sm"
            >
              Finance
            </Button>
            <Button 
              onClick={() => testRouteAccess('/payroll')} 
              variant="outline" 
              size="sm"
            >
              Payroll
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click to test access to different routes with your current role
          </p>
        </CardContent>
      </Card>
    </div>
  );
}