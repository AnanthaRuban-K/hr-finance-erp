'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // During SSR, render children without Clerk
  if (!isClient) {
    return <>{children}</>
  }

  // Get publishable key - REMOVE the hardcoded fallback
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    console.error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Configuration Error</h1>
          <p className="text-gray-600">Authentication service is not properly configured.</p>
          <p className="text-sm text-gray-500 mt-2">Missing Clerk publishable key in environment variables</p>
          <p className="text-xs text-gray-400 mt-4">
            Please set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment
          </p>
        </div>
      </div>
    )
  }

  try {
    return (
      <ClerkProvider 
        publishableKey={publishableKey}
        afterSignOutUrl="/"
      >
        {children}
      </ClerkProvider>
    )
  } catch (error) {
    console.error('ClerkProvider initialization error:', error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-gray-600">Failed to initialize authentication service.</p>
          <p className="text-sm text-gray-500 mt-2">
            Please check your Clerk configuration and try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
}