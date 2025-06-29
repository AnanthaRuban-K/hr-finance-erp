
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HR & Finance ERP',
  description: 'Complete HR and Finance Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}