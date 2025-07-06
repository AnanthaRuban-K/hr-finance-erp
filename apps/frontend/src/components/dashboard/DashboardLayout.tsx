'use client'

import { useAuth } from '@/hooks/useAuth'
import { UserRole, getRoleBadgeColor } from '@/types/auth'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Settings,
  Building2
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
  permission?: {
    resource: string
    action: string
  }
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.EMPLOYEE]
  },
  {
    name: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER],
    permission: { resource: 'employees', action: 'read' }
  },
  {
    name: 'Attendance',
    href: '/dashboard/attendance',
    icon: Clock,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.EMPLOYEE]
  },
  {
    name: 'Leave Management',
    href: '/dashboard/leaves',
    icon: Calendar,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.EMPLOYEE]
  },
  {
    name: 'Payroll',
    href: '/dashboard/payroll',
    icon: DollarSign,
    roles: [UserRole.ADMIN, UserRole.FINANCE_MANAGER],
    permission: { resource: 'payroll', action: 'read' }
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER]
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: [UserRole.ADMIN]
  }
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, getUserRole, hasPermission, roleDisplayName } = useAuth() // Fixed: roleDisplayName now available
  const pathname = usePathname()
  const userRole = getUserRole()

  // Filter navigation items based on user role and permissions
  const allowedNavigation = navigation.filter(item => {
    const hasRole = item.roles.includes(userRole)
    const hasRequiredPermission = item.permission 
      ? hasPermission(item.permission.resource, item.permission.action)
      : true
    
    return hasRole && hasRequiredPermission
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-blue-600 border-b">
            <Building2 className="h-8 w-8 text-white mr-2" />
            <h1 className="text-xl font-bold text-white">HR-Finance ERP</h1>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10"
                  }
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
                <span className={`inline-flex items-center px-2 py-1 mt-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(userRole)}`}>
                  {roleDisplayName} {/* Fixed: Now using the proper property */}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {allowedNavigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2024 HR-Finance ERP
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}