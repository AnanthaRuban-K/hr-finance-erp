'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClientOnly } from '@/components/client-only'
import { useAuth } from '@/components/clerk-wrapper'
import { UserRole } from '@/types/auth'

function DashboardContent() {
  const { user, isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
      return
    }

    if (isLoaded && user) {
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
          router.push('/employee')
          break
        default:
          router.push('/employee')
      }
    }
  }, [user, isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to sign-in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.firstName}!</h1>
        <p className="text-gray-600 mb-4">Redirecting to your dashboard...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ClientOnly fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </ClientOnly>
  )
}