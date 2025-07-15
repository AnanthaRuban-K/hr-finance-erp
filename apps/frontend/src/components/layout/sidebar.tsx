'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  DollarSign,
  Settings,
  BarChart3,
  FileText,
  Calendar,
  CreditCard,
  Building,
  Calculator,
  Receipt,
  ShoppingCart,
  Target,
  Wallet,
  Shield,
  Crown,
  UserCheck,
  Mail,
  Plus,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';
import { useLayoutStore } from '@/lib/store/layout-store';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  roles?: UserRole[];
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  },
  
  // ADMIN EXCLUSIVE
  {
    title: 'Administration',
    icon: Crown,
    roles: [UserRole.ADMIN],
    children: [
      { title: 'System Settings', href: '/admin/settings', icon: Settings, roles: [UserRole.ADMIN] },
      { title: 'User Management', href: '/admin/users', icon: Users, roles: [UserRole.ADMIN] },
      { title: 'Company Profile', href: '/admin/company', icon: Building, roles: [UserRole.ADMIN] },
      { title: 'Security', href: '/admin/security', icon: Shield, roles: [UserRole.ADMIN] },
    ],
  },

  // FINANCE MANAGEMENT
  {
    title: 'Accounts Receivable',
    icon: Receipt,
    roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'Overview', href: '/finance/accounts-receivable', icon: BarChart3, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Invoices', href: '/finance/accounts-receivable/invoices', icon: FileText, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Create Estimate', href: '/finance/accounts-receivable/invoices/create-estimate', icon: Calculator, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Customers', href: '/finance/accounts-receivable/customers', icon: Users, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Payments', href: '/finance/accounts-receivable/payments', icon: DollarSign, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
    ],
  },

  {
    title: 'Accounts Payable',
    icon: ShoppingCart,
    roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'Overview', href: '/finance/accounts-payable', icon: BarChart3, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Vendors', href: '/finance/accounts-payable/vendors', icon: Building, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Bills', href: '/finance/accounts-payable/bills', icon: FileText, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Expenses', href: '/finance/accounts-payable/expenses', icon: DollarSign, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Payments', href: '/finance/accounts-payable/payments', icon: CreditCard, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
    ],
  },

  // HR MANAGEMENT
  {
    title: 'HR Management',
    icon: Users,
    roles: [UserRole.HR_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'Employees', href: '/hr/employees', icon: Users, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Employee Onboarding', href: '/hr/onboarding', icon: Users, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Leave Management', href: '/hr/leave', icon: Calendar, roles: [UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.SUPERVISOR] },
      { title: 'Leave Apporovals', href: '/hr/leave/approvals', icon: Calendar, roles: [UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.SUPERVISOR] },
      { title: 'Attendance', href: '/hr/attendance', icon: Calendar, roles: [UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.SUPERVISOR] },
      { title: 'Performance', href: '/hr/performance', icon: Target, roles: [UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.SUPERVISOR] },
      { title: 'Recruitment', href: '/hr/recruitment', icon: UserPlus, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
    ],
  },

  // PAYROLL
  {
    title: 'Payroll & Benefits',
    icon: Wallet,
    roles: [UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'Payroll Dashboard', href: '/payroll', icon: BarChart3, roles: [UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Salary Structure', href: '/payroll/salary', icon: DollarSign, roles: [UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Payroll Processing', href: '/payroll/processing', icon: Calculator, roles: [UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Payslips', href: '/payroll/payslips', icon: FileText, roles: [UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Benefits', href: '/payroll/benefits', icon: Shield, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
    ],
  },

  // EMPLOYEE PORTAL
  {
    title: 'Employee Portal',
    icon: UserCheck,
    roles: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'My Profile', href: '/employee/profile', icon: Users, roles: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'My Payslips', href: '/employee/payslips', icon: FileText, roles: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Leave Requests', href: '/employee/leave', icon: Calendar, roles: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'My Attendance', href: '/employee/attendance', icon: Calendar, roles: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Expense Claims', href: '/employee/expenses', icon: Receipt, roles: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN] },
    ],
  },

  // REPORTS
  {
    title: 'Reports & Analytics',
    icon: BarChart3,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR],
    children: [
      { title: 'Executive Dashboard', href: '/reports', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER] },
      { title: 'Financial Reports', href: '/reports/financial', icon: DollarSign, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'HR Analytics', href: '/reports/hr', icon: Users, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Payroll Reports', href: '/reports/payroll', icon: Wallet, roles: [UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
    ],
  },

  // COMMUNICATION
  {
    title: 'Communication',
    icon: Mail,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
    children: [
      { title: 'Announcements', href: '/communication/announcements', icon: Mail, roles: [UserRole.ADMIN, UserRole.HR_MANAGER] },
      { title: 'Messages', href: '/communication/messages', icon: Mail, roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE] },
    ],
  },

  // SETTINGS
  {
    title: 'Settings',
    icon: Settings,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
    children: [
      { title: 'Preferences', href: '/settings/preferences', icon: UserCheck, roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE] },
      { title: 'Security', href: '/settings/security', icon: Shield, roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE] },
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

  // Check user access
  if (!item.roles?.includes(user?.role || UserRole.EMPLOYEE)) {
    return null;
  }

  const isActive = pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;
  
  // Check if any child is active
  const hasActiveChild = hasChildren && item.children?.some(child => 
    pathname === child.href || pathname.startsWith(child.href + '/')
  );

  // Auto-open parent if child is active
  if (hasActiveChild && !isOpen && !collapsed) {
    setIsOpen(true);
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => !collapsed && setIsOpen(!isOpen)}
          className={cn(
            'group w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
            'hover:bg-accent hover:text-accent-foreground',
            (isActive || hasActiveChild) && 'bg-accent text-accent-foreground',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? item.title : undefined}
        >
          <div className="flex items-center min-w-0">
            <item.icon className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4 mr-3')} />
            {!collapsed && (
              <span className="truncate">{item.title}</span>
            )}
          </div>
          {!collapsed && (
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isOpen && 'rotate-90'
              )}
            />
          )}
        </button>
        
        {!collapsed && isOpen && (
          <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
            {item.children?.map((child, index) => (
              <SidebarSubItem key={index} item={child} />
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
        'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground',
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? item.title : undefined}
    >
      <item.icon className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4 mr-3')} />
      {!collapsed && (
        <div className="flex items-center justify-between w-full min-w-0">
          <span className="truncate">{item.title}</span>
          {item.badge && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

function SidebarSubItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!item.roles?.includes(user?.role || UserRole.EMPLOYEE)) {
    return null;
  }

  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
        'hover:bg-accent/50 hover:text-accent-foreground',
        isActive && 'bg-primary/10 text-primary border-l-2 border-primary ml-2 pl-2'
      )}
    >
      <item.icon className="h-3.5 w-3.5 mr-2.5 shrink-0" />
      <span className="truncate">{item.title}</span>
    </Link>
  );
}

export function Sidebar() {
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen, toggleSidebarCollapse } = useLayoutStore();
  const { user } = useAuth();

  // Filter navigation based on user role
  const filteredNavigationItems = navigationItems.filter(item =>
    item.roles?.includes(user?.role || UserRole.EMPLOYEE)
  );

  // Role configuration
  const roleConfig = {
    [UserRole.ADMIN]: { name: 'Administrator', color: 'text-red-500', icon: '👑' },
    [UserRole.HR_MANAGER]: { name: 'HR Manager', color: 'text-blue-500', icon: '👥' },
    [UserRole.FINANCE_MANAGER]: { name: 'Finance Manager', color: 'text-green-500', icon: '💰' },
    [UserRole.SUPERVISOR]: { name: 'Supervisor', color: 'text-purple-500', icon: '📋' },
    [UserRole.EMPLOYEE]: { name: 'Employee', color: 'text-gray-500', icon: '👤' },
  };

  const currentRole = roleConfig[user?.role || UserRole.EMPLOYEE];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
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
          <div className="flex h-16 items-center border-b px-3">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">HR</span>
                </div>
                <div>
                  <h2 className="font-semibold text-sm">HR Finance ERP</h2>
                  <p className="text-xs text-muted-foreground">Enterprise Solution</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={cn('h-8 w-8 p-0', sidebarCollapsed ? 'mx-auto' : 'ml-auto')}
              onClick={toggleSidebarCollapse}
            >
              <ChevronLeft className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
            {filteredNavigationItems.map((item, index) => (
              <SidebarItem key={index} item={item} collapsed={sidebarCollapsed} />
            ))}

            
          </nav>

          {/* User Profile */}
          {!sidebarCollapsed && user && (
            <div className="border-t p-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <div className={cn('text-xs font-medium flex items-center gap-1', currentRole.color)}>
                    <span>{currentRole.icon}</span>
                    <span>{currentRole.name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}