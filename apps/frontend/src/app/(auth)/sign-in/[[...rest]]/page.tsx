'use client'

import { SignIn } from '@clerk/nextjs'
import { ClientOnly } from '@/components/client-only'

function SignInContent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your HR Finance ERP account</p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
              card: 'shadow-lg',
            }
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <ClientOnly fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SignInContent />
    </ClientOnly>
  )
}