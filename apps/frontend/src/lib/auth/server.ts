import { auth, currentUser } from '@clerk/nextjs/server'
import { UserRole } from '@/types/auth'

export async function getServerAuth() {
  const { userId } = await auth() // Add await here for v6
  const user = await currentUser()
  
  return {
    userId,
    user,
    isAuthenticated: !!userId,
    role: (user?.publicMetadata?.role as UserRole) || UserRole.EMPLOYEE
  }
}

export async function requireAuth() {
  const { userId } = await auth() // Add await here for v6
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  return userId
}

export async function requireRole(requiredRole: UserRole) {
  const { user } = await getServerAuth()
  const userRole = (user?.publicMetadata?.role as UserRole) || UserRole.EMPLOYEE
  
  if (userRole !== requiredRole && userRole !== UserRole.ADMIN) {
    throw new Error('Insufficient permissions')
  }
  
  return user
}