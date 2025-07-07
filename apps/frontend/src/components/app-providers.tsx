'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import getConfig from 'next/config'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    try {
      setIsClient(true)
    } catch (err) {
      setError('Failed to initialize client')
      console.error('AppProviders error:', err)
    }
  }, [])

  // Return children without Clerk during SSR
  if (!isClient) {
    return <>{children}</>
  }

  // Try multiple ways to get the publishable key
  let publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // Fallback to runtime config if environment variable isn't available
  if (!publishableKey) {
    try {
      const { publicRuntimeConfig } = getConfig() || {}
      publishableKey = publicRuntimeConfig?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    } catch (err) {
      console.warn('Could not access runtime config:', err)
    }
  }

  // Hard-coded fallback for production (use your actual key)
  if (!publishableKey) {
    publishableKey = 'pk_test_Y2VudHJhbC1wZWxpY2FuLTg4LmNsZXJrLmFjY291bnRzLmRldiQ' // Replace with your actual key
    console.warn('Using fallback Clerk key')
  }

  // If error occurred, show error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Application Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // If no publishable key, render without Clerk but with error message
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

  try {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        {children}
      </ClerkProvider>
    )
  } catch (err) {
    console.error('ClerkProvider error:', err)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-gray-600">Failed to initialize authentication service.</p>
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