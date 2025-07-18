import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'


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
  return (
    <html lang="en">
      <body className={inter.className}>
     
      
         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        </ThemeProvider>
       
      </body>
      
    </html>
  )
}