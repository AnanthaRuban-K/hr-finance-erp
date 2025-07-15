'use client';

import { useAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ClientOnly } from '@/components/client-only';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  Settings, 
  Users, 
  Shield,
  Activity,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Globe,
  Lock,
  UserPlus,
  HardDrive,
  Cpu,
  Download,
  FileText,
  Share,
  Filter as FilterIcon,
  Plus as PlusIcon,
  LineChart as LineChartIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Calendar as CalendarIcon,
  ChevronRight as ChevronRightIcon,
  AlertCircle as AlertCircleIcon,
  CheckCircle2 as CheckCircle2Icon,
  Clock as ClockIcon,
  DollarSign,
  CreditCard,
  Wallet,
  PieChart as PieChartIcon,
  Search,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Building,
  Target,
  Calendar,
  CheckSquare,
  Bell,
  BellRing,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { Permission } from '@/types/auth';
import { useState } from 'react';

function AdminDashboardContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Financial Data
  const financialOverview = {
    monthly: {
      revenue: 2847500,
      profit: 684200,
      expenses: 1243200,
      growth: 5.2
    },
    quarterly: {
      revenue: 8542500,
      profit: 2052600,
      expenses: 3729600,
      growth: 12.8
    }
  };

  const revenueByCategory = [
    { name: 'Software Development', value: 1200000, color: '#0088FE' },
    { name: 'Consulting', value: 850000, color: '#00C49F' },
    { name: 'Support Services', value: 450000, color: '#FFBB28' },
    { name: 'Training', value: 347500, color: '#FF8042' },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 2400000, profit: 580000, expenses: 1100000 },
    { month: 'Feb', revenue: 2650000, profit: 620000, expenses: 1150000 },
    { month: 'Mar', revenue: 2847500, profit: 684200, expenses: 1243200 },
    { month: 'Apr', revenue: 2950000, profit: 720000, expenses: 1280000 },
    { month: 'May', revenue: 3100000, profit: 765000, expenses: 1320000 },
    { month: 'Jun', revenue: 3250000, profit: 812000, expenses: 1380000 },
  ];

  const payrollByDepartment = [
    { department: 'Engineering', amount: 1200000, employees: 85, avgSalary: 14118 },
    { department: 'Sales', amount: 675000, employees: 45, avgSalary: 15000 },
    { department: 'Marketing', amount: 420000, employees: 28, avgSalary: 15000 },
    { department: 'Finance', amount: 330000, employees: 22, avgSalary: 15000 },
    { department: 'HR', amount: 180000, employees: 12, avgSalary: 15000 },
    { department: 'Operations', amount: 525000, employees: 35, avgSalary: 15000 },
  ];

  const recentTransactions = [
    { id: 1, date: '2024-01-15', type: 'Payroll', description: 'Monthly Salary Payment', amount: -2847500, status: 'completed', category: 'salary' },
    { id: 2, date: '2024-01-14', type: 'Revenue', description: 'Client Payment - TechCorp', amount: 450000, status: 'completed', category: 'income' },
    { id: 3, date: '2024-01-12', type: 'Expense', description: 'Office Rent Q1 2024', amount: -45000, status: 'pending', category: 'operational' },
    { id: 4, date: '2024-01-10', type: 'Revenue', description: 'Consulting Services - StartupX', amount: 125000, status: 'completed', category: 'consulting' },
    { id: 5, date: '2024-01-08', type: 'Expense', description: 'Software Licenses', amount: -28500, status: 'completed', category: 'technology' },
  ];

  const expenses = [
    { id: 1, date: '2024-01-15', category: 'Office Rent', amount: 45000, status: 'pending', department: 'Operations' },
    { id: 2, date: '2024-01-14', category: 'Software Licenses', amount: 28500, status: 'approved', department: 'IT' },
    { id: 3, date: '2024-01-12', category: 'Marketing Campaign', amount: 15000, status: 'pending', department: 'Marketing' },
    { id: 4, date: '2024-01-10', category: 'Team Building', amount: 8500, status: 'approved', department: 'HR' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Board Meeting', date: '2024-01-20', time: '10:00 AM', attendees: 12, type: 'meeting' },
    { id: 2, title: 'Quarterly Review', date: '2024-01-25', time: '2:00 PM', attendees: 45, type: 'review' },
    { id: 3, title: 'Team Building Event', date: '2024-01-28', time: 'All Day', attendees: 120, type: 'event' },
    { id: 4, title: 'Client Presentation', date: '2024-02-02', time: '9:00 AM', attendees: 8, type: 'presentation' },
  ];

  const projects = [
    { id: 1, name: 'Customer Portal V2', progress: 75, status: 'on-track', team: 4, deadline: '2024-02-15', budget: 250000 },
    { id: 2, name: 'Mobile App Integration', progress: 45, status: 'behind', team: 3, deadline: '2024-01-30', budget: 180000 },
    { id: 3, name: 'AI Analytics Dashboard', progress: 90, status: 'ahead', team: 6, deadline: '2024-02-01', budget: 320000 },
    { id: 4, name: 'Security Audit', progress: 30, status: 'on-track', team: 2, deadline: '2024-03-15', budget: 120000 },
  ];

  const employees = [
    { id: 1, name: 'John Smith', position: 'Senior Developer', department: 'Engineering', salary: 120000, status: 'active', joinDate: '2023-01-15' },
    { id: 2, name: 'Sarah Johnson', position: 'Product Manager', department: 'Product', salary: 135000, status: 'active', joinDate: '2023-03-20' },
    { id: 3, name: 'Michael Chen', position: 'Sales Director', department: 'Sales', salary: 150000, status: 'active', joinDate: '2022-11-10' },
    { id: 4, name: 'Emily Davis', position: 'UX Designer', department: 'Design', salary: 95000, status: 'active', joinDate: '2023-05-08' },
    { id: 5, name: 'David Wilson', position: 'Finance Manager', department: 'Finance', salary: 125000, status: 'active', joinDate: '2022-09-12' },
  ];

  const tasks = [
    { id: 1, title: 'Complete Q4 Financial Report', assignee: 'David Wilson', priority: 'high', dueDate: '2024-01-18', status: 'in-progress' },
    { id: 2, title: 'Review Security Policies', assignee: 'Admin Team', priority: 'medium', dueDate: '2024-01-22', status: 'pending' },
    { id: 3, title: 'Update Employee Handbook', assignee: 'Sarah Johnson', priority: 'low', dueDate: '2024-01-25', status: 'pending' },
    { id: 4, title: 'System Backup Verification', assignee: 'IT Team', priority: 'high', dueDate: '2024-01-16', status: 'completed' },
  ];

  const notifications = [
    { id: 1, title: 'System Maintenance Scheduled', message: 'Planned maintenance on Jan 20, 2024', type: 'info', time: '2 hours ago' },
    { id: 2, title: 'Budget Threshold Alert', message: 'Marketing department reached 80% of budget', type: 'warning', time: '4 hours ago' },
    { id: 3, title: 'New Employee Onboarded', message: 'Alex Thompson joined Engineering team', type: 'success', time: '6 hours ago' },
    { id: 4, title: 'Security Alert', message: 'Multiple failed login attempts detected', type: 'error', time: '8 hours ago' },
  ];

  const formatSGD = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(amount);
  };

  // Type-safe formatter for charts
  const chartFormatter = (value: any) => {
    const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    return formatSGD(numValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'active': case 'approved': return 'text-green-600';
      case 'pending': case 'in-progress': return 'text-yellow-600';
      case 'behind': case 'error': return 'text-red-600';
      case 'on-track': case 'ahead': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'bg-green-100 text-green-800',
      'active': 'bg-green-100 text-green-800',
      'approved': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'behind': 'bg-red-100 text-red-800',
      'on-track': 'bg-blue-100 text-blue-800',
      'ahead': 'bg-purple-100 text-purple-800',
    };
    return <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const currentData = financialOverview[selectedPeriod];

  return (
    <RoleGuard requiredPermission={Permission.SYSTEM_CONFIG}>
      <div className="space-y-6 bg-gray-50 min-h-screen p-6">
        <PageHeader
          title={`Executive Dashboard`}
          description="Comprehensive business intelligence and system administration for Singapore operations"
        >
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </PageHeader>

        {/* Financial Overview Section */}
        <div className="grid gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white">Financial Overview</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedPeriod === 'monthly' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedPeriod('monthly')}
                    className="text-black border-white"
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={selectedPeriod === 'quarterly' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedPeriod('quarterly')}
                    className="text-black border-white"
                  >
                    Quarterly
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-6 w-6 mr-2" />
                    <span className="text-sm opacity-90">Revenue</span>
                  </div>
                  <p className="text-2xl font-bold">{formatSGD(currentData.revenue)}</p>
                  <div className="flex items-center justify-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+{currentData.growth}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUpIcon className="h-6 w-6 mr-2" />
                    <span className="text-sm opacity-90">Profit</span>
                  </div>
                  <p className="text-2xl font-bold">{formatSGD(currentData.profit)}</p>
                  <div className="flex items-center justify-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+8.2%</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CreditCard className="h-6 w-6 mr-2" />
                    <span className="text-sm opacity-90">Expenses</span>
                  </div>
                  <p className="text-2xl font-bold">{formatSGD(currentData.expenses)}</p>
                  <div className="flex items-center justify-center mt-1">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span className="text-sm">-2.1%</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <PieChartIcon className="h-6 w-6 mr-2" />
                    <span className="text-sm opacity-90">Margin</span>
                  </div>
                  <p className="text-2xl font-bold">24.0%</p>
                  <div className="flex items-center justify-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+1.5%</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <Button variant="secondary" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="secondary" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Report
                </Button>
                <Button variant="secondary" size="sm">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue, profit, and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={chartFormatter} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
                    <Line type="monotone" dataKey="profit" stroke="#059669" strokeWidth={3} />
                    <Line type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Revenue distribution across business units</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={revenueByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                                              <Tooltip formatter={chartFormatter} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Management Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Expense Management Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Expense Management
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    New Expense
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.slice(0, 3).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{expense.category}</p>
                      <p className="text-xs text-muted-foreground">{expense.department} • {expense.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatSGD(expense.amount)}</p>
                      {getStatusBadge(expense.status)}
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-blue-600">
                  View All Expenses
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Summary Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Payroll Summary
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{formatSGD(2847500)}</p>
                  <p className="text-sm text-muted-foreground">Total Monthly Payroll</p>
                </div>
                <div className="space-y-2">
                  {payrollByDepartment.slice(0, 3).map((dept) => (
                    <div key={dept.department} className="flex justify-between items-center">
                      <span className="text-sm">{dept.department}</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatSGD(dept.amount)}</p>
                        <p className="text-xs text-muted-foreground">{dept.employees} employees</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full text-blue-600">
                  View Department Breakdown
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                    </div>
                    <Badge variant="outline">{event.attendees}</Badge>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-blue-600">
                  View All Events
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Tracking Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Project Tracking
                </CardTitle>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">{project.name}</p>
                      {getStatusBadge(project.status)}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{project.team} team members</span>
                      <span>{project.deadline}</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <p className="text-xs text-right">{project.progress}% complete</p>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-blue-600">
                  View All Projects
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employee Management Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Employee Management
                </CardTitle>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">Employee List</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <FilterIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {employees.slice(0, 3).map((employee) => (
                      <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.position} • {employee.department}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="analytics">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xl font-bold text-blue-600">247</p>
                        <p className="text-xs text-muted-foreground">Total Employees</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xl font-bold text-green-600">93.5%</p>
                        <p className="text-xs text-muted-foreground">Attendance Rate</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent Transactions Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.slice(0, 4).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.type} • {transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatSGD(Math.abs(transaction.amount))}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-blue-600">
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Management and Notifications Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Task Management Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <CheckSquare className="mr-2 h-5 w-5" />
                  Task Management
                </CardTitle>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className={`border-l-4 pl-3 py-2 ${getPriorityColor(task.priority)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Assigned to: {task.assignee} • Due: {task.dueDate}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                          {task.priority}
                        </Badge>
                        {getStatusBadge(task.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-blue-600">
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellRing className="mr-2 h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className={`p-1 rounded-full ${
                      notification.type === 'error' ? 'bg-red-100' :
                      notification.type === 'warning' ? 'bg-yellow-100' :
                      notification.type === 'success' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      {notification.type === 'error' && <AlertCircleIcon className="h-4 w-4 text-red-600" />}
                      {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {notification.type === 'info' && <Bell className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-blue-600">
                  View All Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Advanced Analytics
            </CardTitle>
            <CardDescription>Comprehensive business metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="financial" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
                <TabsTrigger value="hr">Human Resources</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="financial" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payroll by Department</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={payrollByDepartment}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="department" />
                          <YAxis />
                          <Tooltip formatter={chartFormatter} />
                          <Bar dataKey="amount" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Financial Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={chartFormatter} />
                          <Area type="monotone" dataKey="revenue" stackId="1" stroke="#2563eb" fill="#3b82f6" />
                          <Area type="monotone" dataKey="profit" stackId="2" stroke="#059669" fill="#10b981" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="operations" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">System Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>CPU Usage</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={65} className="w-24" />
                            <span className="text-sm">65%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Memory Usage</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={78} className="w-24" />
                            <span className="text-sm">78%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Storage Usage</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={45} className="w-24" />
                            <span className="text-sm">45%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Network Usage</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={85} className="w-24" />
                            <span className="text-sm">85%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">Database backup completed</p>
                            <p className="text-xs text-muted-foreground">2 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">New user registered</p>
                            <p className="text-xs text-muted-foreground">5 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">System update available</p>
                            <p className="text-xs text-muted-foreground">10 minutes ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="hr" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Employee Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            dataKey="employees"
                            data={payrollByDepartment}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label={({ department, employees }) => `${department}: ${employees}`}
                          >
                            {payrollByDepartment.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">HR Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Employee Satisfaction</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={88} className="w-24" />
                            <span className="text-sm">88%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Retention Rate</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={92} className="w-24" />
                            <span className="text-sm">92%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Training Completion</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={76} className="w-24" />
                            <span className="text-sm">76%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Performance Average</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={85} className="w-24" />
                            <span className="text-sm">85%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Project Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div key={project.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{project.name}</span>
                              <span className="text-sm">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{project.team} members</span>
                              <span>{project.deadline}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Project Budget Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={projects}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={chartFormatter} />
                          <Bar dataKey="budget" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions Footer */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-blue-50 border-blue-200">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Add User</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-green-50 border-green-200">
                <PlusIcon className="h-6 w-6 text-green-600" />
                <span className="text-sm">New Expense</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-purple-50 border-purple-200">
                <Calendar className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Schedule Event</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-orange-50 border-orange-200">
                <Target className="h-6 w-6 text-orange-600" />
                <span className="text-sm">New Project</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-indigo-50 border-indigo-200">
                <CheckSquare className="h-6 w-6 text-indigo-600" />
                <span className="text-sm">Assign Task</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-red-50 border-red-200">
                <Download className="h-6 w-6 text-red-600" />
                <span className="text-sm">Export Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}

export default function AdminDashboard() {
  return (
    <ClientOnly fallback={
      <div className="space-y-6 bg-gray-50 min-h-screen p-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </ClientOnly>
  );
}