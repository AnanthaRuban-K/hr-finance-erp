"use client"

import * as React from "react"
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { format } from "date-fns"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"




interface Employee {
  id: string
  name: string
  position: string
  department: string
  status: "active" | "onboarding" | "offboarding"
  hireDate: Date
  tenure: number
  performance: number
}

interface Candidate {
  id: string
  name: string
  position: string
  stage: "applied" | "screening" | "interview" | "offer" | "hired"
  appliedDate: Date
}

interface Exit {
  id: string
  name: string
  exitDate: Date
  reason: string
  exitType: "voluntary" | "involuntary"
}

const employees: Employee[] = [
  {
    id: "EMP-1001",
    name: "Sarah Johnson",
    position: "Senior Developer",
    department: "Engineering",
    status: "active",
    hireDate: new Date("2022-03-15"),
    tenure: 2.3,
    performance: 4.5,
  },
  // Add more employees...
]

const candidates: Candidate[] = [
  {
    id: "CAN-2001",
    name: "Michael Chen",
    position: "Marketing Specialist",
    stage: "interview",
    appliedDate: new Date("2024-06-25"),
  },
  // Add more candidates...
]

const exits: Exit[] = [
  {
    id: "EXT-3001",
    name: "John Smith",
    exitDate: new Date("2024-06-01"),
    reason: "Career change",
    exitType: "voluntary",
  },
  // Add more exits...
]

const lifecycleData = [
  { stage: "Active", count: 85 },
  { stage: "Onboarding", count: 12 },
  { stage: "Offboarding", count: 3 },
]

const hiringTrends = [
  { month: "Jan", hires: 5 },
  { month: "Feb", hires: 8 },
  { month: "Mar", hires: 12 },
  // Add more months...
]

export default function EmployeeLifecycle() {
  const [selectedDepartment, setSelectedDepartment] = React.useState("all")
  const [selectedPosition, setSelectedPosition] = React.useState("all")

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
    
        <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Lifecycle Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Candidate
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Employees</CardDescription>
            <CardTitle className="text-3xl">156</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +15% from last year
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Attrition Rate</CardDescription>
            <CardTitle className="text-3xl">8.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Industry avg: 10.5%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open Positions</CardDescription>
            <CardTitle className="text-3xl">23</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              15 technical roles
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Tenure</CardDescription>
            <CardTitle className="text-3xl">3.2y</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +4 months YoY
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Employees</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="exits">Exits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Employee Distribution</CardTitle>
                <CardDescription>By lifecycle stage</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={lifecycleData}
                      dataKey="count"
                      nameKey="stage"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hiring Trends</CardTitle>
                <CardDescription>Last 12 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hiringTrends}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hires" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="flex gap-4 mb-4">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Specialist">Specialist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Tenure</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.tenure}y</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {employee.performance}/5
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.status === "active" ? "default" :
                          employee.status === "onboarding" ? "secondary" : "destructive"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>
                      {format(candidate.appliedDate, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          candidate.stage === "hired" ? "default" :
                          candidate.stage === "offer" ? "secondary" : "outline"
                        }
                      >
                        {candidate.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="exits">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Exit Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exits.map((exit) => (
                  <TableRow key={exit.id}>
                    <TableCell className="font-medium">{exit.name}</TableCell>
                    <TableCell>
                      {format(exit.exitDate, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{exit.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={exit.exitType === "voluntary" ? "default" : "destructive"}
                      >
                        {exit.exitType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Exit Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold">Employee Lifecycle Insights</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Average time-to-hire: 38 days | Onboarding completion rate: 92% |
          Exit interview completion: 85%
        </p>
      </div>
    </div>
        </SidebarInset> 
        
    </SidebarProvider>
  )
}