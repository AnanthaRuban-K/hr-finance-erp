"use client"

import React, { useState } from "react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart as LineChartIcon,
  Layout,
  Download,
  
  ArrowUpRight,
  DollarSign,
  CalendarDays,
  Users,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  
  Line,
  ComposedChart,

  Area
} from "recharts"

interface DepartmentData {
  name: string
  value: number
  budget?: number
  headcount: number
}

const defaultDepartmentData: DepartmentData[] = [
  { name: "Engineering", value: 42000, budget: 40000, headcount: 45 },
  { name: "Marketing", value: 28000, budget: 30000, headcount: 22 },
  { name: "Sales", value: 35000, budget: 35000, headcount: 30 },
  { name: "Operations", value: 22000, budget: 20000, headcount: 18 },
  { name: "Admin", value: 18000, budget: 15000, headcount: 12 },
  { name: "HR", value: 15000, budget: 14000, headcount: 8 }
]

interface MonthlyData {
  month: string
  payroll: number
  budget: number
  overtime: number
  bonuses: number
}

const defaultMonthlyData: MonthlyData[] = [
  { month: "Nov", payroll: 145000, budget: 150000, overtime: 4500, bonuses: 12000 },
  { month: "Dec", payroll: 152000, budget: 150000, overtime: 5200, bonuses: 15000 },
  { month: "Jan", payroll: 148000, budget: 152000, overtime: 3800, bonuses: 13500 },
  { month: "Feb", payroll: 153000, budget: 152000, overtime: 4100, bonuses: 14000 },
  { month: "Mar", payroll: 157000, budget: 155000, overtime: 4800, bonuses: 16000 },
  { month: "Apr", payroll: 160000, budget: 155000, overtime: 5100, bonuses: 17000 }
]

interface PayrollSummaryProps {
  departmentData?: DepartmentData[]
  monthlyData?: MonthlyData[]
  className?: string
}

export function PayrollSummary({
  departmentData = defaultDepartmentData,
  monthlyData = defaultMonthlyData,
  className = "w-full"
}: PayrollSummaryProps) {
  const [activeTab, setActiveTab] = useState("monthly")
  const totalCurrentPayroll = departmentData.reduce((acc, curr) => acc + curr.value, 0)
  const totalBudget = departmentData.reduce((acc, curr) => acc + (curr.budget || 0), 0)
  const totalVariance = totalCurrentPayroll - totalBudget
  
  // Calculate metrics for footer
  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]
  const monthlyChange = ((currentMonth.payroll - previousMonth.payroll) / previousMonth.payroll) * 100
  const ytdPayroll = monthlyData.reduce((acc, curr) => acc + curr.payroll, 0)
  const avgDepartmentPayroll = totalCurrentPayroll / departmentData.length

  // Custom bar shape with conditional coloring (removed unused renderBar function)

  // Enhanced tooltip for department view
  const CustomBarTooltip: React.FC<{ active?: boolean; payload?: { payload: DepartmentData }[] }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const variance = data.value - (data.budget || 0)
      const variancePercent = ((variance) / (data.budget || 1)) * 100
      
      return (
        <div className="bg-background p-4 rounded-lg border shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="font-medium">{data.name}</p>
              <p className="text-sm text-muted-foreground">{data.headcount} employees</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Actual:</span>
              <span className="font-semibold">${data.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Budget:</span>
              <span className="font-semibold">${data.budget?.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between items-center ${
              variance >= 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              <span>Variance:</span>
              <span>
                {variance >= 0 ? '+' : ''}
                {variancePercent.toFixed(1)}% (${Math.abs(variance).toLocaleString()})
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Enhanced line chart tooltip
  const CustomLineTooltip: React.FC<{ active?: boolean; payload?: { payload: MonthlyData }[] }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const payrollVsBudget = ((data.payroll - data.budget) / data.budget) * 100
      
      return (
        <div className="bg-background p-4 rounded-lg border shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <CalendarDays className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="font-medium">{data.month} 2024</p>
              <p className="text-sm text-muted-foreground">
                Payroll and budget details
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payroll:</span>
              <span className="font-semibold">${data.payroll.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Budget:</span>
              <span className="font-semibold">${data.budget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Overtime:</span>
              <span className="font-semibold">${data.overtime.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Bonuses:</span>
              <span className="font-semibold">${data.bonuses.toLocaleString()}</span>
            </div>
            <div className={`text-sm ${
              payrollVsBudget >= 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {payrollVsBudget >= 0 ? 'Over' : 'Under'} budget by {Math.abs(payrollVsBudget).toFixed(1)}%
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 ">
              <DollarSign className="h-6 w-6 text-green-500" />
              <div>
                Payroll Analytics Dashboard
                <p className="text-sm text-muted-foreground mt-1 font-normal">
                  YTD Total: ${ytdPayroll.toLocaleString()} • Avg Department: ${Math.round(avgDepartmentPayroll).toLocaleString()}
                </p>
              </div>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button className="gap-2 border border-gray-300 bg-white hover:bg-gray-100 px-2 py-1 text-sm">
  <Download className="h-4 w-4" />
  Export Report
</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="monthly" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                <span>Monthly Trend</span>
              </TabsTrigger>
              <TabsTrigger value="department" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span>Department Analysis</span>
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {activeTab === "monthly" ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-indigo-500" />
                    Actual Payroll
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    Budget
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-indigo-500" />
                    Actual
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-foreground/20" />
                    Budget
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    Over Budget
                  </div>
                </>
              )}
            </div>
          </div>
          
          <TabsContent value="monthly" className="mt-0">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="payroll"
                    fill="url(#lineGradient)"
                    stroke="#4f46e5"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: "#10b981" }}
                  />
                  <ReferenceLine 
                    y={currentMonth.budget} 
                    stroke="#10b981"
                    strokeDasharray="3 3"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="department" className="mt-0">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  />
                  <YAxis 
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <ReferenceLine 
                  y={totalBudget / departmentData.length} 
                  stroke="#34d399"
                  strokeDasharray="4 4"
                  label={{
                    value: `Avg Budget: $${Math.round((totalBudget / departmentData.length) / 1000)}k`,
                    position: 'top',
                    fill: "#34d399",
                    fontSize: 12
                  }}
                  />
                  <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  animationDuration={600}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t px-6 py-4 bg-muted/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {monthlyChange >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <div>
              <p className="font-medium">
                {Math.abs(monthlyChange).toFixed(1)}% {monthlyChange >= 0 ? 'increase' : 'decrease'}
              </p>
              <p className="text-sm text-muted-foreground">
                Month-over-month change
              </p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="font-medium">
                ${totalVariance >= 0 ? '+' : '-'}${Math.abs(totalVariance).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Total budget variance
              </p>
            </div>
          </div>
        </div>
        <Button className="gap-2 border border-gray-300 bg-white hover:bg-gray-100">
  Detailed Analysis
  <ArrowUpRight className="h-4 w-4" />
</Button>
      </CardFooter>
    </Card>
  )
}