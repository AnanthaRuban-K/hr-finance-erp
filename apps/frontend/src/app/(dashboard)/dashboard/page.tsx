// apps/frontend/src/app/dashboard/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/clerk-wrapper'
import { UserRole } from '@/types/auth'
import { ClientOnly } from '@/components/client-only'

function DashboardRedirect() {
  const { user, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      router.push('/sign-in')
      return
    }

    // Redirect based on user role
    switch (user.role) {
      case UserRole.ADMIN:
        router.push('/admin')
        break
      case UserRole.HR_MANAGER:
        router.push('/hr')
        break
      case UserRole.FINANCE_MANAGER:
        router.push('/finance')
        break
      case UserRole.SUPERVISOR:
        router.push('/supervisor')
        break
      case UserRole.EMPLOYEE:
      default:
        router.push('/employee')
        break
    }
  }, [user, isLoaded, router])

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ClientOnly fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <DashboardRedirect />
    </ClientOnly>
  )
}