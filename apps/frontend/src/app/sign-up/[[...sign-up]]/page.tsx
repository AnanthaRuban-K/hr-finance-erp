import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Our Team
          </h1>
          <p className="text-gray-600">
            Create your HR-Finance ERP account
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <SignUp 
            path="/sign-up"
            routing="path"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 p-0",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 w-full",
                formFieldInput: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                footerActionLink: "text-blue-600 hover:text-blue-700",
                formHeaderTitle: "text-2xl font-bold text-gray-900",
                formHeaderSubtitle: "text-gray-600 mt-2",
              }
            }}
          />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}