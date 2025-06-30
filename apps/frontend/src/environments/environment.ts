export const environment = {
  production: false,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
};