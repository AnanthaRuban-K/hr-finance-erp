"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { 
  LineChart, BarChart, PieChart, 
  Line, Bar, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer
} from "recharts"
import { 
  Download, FileText, Share2
} from "lucide-react"

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample financial data
const financialData = [
  { date: "2024-04-01", revenue: 5222, profit: 1800, hardware: 3000, software: 1500, services: 722 },
  { date: "2024-04-15", revenue: 6097, profit: 2100, hardware: 3500, software: 1800, services: 797 },
  { date: "2024-05-01", revenue: 7167, profit: 2400, hardware: 4000, software: 2200, services: 967 },
  { date: "2024-05-15", revenue: 8242, profit: 2700, hardware: 4500, software: 2500, services: 1242 },
  { date: "2024-06-01", revenue: 9373, profit: 3000, hardware: 5000, software: 2800, services: 1573 },
  { date: "2024-06-15", revenue: 10301, profit: 3300, hardware: 5500, software: 3100, services: 1701 },
  { date: "2024-07-01", revenue: 11245, profit: 3600, hardware: 6000, software: 3400, services: 1845 },
]

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Category data for pie chart
const categoryData = [
  { name: 'Hardware', value: 5500 },
  { name: 'Software', value: 3100 },
  { name: 'Services', value: 1701 },
];

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = useState("90d")
  const [activeTab, setActiveTab] = useState('revenue')
  const [filteredData, setFilteredData] = useState<{ date: string; revenue: number; profit: number; hardware: number; software: number; services: number; }[]>([])
  
  // Filter data based on selected time range
  useEffect(() => {
    const filterData = () => {
      const referenceDate = new Date("2024-07-01")
      let daysToSubtract = 90
      
      if (timeRange === "30d") {
        daysToSubtract = 30
      } else if (timeRange === "7d") {
        daysToSubtract = 7
      }
      
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      
      const filtered = financialData.filter(item => {
        const date = new Date(item.date)
        return date >= startDate
      })
      
      setFilteredData(filtered)
    }
    
    filterData()
  }, [timeRange])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>
          Track your company financial performance
        </CardDescription>
        
        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            <Button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100">
  <Download size={18} />
  Export
</Button>
            <Button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100">
              <FileText size={18} />
              Report
            </Button>
            <Button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100">
              <Share2 size={18} />
              Share
            </Button>
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Quarterly</SelectItem>
              <SelectItem value="30d">Monthly</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="profit">Profit</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          {/* Revenue Tab - Line Chart */}
          <TabsContent value="revenue">
            <div className="h-[350px] w-full">
              <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip labelFormatter={formatDate} formatter={(value) => [`${value}`, 'Revenue']} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          {/* Profit Tab - Bar Chart */}
          <TabsContent value="profit">
            <div className="h-[350px] w-full">
              <h3 className="text-lg font-medium mb-4">Profit Analysis</h3>
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip labelFormatter={formatDate} formatter={(value) => [`${value}`, 'Profit']} />
                    <Legend />
                    <Bar dataKey="profit" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          {/* Categories Tab - Pie Chart */}
          <TabsContent value="categories">
            <div className="h-[350px] w-full">
              <h3 className="text-lg font-medium mb-4">Revenue by Category</h3>
              <div className="w-full h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Value']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}