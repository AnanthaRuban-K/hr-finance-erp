import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ERP System',
  description: 'Comprehensive Enterprise Resource Planning System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        
            {children}
          
        </body>
      </html>
    </ClerkProvider>
  );
}