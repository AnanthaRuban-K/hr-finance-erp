// src/app/hr/layout.tsx
import { requireRole } from '@/lib/auth/utils'
import { UserRole } from '@/types/auth'
import { RoleGuard } from '@/components/auth/role-guard'

export default async function HRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side role verification
  await requireRole([UserRole.ADMIN, UserRole.HR_MANAGER])

  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER]}>
    
        <div className="hr-layout">
          {/* HR-specific navigation or header */}
          <div className="bg-blue-50 dark:bg-blue-950 border-b p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
              Human Resources Management
            </h2>
            <p className="text-blue-600 dark:text-blue-300 text-sm">
              Manage employees, attendance, payroll, and performance
            </p>
          </div>
          {children}
        </div>
      
    </RoleGuard>
  )
}