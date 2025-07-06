// apps/frontend/src/app/employees/page.tsx
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export default function EmployeesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Employee Management</h1>
      <p>Manage your employees here.</p>
    </div>
  )
}