// apps/frontend/src/components/auth/ProtectedRoute.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requiredPermission?: {
    resource: string
    action: string
  }
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback
}) => {
  const { user, isLoading, isAuthenticated, hasPermission, getUserRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in')
      return
    }

    if (user && requiredRole && getUserRole() !== requiredRole && getUserRole() !== UserRole.ADMIN) {
      router.push('/unauthorized')
      return
    }

    if (user && requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
      router.push('/unauthorized')
      return
    }
  }, [isLoading, isAuthenticated, user, requiredRole, requiredPermission, router, getUserRole, hasPermission])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}