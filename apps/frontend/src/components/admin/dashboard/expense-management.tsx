"use client"

import React from "react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Filter as FilterIcon, 
  Plus as PlusIcon, 
  LineChart as LineChartIcon,
  MoreHorizontal as MoreHorizontalIcon 
} from "lucide-react"

// Define the expense item type
interface ExpenseItem {
  id: string
  name: string
  date: string
  category: string
  amount: number
  status: "Approved" | "Pending"
}

// Sample expense data - in a real app this would come from props or a data fetch
const defaultExpenseItems: ExpenseItem[] = [
  {
    id: "exp-001",
    name: "Office Supplies",
    date: "May 3, 2025",
    category: "Operations",
    amount: 239.50,
    status: "Approved"
  },
  {
    id: "exp-002",
    name: "Client Lunch Meeting",
    date: "May 2, 2025",
    category: "Meals & Entertainment",
    amount: 87.25,
    status: "Pending"
  },
  {
    id: "exp-003",
    name: "Software Subscription",
    date: "May 1, 2025",
    category: "Technology",
    amount: 49.99,
    status: "Approved"
  }
]

interface ExpenseManagementProps {
  expenseItems?: ExpenseItem[]
}

export function ExpenseManagement({ 
  expenseItems = defaultExpenseItems 
}: ExpenseManagementProps) {
  return (
    <Card >
      <CardHeader className="pb-3 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold">Expense Management</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track and manage company expenses
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-100 px-2 py-1 text-sm">
  <FilterIcon className="h-4 w-4" />
  <span>Filter</span>
</Button>
<Button className="flex items-center gap-1 px-2 py-1 text-sm">
  <PlusIcon className="h-4 w-4" />
  <span>New Expense</span>
</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-3">
          {expenseItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition"
            >
              {/* Left Info */}
              <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-600 p-2 rounded-full">
                  <LineChartIcon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <div className="text-xs text-muted-foreground flex gap-2">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>

              {/* Right Info */}
              <div className="flex items-center gap-x-6">
                <span className="font-semibold text-sm text-gray-800">
                  ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'Approved'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {item.status}
                </span>
                <MoreHorizontalIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}