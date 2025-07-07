'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { SignIn } from '@clerk/nextjs';

export default function CorporateLoginPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        {/* Corporate Header */}
        <Card className="text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Employee Portal</CardTitle>
              <p className="text-muted-foreground">
                Access your corporate ERP system
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Sign In Component */}
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90',
                card: 'shadow-none border-0',
              }
            }}
          />
        </div>

        {/* Security Notice */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure corporate access • Authorized personnel only</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}