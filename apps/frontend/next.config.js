// apps/frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' and use standalone for server deployment
  output: 'standalone',
  
  // Disable static optimization for pages that use Clerk
  trailingSlash: false,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Experimental features for Clerk
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs'],
    // Disable static generation for certain paths
    missingSuspenseWithCSRBailout: false,
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig