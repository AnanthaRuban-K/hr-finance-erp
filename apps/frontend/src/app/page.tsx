// apps/frontend/src/app/page.tsx
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          HR-Finance ERP
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to your Employee Management System
        </p>
        <div className="space-x-4">
          
            href="/sign-in"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          <a>
            Sign In
          </a>
          
            href="/sign-up"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          <a>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  )
}