// apps/frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone instead of export to avoid static generation issues
  output: 'standalone',
  
  // Disable static generation completely for SSR compatibility
  trailingSlash: false,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Critical: Disable static optimization
  experimental: {
    missingSuspenseWithCSRBailout: false,
    esmExternals: false,
  },
  
  // Disable static generation for all pages
  async generateStaticParams() {
    return []
  },
  
  // Force all pages to be dynamic
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig