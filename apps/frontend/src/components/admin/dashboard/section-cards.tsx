"use client"

import { IconTrendingDown, IconTrendingUp, IconCoin, IconBriefcase, IconUsers, IconClock, IconChartPie } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
      {/* Revenue Card */}
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col space-y-1.5">
            <CardDescription className="flex items-center gap-2 text-sm">
              <IconCoin className="h-4 w-4 text-green-500" />
              Total Revenue
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              $45,231
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              +20.1% vs last month
            </span>
          </div>
          <Badge className="gap-1 bg-green-500/10 text-green-500 border border-green-500">
  <IconTrendingUp className="h-4 w-4" />
  +20.1%
</Badge>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-3 text-sm">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground">Monthly Target</span>
            <span className="font-medium">$50,000</span>
          </div>
          <Progress value={90} className="h-2" />
        </CardFooter>
      </Card>

      {/* Expenses Card */}
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col space-y-1.5">
            <CardDescription className="flex items-center gap-2 text-sm">
              <IconBriefcase className="h-4 w-4 text-red-500" />
              Operational Expenses
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              $23,450
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              +12.3% vs last quarter
            </span>
          </div>
          <Badge className="gap-1 bg-red-500/10 text-red-500 border border-red-500">
  <IconTrendingUp className="h-4 w-4" />
  +12.3%
</Badge>
        </CardHeader>
        <CardFooter className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Payroll</span>
            <span className="font-medium">$18,200</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Operations</span>
            <span className="font-medium">$5,250</span>
          </div>
        </CardFooter>
      </Card>

      {/* Employees Card */}
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col space-y-1.5">
            <CardDescription className="flex items-center gap-2 text-sm">
              <IconUsers className="h-4 w-4 text-blue-500" />
              Workforce Overview
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              156 Employees
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              5 new this month
            </span>
          </div>
          <Badge className="gap-1 bg-blue-500/10 text-blue-500 border border-blue-500">
  <IconTrendingUp className="h-4 w-4" />
  +3.2%
</Badge>
        </CardHeader>
        <CardFooter className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Active</span>
            <span className="font-medium">142</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">On Leave</span>
            <span className="font-medium">8</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">New Hires</span>
            <span className="font-medium">6</span>
          </div>
        </CardFooter>
      </Card>

      {/* Hours Card */}
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col space-y-1.5">
            <CardDescription className="flex items-center gap-2 text-sm">
              <IconClock className="h-4 w-4 text-purple-500" />
              Productivity Hours
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              12,450h
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              85% utilization
            </span>
          </div>
          <Badge className="gap-1 bg-purple-500/10 text-purple-500 border border-purple-500">
  <IconTrendingUp className="h-4 w-4" />
  +7.8%
</Badge>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-3 text-sm">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground">Overtime Hours</span>
            <span className="font-medium">345h</span>
          </div>
          <Progress value={15} className="h-2" />
        </CardFooter>
      </Card>

      {/* Projects Card */}
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col space-y-1.5">
            <CardDescription className="flex items-center gap-2 text-sm">
              <IconChartPie className="h-4 w-4 text-orange-500" />
              Active Projects
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              23 Projects
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              5 delayed
            </span>
          </div>
          <Badge className="gap-1 bg-orange-500/10 text-orange-500 border border-orange-500">
  <IconTrendingDown className="h-4 w-4" />
  -2.1%
</Badge>
        </CardHeader>
        <CardFooter className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">On Track</span>
            <span className="font-medium">18</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Delayed</span>
            <span className="font-medium">5</span>
          </div>
        </CardFooter>
      </Card>

      {/* Profit Card */}
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col space-y-1.5">
            <CardDescription className="flex items-center gap-2 text-sm">
              <IconCoin className="h-4 w-4 text-emerald-500" />
              Net Profit Margin
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              24.5%
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              +4.2% YoY
            </span>
          </div>
          <Badge className="gap-1 bg-orange-500/10 text-orange-500 border border-orange-500">
            <IconTrendingUp className="h-4 w-4" />
            +4.2%
          </Badge>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-3 text-sm">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground">Gross Profit</span>
            <span className="font-medium">$32.4K</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground">Operating Costs</span>
            <span className="font-medium">$18.7K</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}