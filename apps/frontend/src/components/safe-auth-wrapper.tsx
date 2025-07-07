'use client'

import { useEffect, useState } from 'react'

interface SafeAuthWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SafeAuthWrapper({ children, fallback }: SafeAuthWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return fallback || <div>Loading...</div>
  }

  return <>{children}</>
}