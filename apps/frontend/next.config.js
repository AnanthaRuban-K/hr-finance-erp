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
  
  // Force all pages to be dynamic - REMOVED generateStaticParams (invalid here)
  // Use this instead to force dynamic rendering:
  async rewrites() {
    return []
  },
  
  // Force all pages to be dynamic with headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
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