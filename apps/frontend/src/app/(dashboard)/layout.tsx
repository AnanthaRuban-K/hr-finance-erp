import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { LayoutWrapper } from '@/components/layout/layout-wrapper';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  return (
    <div className="flex h-screen">
      
        
      
      
      <main className="flex-1 overflow-auto">
        
        
        
        <div className="p-6">
          <LayoutWrapper>{children}</LayoutWrapper>;
        </div>
      </main>
    </div>
  );
}