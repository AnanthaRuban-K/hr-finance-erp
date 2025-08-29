'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

interface AppProvidersProps {
  children: React.ReactNode
}

// Dynamically import ClerkProvider to avoid SSR issues
const DynamicClerkProvider = dynamic(
  () => import('@clerk/nextjs').then((mod) => mod.ClerkProvider),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
)

export function AppProviders({ children }: AppProvidersProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // During SSR, render children without Clerk
  if (!isClient) {
    return <>{children}</>
  }

  // Get publishable key
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 
    'pk_test_Y2VudHJhbC1wZWxpY2FuLTg4LmNsZXJrLmFjY291bnRzLmRldiQ'

  if (!publishableKey) {
    console.error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold text-yellow-600 mb-2">Configuration Error</h1>
          <p className="text-gray-600">Authentication service is not properly configured.</p>
          <p className="text-sm text-gray-500 mt-2">Missing Clerk publishable key</p>
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  )
}