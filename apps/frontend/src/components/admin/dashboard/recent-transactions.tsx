"use client"

import * as React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Transaction {
  id: string
  name: string
  type: "income" | "expense"
  amount: number
  date: string
  category: string
  status: "pending" | "completed" | "failed"
}

interface TransactionCardProps {
  transactions: Transaction[]
  className?: string
}

export function RecentTransactions({ transactions, className }: TransactionCardProps) {
  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-500" />
      case "completed":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
      case "failed":
        return <AlertCircle className="h-3 w-3 text-red-500" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 days financial activities</p>
          </div>
          <Button className="gap-2 border border-gray-300 bg-white hover:bg-gray-100 px-2 py-1 text-sm">
  <Download className="h-4 w-4" />
  Export CSV
</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : 'bg-red-100 dark:bg-red-900/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">{transaction.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge 
  className="text-xs capitalize px-2 py-0.5 border border-gray-300"
>
  {transaction.category}
</Badge>
                    <span className="text-xs text-muted-foreground">
                      {transaction.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`font-medium ${
                  transaction.type === 'income' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  ${transaction.amount.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Delete Transaction
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        <Button className="text-primary gap-1 bg-transparent hover:bg-gray-100 shadow-none">
  View All Transactions
  <ChevronRight className="h-4 w-4" />
</Button>
      </CardFooter>
    </Card>
  )
}