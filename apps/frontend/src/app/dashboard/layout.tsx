// apps/frontend/src/app/dashboard/layout.tsx
import { ClerkClientProvider } from '@/components/providers/ClerkClientProvider'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkClientProvider>
      {children}
    </ClerkClientProvider>
  )
}