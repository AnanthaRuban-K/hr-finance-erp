// src/app/admin/layout.tsx
import { requireRole } from '@/lib/auth/utils'
import { UserRole } from '@/types/auth'
import { RoleGuard } from '@/components/auth/role-guard'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side role verification
  await requireRole([UserRole.ADMIN])

  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]}>
      
        <div className="admin-layout">
          {/* Admin-specific header content can go here */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      
    </RoleGuard>
  )
}