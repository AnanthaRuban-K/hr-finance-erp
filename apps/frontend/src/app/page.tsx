'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClientOnly } from '@/components/client-only'

function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to sign-in page
    router.push('/sign-in')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">HR Finance ERP</h1>
        <p className="text-muted-foreground">Redirecting to sign-in...</p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <ClientOnly fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">HR Finance ERP</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <HomePage />
    </ClientOnly>
  )
}