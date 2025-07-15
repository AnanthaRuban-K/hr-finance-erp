'use client'

import { useUser, SignOutButton } from '@clerk/nextjs'
import { CircleAlertIcon } from 'lucide-react'

export default function PendingApprovalPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading user...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 px-4">
      <div className="max-w-md w-full bg-white dark:bg-background border border-border shadow-lg rounded-xl p-6 text-center space-y-4">
        <div className="flex justify-center">
          <CircleAlertIcon className="text-yellow-500 h-12 w-12" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Pending HR Approval</h2>

        <p className="text-sm text-muted-foreground">
          Hello {user?.firstName || user?.username || 'there'} 👋 <br />
          Your account is awaiting approval from the HR department. You’ll get access once it’s approved.
        </p>

        <div className="pt-4">
          <SignOutButton>
            <button className="text-sm font-medium text-primary hover:underline">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  )
}
