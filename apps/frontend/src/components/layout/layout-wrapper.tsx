'use client';

import { useLayoutStore } from '@/lib/store/layout-store';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { sidebarCollapsed } = useLayoutStore();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          'lg:ml-64',
          sidebarCollapsed && 'lg:ml-16'
        )}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}