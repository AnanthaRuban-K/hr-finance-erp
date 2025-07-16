'use client'

import Link from 'next/link'
import { CircleAlertIcon } from 'lucide-react'

export default function PendingApprovalPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 px-4">
      <div className="max-w-md w-full bg-white dark:bg-background border border-border shadow-lg rounded-xl p-6 text-center space-y-4">
        <div className="flex justify-center">
          <CircleAlertIcon className="text-yellow-500 h-12 w-12" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Pending HR Approval</h2>
        <p className="text-sm text-muted-foreground">
          Your account is awaiting approval from the HR department.
          You will be notified once access is granted.
        </p>
        
      </div>
    </div>
  )
}
