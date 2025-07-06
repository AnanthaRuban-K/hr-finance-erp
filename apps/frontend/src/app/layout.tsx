// apps/frontend/src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // Debug logging (remove in production)
  console.log('Environment Debug:', {
    publishableKey: publishableKey ? `${publishableKey.substring(0, 10)}...` : 'MISSING',
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
  })

  if (!publishableKey) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
              <p className="text-gray-600 mb-4">Missing Clerk configuration.</p>
              <div className="text-left text-xs bg-gray-100 p-3 rounded">
                <p><strong>Expected:</strong> NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</p>
                <p><strong>Found:</strong> {publishableKey ? 'Present' : 'Missing'}</p>
                <p><strong>Env:</strong> {process.env.NODE_ENV}</p>
                <p><strong>Available NEXT_PUBLIC vars:</strong></p>
                <ul className="list-disc list-inside">
                  {Object.keys(process.env)
                    .filter(key => key.startsWith('NEXT_PUBLIC_'))
                    .map(key => (
                      <li key={key}>{key}</li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'shadow-lg border',
        },
        variables: {
          colorPrimary: '#2563eb',
        }
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}