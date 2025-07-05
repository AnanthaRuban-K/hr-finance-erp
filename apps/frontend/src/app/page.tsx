import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HR Finance ERP
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to your ERP system
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/dashboard"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Go to Dashboard
            </Link>
            
            <div className="text-sm text-gray-500">
              <p>Version 1.0.0</p>
              <p>Status: Running ✅</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}