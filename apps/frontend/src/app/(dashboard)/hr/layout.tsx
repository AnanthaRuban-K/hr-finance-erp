import { ClientOnly } from '@/components/client-only';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | HR Management',
    default: 'HR Management',
  },
  description: 'Human Resources Management System',
};

export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientOnly fallback={
          <div className="flex h-screen">
            <div className="w-64 bg-muted animate-pulse" />
            <div className="flex-1 p-6">
              <div className="space-y-4">
                <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                <div className="h-4 w-96 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        }>
    
      <LayoutWrapper>
      {children}
      </LayoutWrapper>
      </ClientOnly>
    
    
  );
}
