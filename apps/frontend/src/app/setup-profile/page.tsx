// File: app/setup-profile/page.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserPlus, 
  Mail, 
  Clock,
  CheckCircle,
  AlertCircle,
  Crown,
  Users,
  DollarSign,
  ClipboardList,
  User
} from 'lucide-react';

const AVAILABLE_ROLES = [
  {
    id: 'employee',
    name: 'Employee',
    description: 'Access to personal information, leave requests, and payslips',
    icon: User,
    color: 'bg-gray-500',
    permissions: ['Self-service portal', 'Leave applications', 'View payslips', 'Update profile']
  },
  {
    id: 'supervisor',
    name: 'Team Supervisor',
    description: 'Manage team members, approve leaves, and view team reports',
    icon: ClipboardList,
    color: 'bg-purple-500',
    permissions: ['Team management', 'Leave approvals', 'Team reports', 'Performance reviews']
  },
  {
    id: 'hr_manager',
    name: 'HR Manager',
    description: 'Full HR operations including recruitment and employee management',
    icon: Users,
    color: 'bg-blue-500',
    permissions: ['Employee management', 'Recruitment', 'Training', 'Performance management']
  },
  {
    id: 'finance_manager',
    name: 'Finance Manager',
    description: 'Financial operations, payroll processing, and budget management',
    icon: DollarSign,
    color: 'bg-green-500',
    permissions: ['Financial operations', 'Payroll processing', 'Budget management', 'Reports']
  },
  {
    id: 'admin',
    name: 'System Administrator',
    description: 'Full system access with all administrative privileges',
    icon: Crown,
    color: 'bg-red-500',
    permissions: ['Full system access', 'User management', 'System configuration', 'All modules']
  }
];

export default function SetupProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleRoleRequest = async () => {
    if (!selectedRole || !user) return;

    setIsSubmitting(true);
    try {
      // Store the role request in unsafeMetadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          requestedRole: selectedRole,
          roleRequestDate: new Date().toISOString(),
          roleRequestStatus: 'pending'
        }
      });

      setRequestSubmitted(true);
      
      // You can also send a notification to admins here
      // Example: Send email or create a notification record
      
    } catch (error) {
      console.error('Error requesting role:', error);
      
      // Fallback: Try to create an API request
      try {
        const response = await fetch('/api/role-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            requestedRole: selectedRole,
            userName: `${user.firstName} ${user.lastName}`
          })
        });
        
        if (response.ok) {
          setRequestSubmitted(true);
        } else {
          throw new Error('API request failed');
        }
      } catch (apiError) {
        console.error('API request failed, using localStorage fallback');
        
        // Fallback: Store in localStorage for admin to see
        const requests = JSON.parse(localStorage.getItem('roleRequests') || '[]');
        requests.push({
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          requestedRole: selectedRole,
          userName: `${user.firstName} ${user.lastName}`,
          requestDate: new Date().toISOString()
        });
        localStorage.setItem('roleRequests', JSON.stringify(requests));
        setRequestSubmitted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelfAssignForDev = async () => {
    if (!selectedRole || !user) return;

    setIsSubmitting(true);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: selectedRole,
          isApproved: true,
          assignedDate: new Date().toISOString(),
          assignedBy: 'self-dev'
        }
      });

      // Redirect to dashboard after successful assignment
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Error assigning role:', error);
      
      // Show browser console instructions
      alert(`Failed to assign role automatically. Please use the browser console method:

1. Press F12 to open browser console
2. Copy and paste this code:

window.Clerk?.user?.update({
  unsafeMetadata: {
    role: '${selectedRole}',
    isApproved: true,
    organizationId: 'default-org'
  }
}).then(() => {
  console.log('Role updated successfully');
  window.location.reload();
});

3. Press Enter to execute`);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user already has a role
  const currentRole = (user?.publicMetadata?.role || user?.unsafeMetadata?.role) as string;
  if (currentRole) {
    router.push('/dashboard');
    return null;
  }

  // Check if user has already submitted a request
  const hasRequestedRole = (user?.publicMetadata?.requestedRole || user?.unsafeMetadata?.requestedRole) as string;
  const requestStatus = (user?.publicMetadata?.roleRequestStatus || user?.unsafeMetadata?.roleRequestStatus) as string;

  if (requestSubmitted || (hasRequestedRole && requestStatus === 'pending')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-900">Request Submitted</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Your role request has been submitted and is pending approval.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Requested Role:</strong> {AVAILABLE_ROLES.find(r => r.id === (hasRequestedRole || selectedRole))?.name}
              </p>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                An administrator will review your request and assign the appropriate role to your account.
                You will receive an email notification once approved.
              </AlertDescription>
            </Alert>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Development Mode:</p>
                <Button 
                  onClick={() => router.push('/debug-user')} 
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Go to Debug Panel
                </Button>
              </div>
            )}
            
            <Button 
              onClick={() => router.push('/dashboard')} 
              className="w-full"
            >
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-3xl text-indigo-900">Welcome to HR Finance ERP</CardTitle>
          <p className="text-gray-600 mt-2">
            To get started, please select the role that best describes your position in the organization
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <div
                  key={role.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{role.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                      <div className="space-y-1">
                        {role.permissions.slice(0, 3).map((permission, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            {permission}
                          </div>
                        ))}
                        {role.permissions.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{role.permissions.length - 3} more permissions
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Role Details */}
          {selectedRole && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-900 mb-2">
                Selected: {AVAILABLE_ROLES.find(r => r.id === selectedRole)?.name}
              </h4>
              <p className="text-sm text-indigo-700 mb-3">
                {AVAILABLE_ROLES.find(r => r.id === selectedRole)?.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_ROLES.find(r => r.id === selectedRole)?.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-indigo-700 border-indigo-300">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleRoleRequest}
              disabled={!selectedRole || isSubmitting}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting Request...' : 'Request Role Assignment'}
            </Button>
            
            {/* Development Mode - Allow self-assignment */}
            {process.env.NODE_ENV === 'development' && (
              <Button 
                onClick={handleSelfAssignForDev}
                disabled={!selectedRole || isSubmitting}
                variant="outline"
                className="flex-1"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Assigning...' : 'Self-Assign (Dev Mode)'}
              </Button>
            )}
          </div>

          {/* Information Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Role assignments require administrator approval. 
              Please select the role that matches your actual position in the organization. 
              Incorrect role selection may result in access issues.
            </AlertDescription>
          </Alert>

          {/* Development Mode Notice */}
          {process.env.NODE_ENV === 'development' && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Development Mode:</strong> You can self-assign roles for testing purposes. 
                In production, all role assignments require administrator approval.
              </AlertDescription>
            </Alert>
          )}

          {/* Contact Information */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              Questions about role selection?
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.open('mailto:admin@yourcompany.com?subject=Role Assignment Question')}
              className="text-indigo-600 hover:text-indigo-700"
            >
              <Mail className="w-4 h-4 mr-1" />
              Contact Administrator
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}