// apps/frontend/src/app/dashboard/page.tsx
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  )
}