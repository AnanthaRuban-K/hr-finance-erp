// apps/frontend/src/components/providers/ClerkClientProvider.tsx
'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface ClerkClientProviderProps {
  children: React.ReactNode
}

export function ClerkClientProvider({ children }: ClerkClientProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600">Missing Clerk configuration.</p>
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'shadow-lg border',
        },
        variables: {
          colorPrimary: '#2563eb',
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}