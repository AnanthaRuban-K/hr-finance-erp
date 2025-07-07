'use client'

import { AppProviders } from '@/components/app-providers'

export default function Template({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProviders>
      {children}
    </AppProviders>
  )
}