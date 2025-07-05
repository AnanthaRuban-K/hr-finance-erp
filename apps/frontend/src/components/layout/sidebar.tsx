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
  TrendingUp,
  PieChart,
  Clock,
  Award,
  Building,
  ShoppingCart,
  Package,
  Receipt,
  Banknote,
  UserPlus,
  Target,
  BookOpen,
  Briefcase,
  Timer,
  Calculator,
  Shield
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
}

// ADMIN MENU STRUCTURE
const adminNavigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Accounts Receivable',
    icon: TrendingUp,
    children: [
      {
        title: 'Invoices',
        href: '/admin/invoices',
        icon: Receipt,
      },
      {
        title: 'Create Estimate',
        href: '/admin/create-estimate',
        icon: FileText,
      },
      {
        title: 'Customers',
        href: '/admin/customers',
        icon: Users,
      },
      {
        title: 'Products',
        href: '/admin/products',
        icon: Package,
      },
    ],
  },
  {
    title: 'Accounts Payable',
    icon: CreditCard,
    children: [
      {
        title: 'Vendors',
        href: '/admin/vendors',
        icon: Building,
      },
      {
        title: 'Expenses',
        href: '/admin/expenses',
        icon: DollarSign,
      },
      {
        title: 'Bills',
        href: '/admin/bills',
        icon: FileText,
      },
      {
        title: 'Purchase Orders',
        href: '/admin/purchase-orders',
        icon: ShoppingCart,
      },
      {
        title: 'Purchase Bills',
        href: '/admin/purchase-bills',
        icon: Receipt,
      },
      {
        title: 'Payments',
        href: '/admin/payments',
        icon: Banknote,
      },
      {
        title: 'Vendor Credits',
        href: '/admin/vendor-credits',
        icon: CreditCard,
      },
    ],
  },
  {
    title: 'Job Center',
    href: '/admin/job-center',
    icon: Briefcase,
  },
  {
    title: 'Time Tracking',
    href: '/admin/time-tracking',
    icon: Timer,
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'HR',
    icon: UserCheck,
    children: [
      {
        title: 'Employees',
        href: '/admin/hr/employees',
        icon: Users,
      },
      {
        title: 'Leaves',
        href: '/admin/hr/leaves',
        icon: Calendar,
      },
      {
        title: 'Employee Lifecycle',
        href: '/admin/hr/lifecycle',
        icon: Target,
      },
      {
        title: 'Performance',
        href: '/admin/hr/performance',
        icon: Award,
      },
      {
        title: 'Shift & Attendance',
        href: '/admin/hr/attendance',
        icon: Clock,
      },
      {
        title: 'Expense Claims',
        href: '/admin/hr/expense-claims',
        icon: Receipt,
      },
    ],
  },
  {
    title: 'Payroll',
    icon: Calculator,
    children: [
      {
        title: 'Salary Payout',
        href: '/admin/payroll/salary',
        icon: Banknote,
      },
      {
        title: 'Tax & Benefits',
        href: '/admin/payroll/tax-benefits',
        icon: Shield,
      },
    ],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    title: 'Advanced Options',
    href: '/admin/advanced',
    icon: Settings,
  },
];

// HR MANAGER MENU STRUCTURE
const hrNavigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/hr',
    icon: Home,
  },
  {
    title: 'Employees',
    icon: Users,
    children: [
      {
        title: 'All Employees',
        href: '/hr/employees',
        icon: Users,
      },
      {
        title: 'Add Employee',
        href: '/hr/employees/add',
        icon: UserPlus,
      },
      {
        title: 'Employee Directory',
        href: '/hr/employees/directory',
        icon: BookOpen,
      },
    ],
  },
  {
    title: 'Attendance',
    href: '/hr/attendance',
    icon: Clock,
  },
  {
    title: 'Leave Management',
    icon: Calendar,
    children: [
      {
        title: 'Leave Requests',
        href: '/hr/leaves/requests',
        icon: Calendar,
      },
      {
        title: 'Leave Policies',
        href: '/hr/leaves/policies',
        icon: FileText,
      },
      {
        title: 'Holiday Calendar',
        href: '/hr/leaves/holidays',
        icon: Calendar,
      },
    ],
  },
  {
    title: 'Payroll',
    href: '/hr/payroll',
    icon: DollarSign,
  },
  {
    title: 'Performance',
    href: '/hr/performance',
    icon: Award,
  },
  {
    title: 'Reports',
    href: '/hr/reports',
    icon: BarChart3,
  },
];

// FINANCE MANAGER MENU STRUCTURE
const financeNavigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/finance',
    icon: Home,
  },
  {
    title: 'General Ledger',
    href: '/finance/ledger',
    icon: FileText,
  },
  {
    title: 'Accounts Payable',
    icon: CreditCard,
    children: [
      {
        title: 'Vendor Bills',
        href: '/finance/ap/bills',
        icon: Receipt,
      },
      {
        title: 'Payments',
        href: '/finance/ap/payments',
        icon: Banknote,
      },
      {
        title: 'Vendor Management',
        href: '/finance/ap/vendors',
        icon: Building,
      },
    ],
  },
  {
    title: 'Accounts Receivable',
    icon: TrendingUp,
    children: [
      {
        title: 'Customer Invoices',
        href: '/finance/ar/invoices',
        icon: Receipt,
      },
      {
        title: 'Payments Received',
        href: '/finance/ar/payments',
        icon: Banknote,
      },
      {
        title: 'Customer Management',
        href: '/finance/ar/customers',
        icon: Users,
      },
    ],
  },
  {
    title: 'Budget & Forecast',
    href: '/finance/budget',
    icon: PieChart,
  },
  {
    title: 'Financial Reports',
    href: '/finance/reports',
    icon: BarChart3,
  },
];

// SUPERVISOR MENU STRUCTURE
const supervisorNavigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/supervisor',
    icon: Home,
  },
  {
    title: 'Team Management',
    href: '/supervisor/team',
    icon: Users,
  },
  {
    title: 'Approvals',
    icon: UserCheck,
    children: [
      {
        title: 'Leave Requests',
        href: '/supervisor/approvals/leaves',
        icon: Calendar,
      },
      {
        title: 'Expense Claims',
        href: '/supervisor/approvals/expenses',
        icon: Receipt,
      },
      {
        title: 'Overtime Requests',
        href: '/supervisor/approvals/overtime',
        icon: Clock,
      },
    ],
  },
  {
    title: 'Team Attendance',
    href: '/supervisor/attendance',
    icon: Clock,
  },
  {
    title: 'Performance Reviews',
    href: '/supervisor/performance',
    icon: Award,
  },
  {
    title: 'Team Reports',
    href: '/supervisor/reports',
    icon: BarChart3,
  },
];

// EMPLOYEE MENU STRUCTURE
const employeeNavigationItems: NavItem[] = [
  {
    title: 'My Dashboard',
    href: '/employee',
    icon: Home,
  },
  {
    title: 'My Profile',
    href: '/employee/profile',
    icon: Users,
  },
  {
    title: 'Leave Management',
    icon: Calendar,
    children: [
      {
        title: 'Apply Leave',
        href: '/employee/leave/apply',
        icon: Calendar,
      },
      {
        title: 'Leave History',
        href: '/employee/leave/history',
        icon: FileText,
      },
      {
        title: 'Leave Balance',
        href: '/employee/leave/balance',
        icon: PieChart,
      },
    ],
  },
  {
    title: 'Payslips',
    href: '/employee/payslips',
    icon: FileText,
  },
  {
    title: 'My Attendance',
    href: '/employee/attendance',
    icon: Clock,
  },
  {
    title: 'Expense Claims',
    href: '/employee/expenses',
    icon: Receipt,
  },
  {
    title: 'My Performance',
    href: '/employee/performance',
    icon: Award,
  },
];

// Function to get navigation items based on user role
function getNavigationItems(userRole: UserRole): NavItem[] {
  switch (userRole) {
    case UserRole.ADMIN:
      return adminNavigationItems;
    case UserRole.HR_MANAGER:
      return hrNavigationItems;
    case UserRole.FINANCE_MANAGER:
      return financeNavigationItems;
    case UserRole.SUPERVISOR:
      return supervisorNavigationItems;
    case UserRole.EMPLOYEE:
      return employeeNavigationItems;
    default:
      return employeeNavigationItems;
  }
}

interface SidebarItemProps {
  item: NavItem;
  collapsed: boolean;
}

function SidebarItem({ item, collapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href ? pathname === item.href : false;
  const isParentActive = item.children?.some(child => child.href === pathname);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const content = (
    <>
      <div
        className={cn(
          'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          'hover:bg-accent hover:text-accent-foreground cursor-pointer',
          (isActive || isParentActive) && 'bg-primary text-primary-foreground shadow-sm',
          hasChildren && 'group'
        )}
        onClick={handleClick}
      >
        <item.icon className={cn(
          'h-4 w-4 transition-colors', 
          !collapsed && 'mr-3',
          (isActive || isParentActive) && 'text-primary-foreground'
        )} />
        {!collapsed && (
          <>
            <span className="flex-1 font-medium">{item.title}</span>
            {hasChildren && (
              <div className="ml-auto transition-transform duration-200">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5" />
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {hasChildren && isOpen && !collapsed && (
        <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
          {item.children?.map((child, index) => (
            <SidebarItem key={index} item={child} collapsed={false} />
          ))}
        </div>
      )}
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}

export function Sidebar() {
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen, toggleSidebarCollapse } = useLayoutStore();
  const { user } = useAuth();

  // Get navigation items based on user role
  const navigationItems = user ? getNavigationItems(user.role) : [];

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
          sidebarCollapsed ? 'w-50' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b px-4 bg-gradient-to-r from-primary/5 to-primary/10">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">ST</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">SBros Tech</span>
                  {user && (
                    <span className="text-xs text-muted-foreground">
                      {getRoleDisplayName(user.role)}
                    </span>
                  )}
                </div>
              </div>
            )}
            <Button
              className={cn(
                'ml-auto h-8 w-8 hover:bg-accent p-0 border-0 bg-transparent',
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
          <nav className="flex-1 space-y-1 p-4 custom-scrollbar overflow-y-auto">
            {navigationItems.map((item, index) => (
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