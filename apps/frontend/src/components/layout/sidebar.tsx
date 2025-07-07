'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Home,
  Users,
  DollarSign,
  UserCheck,
  Settings,
  BarChart3,
  FileText,
  Calendar,
  CreditCard,
  Clock,
  Award,
  Building,
  Calculator,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/clerk-wrapper';
import { UserRole } from '@/types/auth';
import { useLayoutStore } from '@/lib/store/layout-store';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  roles?: UserRole[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  },
  {
    title: 'Employee Portal',
    href: '/employee',
    icon: UserCheck,
    roles: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN],
  },
  {
    title: 'HR Management',
    icon: Users,
    roles: [UserRole.HR_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'Employees', href: '/hr/employees', icon: Users, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Attendance', href: '/hr/attendance', icon: Clock, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Leave Management', href: '/hr/leave', icon: Calendar, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Performance', href: '/hr/performance', icon: Award, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
    ],
  },
  {
    title: 'Finance',
    icon: DollarSign,
    roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'Payroll', href: '/finance/payroll', icon: CreditCard, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Expenses', href: '/finance/expenses', icon: FileText, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Reports', href: '/finance/reports', icon: BarChart3, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Ledger', href: '/finance/ledger', icon: Calculator, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
    ],
  },
  {
    title: 'Administration',
    icon: Settings,
    roles: [UserRole.ADMIN],
    children: [
      { title: 'System Settings', href: '/admin/settings', icon: Settings, roles: [UserRole.ADMIN] },
      { title: 'User Management', href: '/admin/users', icon: Users, roles: [UserRole.ADMIN] },
      { title: 'Company Profile', href: '/admin/company', icon: Building, roles: [UserRole.ADMIN] },
    ],
  },
];

interface SidebarItemProps {
  item: NavItem;
  collapsed: boolean;
}

function SidebarItem({ item, collapsed }: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Check if user has access to this item
  if (!item.roles?.includes(user?.role || UserRole.EMPLOYEE)) {
    return null;
  }

  const isActive = item.href ? pathname === item.href : false;
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-accent text-accent-foreground'
          )}
        >
          <div className="flex items-center">
            <item.icon className="mr-2 h-4 w-4" />
            {!collapsed && <span>{item.title}</span>}
          </div>
          {!collapsed && (
            <ChevronRight
              className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-90')}
            />
          )}
        </button>
        {!collapsed && isOpen && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children?.map((child, index) => (
              <SidebarItem key={index} item={child} collapsed={collapsed} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground'
      )}
    >
      <item.icon className="mr-2 h-4 w-4" />
      {!collapsed && <span>{item.title}</span>}
    </Link>
  );
}

export function Sidebar() {
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen, toggleSidebarCollapse } = useLayoutStore();
  const { user } = useAuth();

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(item =>
    item.roles?.includes(user?.role || UserRole.EMPLOYEE)
  );

  // Get role display name
  const getRoleDisplayName = (role: UserRole) => {
    const roleNames = {
      [UserRole.ADMIN]: 'Administrator',
      [UserRole.HR_MANAGER]: 'HR Manager',
      [UserRole.FINANCE_MANAGER]: 'Finance Manager',
      [UserRole.SUPERVISOR]: 'Supervisor',
      [UserRole.EMPLOYEE]: 'Employee'
    };
    return roleNames[role] || 'Employee';
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-card border-r transition-all duration-300 shadow-lg',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b px-4 bg-gradient-to-r from-primary/5 to-primary/10">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">HR</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">HR Finance ERP</span>
                  {user && (
                    <span className="text-xs text-muted-foreground">
                      {getRoleDisplayName(user.role)}
                    </span>
                  )}
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'ml-auto h-8 w-8 hover:bg-accent p-0',
                sidebarCollapsed && 'mx-auto'
              )}
              onClick={toggleSidebarCollapse}
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform duration-300',
                  sidebarCollapsed && 'rotate-180'
                )}
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {filteredNavigationItems.map((item, index) => (
              <SidebarItem key={index} item={item} collapsed={sidebarCollapsed} />
            ))}
          </nav>

          {/* User info at bottom */}
          {!sidebarCollapsed && user && (
            <div className="border-t bg-muted/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleDisplayName(user.role)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}