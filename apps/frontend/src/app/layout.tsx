import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HR Finance ERP',
  description: 'HR Finance ERP System',
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