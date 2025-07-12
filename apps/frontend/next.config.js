/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force dynamic rendering for all pages
  output: 'standalone',
  
  // Disable static generation completely
  trailingSlash: false,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.sbrosenterpriseerp.com/',
  },
  
  // Force dynamic rendering
  experimental: {
    missingSuspenseWithCSRBailout: false,
    esmExternals: false,
  },
  
  // Disable prerendering for pages with auth
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