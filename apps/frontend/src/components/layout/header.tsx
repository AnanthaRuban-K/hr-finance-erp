'use client';

import { UserButton } from '@clerk/nextjs';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLayoutStore } from '@/lib/store/layout-store';
import { useAuth } from '@/components/clerk-wrapper';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

export function Header() {
  const { toggleSidebar } = useLayoutStore();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect for enhanced sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-50 w-full border-b transition-all duration-200 ease-in-out
        ${isScrolled
          ? 'bg-background/80 backdrop-blur-md shadow-sm border-border/40'
          : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
        }
      `}
    >
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden hover:bg-accent/50 h-8 w-8 p-0"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">HR</span>
            </div>
            <span className="font-semibold text-base text-foreground">HR Finance ERP</span>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center">
            <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[10px]">HR</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 flex justify-center px-4 max-w-2xl mx-auto">
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees, departments..."
                className="pl-10 pr-4 h-8 w-full bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-8 w-8 relative p-0">
            <Bell className="h-3.5 w-3.5" />
            {/* Optional notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
              3
            </span>
            <span className="sr-only">Notifications (3 unread)</span>
          </Button>

          {/* User menu */}
          <div className="flex items-center space-x-3 ml-2">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role?.replace('_', ' ') || 'User'}
              </p>
            </div>
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8 ring-2 ring-border hover:ring-primary/20 transition-all',
                  userButtonPopoverCard: 'shadow-lg border-border/50',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}