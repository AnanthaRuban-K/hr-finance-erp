'use client'
import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { ClientOnly } from '@/components/client-only'
import { RoleGuard } from '@/components/auth/role-guard'
import { UserRole } from '@/types/auth'

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
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
      <RoleGuard allowedRoles={[UserRole.FINANCE_MANAGER, UserRole.ADMIN]}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </RoleGuard>
    </ClientOnly>
  )
}