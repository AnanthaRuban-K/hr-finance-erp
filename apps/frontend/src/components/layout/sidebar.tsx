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
  Receipt,
  ShoppingCart,
  Package,
  TrendingUp,
  UserPlus,
  Briefcase,
  Target,
  Timer,
  PieChart,
  Wallet,
  Shield,
  Database,
  Globe,
  Mail,
  Phone,
  MapPin,
  Truck,
  Factory,
  Store,
  BadgeCheck,
  ClipboardList,
  MonitorSpeaker,
  Zap,
  Crown,
  Gem
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
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
  },
  
  // ADMIN EXCLUSIVE SECTIONS
  {
    title: 'Administration',
    icon: Crown,
    roles: [UserRole.ADMIN],
    children: [
      { title: 'System Settings', href: '/admin/settings', icon: Settings, roles: [UserRole.ADMIN] },
      { title: 'User Management', href: '/admin/users', icon: Users, roles: [UserRole.ADMIN] },
      { title: 'Company Profile', href: '/admin/company', icon: Building, roles: [UserRole.ADMIN] },
      { title: 'Security & Access', href: '/admin/security', icon: Shield, roles: [UserRole.ADMIN] },
      { title: 'Database Management', href: '/admin/database', icon: Database, roles: [UserRole.ADMIN] },
      { title: 'System Monitoring', href: '/admin/monitoring', icon: MonitorSpeaker, roles: [UserRole.ADMIN] },
    ],
  },

  // ACCOUNTS RECEIVABLE - Finance & Admin
  {
    title: 'Accounts Receivable',
    icon: Receipt,
    roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'Invoices', href: '/finance/invoices', icon: FileText, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Create Estimate', href: '/finance/estimates', icon: Calculator, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Customers', href: '/finance/customers', icon: Users, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Products', href: '/finance/products', icon: Package, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Customer Credits', href: '/finance/credits', icon: CreditCard, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
    ],
  },

  // ACCOUNTS PAYABLE - Finance & Admin
  {
    title: 'Accounts Payable',
    icon: ShoppingCart,
    roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'Vendors', href: '/finance/vendors', icon: Store, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Expenses', href: '/finance/expenses', icon: DollarSign, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Bills', href: '/finance/bills', icon: FileText, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Purchase Orders', href: '/finance/purchase-orders', icon: ClipboardList, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Purchase Bills', href: '/finance/purchase-bills', icon: Receipt, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Payments', href: '/finance/payments', icon: CreditCard, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Vendor Credits', href: '/finance/vendor-credits', icon: Wallet, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
    ],
  },

  // JOB CENTER & TIME TRACKING - Admin, HR, Supervisors
  {
    title: 'Job Center',
    icon: Briefcase,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR],
    children: [
      { title: 'Time Tracking', href: '/jobs/time-tracking', icon: Timer, roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE] },
      { title: 'Project Management', href: '/jobs/projects', icon: Target, roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR] },
      { title: 'Task Assignment', href: '/jobs/tasks', icon: ClipboardList, roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR] },
      { title: 'Resource Planning', href: '/jobs/resources', icon: Factory, roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR] },
    ],
  },

  // REPORTS - Finance, HR, Admin, Supervisors
  {
    title: 'Reports',
    icon: BarChart3,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR],
    children: [
      { title: 'Financial Reports', href: '/reports/financial', icon: PieChart, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'HR Analytics', href: '/reports/hr', icon: TrendingUp, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Attendance Reports', href: '/reports/attendance', icon: Clock, roles: [UserRole.HR_MANAGER, UserRole.SUPERVISOR, UserRole.ADMIN] },
      { title: 'Payroll Reports', href: '/reports/payroll', icon: Wallet, roles: [UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Performance Reports', href: '/reports/performance', icon: Award, roles: [UserRole.HR_MANAGER, UserRole.SUPERVISOR, UserRole.ADMIN] },
      { title: 'Project Reports', href: '/reports/projects', icon: Target, roles: [UserRole.ADMIN, UserRole.SUPERVISOR] },
      { title: 'Custom Reports', href: '/reports/custom', icon: Settings, roles: [UserRole.ADMIN] },
    ],
  },

  // HR MANAGEMENT - HR & Admin
  {
    title: 'HR Management',
    icon: Users,
    roles: [UserRole.HR_MANAGER, UserRole.ADMIN],
    children: [
      // Employee Management
      { title: 'Employee Directory', href: '/hr/employees', icon: Users, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Employee Onboarding', href: '/hr/onboarding', icon: UserPlus, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Employee Lifecycle', href: '/hr/lifecycle', icon: TrendingUp, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      
      // Leave Management
      { title: 'Leave Management', href: '/hr/leave', icon: Calendar, roles: [UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.SUPERVISOR] },
      { title: 'Leave Approvals', href: '/hr/leave-approvals', icon: BadgeCheck, roles: [UserRole.HR_MANAGER, UserRole.SUPERVISOR, UserRole.ADMIN] },
      
      // Performance & Development
      { title: 'Performance Reviews', href: '/hr/performance', icon: Award, roles: [UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.SUPERVISOR] },
      { title: 'Training & Development', href: '/hr/training', icon: Gem, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      
      // Attendance & Scheduling
      { title: 'Attendance Tracking', href: '/hr/attendance', icon: Clock, roles: [UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.SUPERVISOR] },
      { title: 'Shift Management', href: '/hr/shifts', icon: Timer, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      
      // Expense Claims
      { title: 'Expense Claims', href: '/hr/expense-claims', icon: Receipt, roles: [UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.EMPLOYEE] },
    ],
  },

  // PAYROLL & COMPENSATION - HR, Finance, Admin
  {
    title: 'Payroll & Benefits',
    icon: Wallet,
    roles: [UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'Salary Payout', href: '/payroll/salary', icon: CreditCard, roles: [UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Payroll Processing', href: '/payroll/processing', icon: Zap, roles: [UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Tax Settings', href: '/payroll/tax', icon: Calculator, roles: [UserRole.FINANCE_MANAGER, UserRole.ADMIN] },
      { title: 'Benefits Management', href: '/payroll/benefits', icon: Shield, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Compensation Plans', href: '/payroll/compensation', icon: TrendingUp, roles: [UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Advanced Options', href: '/payroll/advanced', icon: Settings, roles: [UserRole.ADMIN] },
    ],
  },

  // EMPLOYEE SELF-SERVICE - All Employees
  {
    title: 'Employee Portal',
    href: '/employee',
    icon: UserCheck,
    roles: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN],
  },

  // SUPERVISOR SPECIFIC
  {
    title: 'Team Management',
    icon: Target,
    roles: [UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN],
    children: [
      { title: 'My Team', href: '/supervisor/team', icon: Users, roles: [UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Team Performance', href: '/supervisor/performance', icon: Award, roles: [UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Team Schedule', href: '/supervisor/schedule', icon: Calendar, roles: [UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN] },
      { title: 'Approvals', href: '/supervisor/approvals', icon: BadgeCheck, roles: [UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN] },
    ],
  },

  // COMPANY OPERATIONS - Admin, HR
  {
    title: 'Company Operations',
    icon: Building,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER],
    children: [
      { title: 'Departments', href: '/company/departments', icon: Building, roles: [UserRole.ADMIN, UserRole.HR_MANAGER] },
      { title: 'Locations', href: '/company/locations', icon: MapPin, roles: [UserRole.ADMIN, UserRole.HR_MANAGER] },
      { title: 'Assets Management', href: '/company/assets', icon: Package, roles: [UserRole.ADMIN] },
      { title: 'Vendor Management', href: '/company/vendors', icon: Truck, roles: [UserRole.ADMIN, UserRole.FINANCE_MANAGER] },
    ],
  },

  // COMMUNICATION - All roles
  {
    title: 'Communication',
    icon: Mail,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE],
    children: [
      { title: 'Announcements', href: '/communication/announcements', icon: Globe, roles: [UserRole.ADMIN, UserRole.HR_MANAGER] },
      { title: 'Messages', href: '/communication/messages', icon: Mail, roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE] },
      { title: 'Company Directory', href: '/communication/directory', icon: Phone, roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR, UserRole.EMPLOYEE] },
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

  // Check if any child is active to highlight parent
  const hasActiveChild = hasChildren && item.children?.some(child => 
    child.href && pathname.startsWith(child.href)
  );

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'group relative w-full flex items-center justify-between px-2.5 py-2 text-sm font-semibold tracking-wide rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:shadow-md hover:scale-[1.01]',
            (isActive || hasActiveChild) && 'bg-gradient-to-r from-primary/15 to-primary/10 shadow-md text-primary',
            collapsed && 'justify-center px-2'
          )}
        >
          <div className="flex items-center min-w-0">
            <div className={cn(
              "flex items-center justify-center rounded-md transition-all duration-300 group-hover:scale-105",
              collapsed ? "h-7 w-7" : "h-5 w-5 mr-2.5",
              (isActive || hasActiveChild) ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}>
              <item.icon className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div className="flex items-center min-w-0 flex-1">
                <span className="truncate font-medium">{item.title}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-all duration-300 text-muted-foreground group-hover:text-primary', 
                isOpen && 'rotate-90 text-primary'
              )}
            />
          )}
        </button>
        
        {!collapsed && isOpen && (
          <div className="space-y-1 ml-4 pl-2 border-l-2 border-primary/20 animate-in slide-in-from-top-2 duration-300">
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
        'group relative flex items-center px-2.5 py-2 text-sm font-semibold tracking-wide rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:shadow-md hover:scale-[1.01]',
        isActive && 'bg-gradient-to-r from-primary/15 to-primary/10 shadow-md text-primary',
        collapsed && 'justify-center px-2'
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-md transition-all duration-300 group-hover:scale-105",
        collapsed ? "h-7 w-7" : "h-5 w-5 mr-2.5",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
      )}>
        <item.icon className="h-4 w-4" />
      </div>
      {!collapsed && (
        <div className="flex items-center min-w-0 flex-1">
          <span className="truncate font-medium">{item.title}</span>
          {item.badge && (
            <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full shadow-sm">
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

  // Check if user has access to this item
  if (!item.roles?.includes(user?.role || UserRole.EMPLOYEE)) {
    return null;
  }

  const isActive = item.href ? pathname === item.href : false;

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'group relative flex items-center px-2.5 py-1.5 text-sm font-medium rounded-md transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/8 hover:to-primary/4 hover:translate-x-0.5',
        isActive && 'bg-gradient-to-r from-primary/12 to-primary/8 text-primary shadow-sm translate-x-0.5'
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-sm mr-2.5 h-4 w-4 transition-all duration-300 group-hover:scale-105",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
      )}>
        <item.icon className="h-3.5 w-3.5" />
      </div>
      <span className="truncate">{item.title}</span>
      {item.badge && (
        <span className="ml-auto px-1.5 py-0.5 text-xs font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-sm shadow-sm">
          {item.badge}
        </span>
      )}
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

  // Get role display name with enhanced styling
  const getRoleDisplayName = (role: UserRole) => {
    const roleConfig = {
      [UserRole.ADMIN]: { 
        name: 'Administrator', 
        color: 'text-red-100', 
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        icon: '👑'
      },
      [UserRole.HR_MANAGER]: { 
        name: 'HR Manager', 
        color: 'text-blue-100', 
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        icon: '👥'
      },
      [UserRole.FINANCE_MANAGER]: { 
        name: 'Finance Manager', 
        color: 'text-green-100', 
        bg: 'bg-gradient-to-r from-green-500 to-green-600',
        icon: '💰'
      },
      [UserRole.SUPERVISOR]: { 
        name: 'Supervisor', 
        color: 'text-purple-100', 
        bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
        icon: '📋'
      },
      [UserRole.EMPLOYEE]: { 
        name: 'Employee', 
        color: 'text-gray-100', 
        bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
        icon: '👤'
      }
    };
    return roleConfig[role] || roleConfig[UserRole.EMPLOYEE];
  };

  const roleConfig = getRoleDisplayName(user?.role || UserRole.EMPLOYEE);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-gradient-to-b from-card via-card to-card/95 border-r border-border/50 backdrop-blur-xl transition-all duration-500 ease-in-out shadow-2xl',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Enhanced Header */}
          <div className="flex h-16 items-center border-b border-border/50 px-3 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center shadow-lg ring-1 ring-primary/20">
                    <span className="text-primary-foreground font-bold text-base">HR</span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-card shadow-sm"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-foreground tracking-tight">HR Finance ERP</span>
                  <span className="text-xs text-muted-foreground font-medium">Enterprise Solution</span>
                  {user && (
                    <div className={cn("text-xs px-2 py-0.5 rounded-md font-bold shadow-sm mt-1 inline-flex items-center space-x-1 w-fit", roleConfig.color, roleConfig.bg)}>
                      <span className="text-xs">{roleConfig.icon}</span>
                      <span>{roleConfig.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'ml-auto h-8 w-8 rounded-lg hover:bg-primary/10 hover:scale-105 p-0 transition-all duration-300 group',
                sidebarCollapsed && 'mx-auto'
              )}
              onClick={toggleSidebarCollapse}
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-all duration-500 group-hover:text-primary',
                  sidebarCollapsed && 'rotate-180'
                )}
              />
            </Button>
          </div>

          {/* Enhanced Navigation */}
          <nav className="flex-1 space-y-2 p-3 overflow-y-auto scrollbar-hide"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0,0,0,0.2) transparent'
            }}
          >
           

            {/* Navigation Items */}
            <div className="space-y-2">
              {filteredNavigationItems.map((item, index) => (
                <SidebarItem key={index} item={item} collapsed={sidebarCollapsed} />
              ))}
            </div>
          </nav>

          {/* Enhanced User info at bottom */}
          {!sidebarCollapsed && user && (
            <div className="border-t border-border/50 bg-gradient-to-r from-muted/10 to-transparent p-3">
              <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-gradient-to-r from-background/50 to-background/30 border border-border/30 shadow-sm">
                <div className="relative">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md ring-1 ring-primary/20">
                    <span className="text-sm font-bold text-primary-foreground">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-card shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate font-medium">
                    {user.email}
                  </p>
                  <div className={cn("text-xs px-2 py-0.5 rounded-md font-bold shadow-sm mt-1 inline-flex items-center space-x-1", roleConfig.color, roleConfig.bg)}>
                    <span className="text-xs">{roleConfig.icon}</span>
                    <span>{roleConfig.name}</span>
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