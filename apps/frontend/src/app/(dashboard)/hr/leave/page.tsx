"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Download,
  RefreshCw,
  MoreHorizontal,
  User,
  CalendarDays,
  FileText,
  Bell,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { RoleGuard } from "@/components/auth/role-guard";
import { UserRole } from "@/types/auth";

// Sample leave data
const leaveApplications = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "John Smith",
    department: "Engineering",
    leaveType: "Annual Leave",
    startDate: "2024-02-15",
    endDate: "2024-02-19",
    days: 5,
    status: "pending",
    appliedDate: "2024-01-30",
    manager: "Sarah Johnson",
    reason: "Family vacation",
    avatar: null
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "Alice Brown",
    department: "Marketing",
    leaveType: "Medical Leave",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    days: 3,
    status: "approved",
    appliedDate: "2024-02-08",
    manager: "Mike Wilson",
    reason: "Medical appointment",
    avatar: null
  },
  {
    id: 3,
    employeeId: "EMP003",
    employeeName: "Bob Wilson",
    department: "Sales",
    leaveType: "Emergency Leave",
    startDate: "2024-02-08",
    endDate: "2024-02-08",
    days: 1,
    status: "rejected",
    appliedDate: "2024-02-07",
    manager: "Lisa Chen",
    reason: "Family emergency",
    avatar: null
  },
  {
    id: 4,
    employeeId: "EMP004",
    employeeName: "Carol Davis",
    department: "HR",
    leaveType: "Maternity Leave",
    startDate: "2024-03-01",
    endDate: "2024-06-15",
    days: 105,
    status: "approved",
    appliedDate: "2024-01-15",
    manager: "David Kim",
    reason: "Maternity leave",
    avatar: null
  },
  {
    id: 5,
    employeeId: "EMP005",
    employeeName: "David Lee",
    department: "Finance",
    leaveType: "Annual Leave",
    startDate: "2024-02-20",
    endDate: "2024-02-23",
    days: 4,
    status: "pending",
    appliedDate: "2024-02-01",
    manager: "Emma Thompson",
    reason: "Personal time off",
    avatar: null
  }
];

// Dashboard statistics
const dashboardStats = {
  totalApplications: 127,
  pendingApprovals: 15,
  approvedThisMonth: 42,
  rejectedThisMonth: 3,
  totalEmployees: 150,
  avgProcessingDays: 2.5
};

// Leave type statistics
const leaveTypeStats = [
  { type: "Annual Leave", count: 45, percentage: 65, color: "#3b82f6" },
  { type: "Medical Leave", count: 12, percentage: 17, color: "#ef4444" },
  { type: "Maternity Leave", count: 6, percentage: 9, color: "#ec4899" },
  { type: "Emergency Leave", count: 4, percentage: 6, color: "#f59e0b" },
  { type: "Paternity Leave", count: 2, percentage: 3, color: "#10b981" }
];

// Monthly trends
const monthlyTrends = [
  { month: 'Jan', applications: 25, approved: 22, rejected: 3 },
  { month: 'Feb', applications: 30, approved: 27, rejected: 3 },
  { month: 'Mar', applications: 22, approved: 20, rejected: 2 },
  { month: 'Apr', applications: 28, approved: 25, rejected: 3 },
  { month: 'May', applications: 35, approved: 32, rejected: 3 },
  { month: 'Jun', applications: 18, approved: 17, rejected: 1 }
];

type SortField = 'employeeName' | 'department' | 'leaveType' | 'appliedDate' | 'days';
type SortOrder = 'asc' | 'desc';

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('appliedDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = leaveApplications.filter(app => {
      const matchesTab = activeTab === 'all' || app.status === activeTab;
      const matchesSearch = searchTerm === '' || 
        app.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesTab && matchesSearch;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'appliedDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [activeTab, searchTerm, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedApplications.length / itemsPerPage);
  const paginatedApplications = filteredAndSortedApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending", icon: Clock, color: "text-yellow-600" },
      approved: { variant: "default" as const, label: "Approved", icon: CheckCircle, color: "text-green-600" },
      rejected: { variant: "destructive" as const, label: "Rejected", icon: XCircle, color: "text-red-600" },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getLeaveTypeColor = (leaveType: string) => {
    const colorMap: Record<string, string> = {
      'Annual Leave': 'bg-blue-100 text-blue-800',
      'Medical Leave': 'bg-red-100 text-red-800',
      'Maternity Leave': 'bg-pink-100 text-pink-800',
      'Paternity Leave': 'bg-green-100 text-green-800',
      'Emergency Leave': 'bg-orange-100 text-orange-800',
      'Childcare Leave': 'bg-purple-100 text-purple-800'
    };
    return colorMap[leaveType] || 'bg-gray-100 text-gray-800';
  };

  // Calculate tab counts
  const tabCounts = {
    all: leaveApplications.length,
    pending: leaveApplications.filter(app => app.status === 'pending').length,
    approved: leaveApplications.filter(app => app.status === 'approved').length,
    rejected: leaveApplications.filter(app => app.status === 'rejected').length
  };

  return (
    <RoleGuard allowedRoles={[UserRole.HR_MANAGER, UserRole.SUPERVISOR, UserRole.ADMIN, UserRole.EMPLOYEE]}>
      <div className="space-y-6">
        <PageHeader
          title="Leave Management"
          description="Manage employee leave applications, approvals, and track leave balances"
        >
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/hr/leave/apply">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Apply Leave
              </Button>
            </Link>
          </div>
        </PageHeader>

        {/* Dashboard Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.approvedThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                93% approval rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.avgProcessingDays} days</div>
              <p className="text-xs text-muted-foreground">
                -0.5 days from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Leave Trends Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Leave Application Trends</CardTitle>
              <CardDescription>Monthly leave application statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="approved" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.8}
                    name="Approved"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rejected" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.8}
                    name="Rejected"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Leave Type Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Types</CardTitle>
              <CardDescription>Distribution by leave category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaveTypeStats.map((stat) => (
                <div key={stat.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stat.type}</span>
                    <span className="text-sm text-muted-foreground">{stat.count}</span>
                  </div>
                  <div className="space-y-1">
                    <Progress value={stat.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{stat.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Leave Applications Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Leave Applications</CardTitle>
                <CardDescription>
                  Manage and track all employee leave requests
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>By Department</DropdownMenuItem>
                    <DropdownMenuItem>By Leave Type</DropdownMenuItem>
                    <DropdownMenuItem>By Date Range</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Clear Filters</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All ({tabCounts.all})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({tabCounts.pending})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({tabCounts.approved})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({tabCounts.rejected})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('department')}>
                          <div className="flex items-center">
                            Department
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('leaveType')}>
                          <div className="flex items-center">
                            Leave Type
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('appliedDate')}>
                          <div className="flex items-center">
                            Applied Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedApplications.map((application) => {
                        const statusConfig = getStatusBadge(application.status);
                        
                        return (
                          <TableRow key={application.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={application.avatar || undefined} />
                                  <AvatarFallback>{getInitials(application.employeeName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{application.employeeName}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {application.employeeId}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{application.department}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={getLeaveTypeColor(application.leaveType)}
                              >
                                {application.leaveType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{application.days} days</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(application.startDate)} - {formatDate(application.endDate)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {formatDate(application.appliedDate)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusConfig.variant}>
                                <statusConfig.icon className="h-3 w-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {application.status === 'pending' && (
                                    <>
                                      <DropdownMenuItem>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={pageSize.toString()}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}