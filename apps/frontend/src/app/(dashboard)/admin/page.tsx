
import { ChartAreaInteractive } from "@/components/admin/dashboard/chart-area-interactive"
import { DataTable } from "@/components/admin/dashboard/data-table"
import { SectionCards } from "@/components/admin/dashboard/section-cards"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "@/app/(dashboard)/admin/data/data.json"
import { ExpenseManagement } from "@/components/admin/dashboard/expense-management"
import { PayrollSummary } from "@/components/admin/dashboard/payroll-summary"
import { ProjectTracking } from "@/components/admin/dashboard/project-tracking"
import { RecentTransactions } from "@/components/admin/dashboard/recent-transactions"

export default function AdminDashboard() {
  return (
    
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      
      <SidebarInset>
      
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChartAreaInteractive />
                <PayrollSummary />
                </div>
              </div>
              <DataTable
                data={data
                  .filter(item => ["Active", "On Leave", "Terminated"].includes(item.status)) // Ensure status matches expected values
                  .map(item => ({
                    ...item,
                    status: item.status as "Active" | "On Leave" | "Terminated", // Cast status to the expected type
                    startDate: new Date(item.hireDate), // Assuming hireDate can be used as startDate
                  }))}
              />
             
             <div className="px-4 lg:px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <ExpenseManagement />
    
    <ProjectTracking
      projects={[
        {
          id: "1",
          name: "Project Alpha",
          description: "Description of Project Alpha",
          progress: 75,
          status: "on-track",
          team: ["Alice", "Bob"],
          dueDate: "2025-12-31",
        },
        {
          id: "2",
          name: "Project Beta",
          description: "Description of Project Beta",
          progress: 50,
          status: "at-risk",
          team: ["Charlie", "David"],
          dueDate: "2025-11-30",
        },
      ]}
    />
    <RecentTransactions transactions={[]}/>
  </div>
</div>


            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
