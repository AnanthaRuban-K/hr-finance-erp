import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HR Finance ERP',
  description: 'HR Finance ERP System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // During build time, allow missing key for static generation
  if (!publishableKey && process.env.NODE_ENV === 'production') {
    console.warn('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY not found during build');
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey || 'pk_build_placeholder'}
    >
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}