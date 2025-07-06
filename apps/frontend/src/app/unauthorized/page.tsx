// apps/frontend/src/app/unauthorized/page.tsx
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Access Denied
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You don't have permission to access this resource.
            </p>
            <div className="mt-6">
              
                href="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              <a>
                Return to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}