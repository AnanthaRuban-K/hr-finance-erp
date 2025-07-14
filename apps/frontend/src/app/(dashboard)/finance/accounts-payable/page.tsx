"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Plus,
  ArrowRight,
  CreditCard,
  Package,
  Truck,
  Building,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie
} from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { RoleGuard } from "@/components/auth/role-guard";
import { UserRole } from "@/types/auth";

// Sample data for the dashboard
const dashboardData = {
  totalPayables: 485620,
  paidThisMonth: 142350,
  pendingPayments: 89750,
  overduePayments: 25620,
  totalVendors: 147,
  activeVendors: 134,
  avgPaymentDays: 28,
  monthlyGrowth: 12.5
};

// Sample vendor data with enhanced information
const topVendors = [
  {
    id: 1,
    name: "TechSupply Corp",
    avatar: null,
    category: "Technology",
    totalOwed: 45800,
    lastPayment: "2024-01-15",
    status: "active",
    paymentTerms: "Net 30",
    invoiceCount: 8
  },
  {
    id: 2,
    name: "Office Solutions Ltd",
    avatar: null,
    category: "Office Supplies",
    totalOwed: 28900,
    lastPayment: "2024-01-20",
    status: "active",
    paymentTerms: "Net 15",
    invoiceCount: 12
  },
  {
    id: 3,
    name: "Manufacturing Plus",
    avatar: null,
    category: "Manufacturing",
    totalOwed: 67200,
    lastPayment: "2024-01-10",
    status: "active",
    paymentTerms: "Net 45",
    invoiceCount: 6
  },
  {
    id: 4,
    name: "Logistics Express",
    avatar: null,
    category: "Logistics",
    totalOwed: 19400,
    lastPayment: "2024-01-25",
    status: "active",
    paymentTerms: "Net 30",
    invoiceCount: 15
  },
  {
    id: 5,
    name: "Consulting Group",
    avatar: null,
    category: "Services",
    totalOwed: 35600,
    lastPayment: "2024-01-18",
    status: "active",
    paymentTerms: "Net 30",
    invoiceCount: 4
  }
];

// Recent bills and payments
const recentBills = [
  {
    id: 1,
    billNumber: "BILL-2024-001",
    vendor: "TechSupply Corp",
    amount: 12500,
    dueDate: "2024-02-15",
    status: "pending",
    category: "Technology"
  },
  {
    id: 2,
    billNumber: "BILL-2024-002",
    vendor: "Office Solutions Ltd",
    amount: 3200,
    dueDate: "2024-02-10",
    status: "overdue",
    category: "Office Supplies"
  },
  {
    id: 3,
    billNumber: "BILL-2024-003",
    vendor: "Manufacturing Plus",
    amount: 45800,
    dueDate: "2024-02-20",
    status: "pending",
    category: "Manufacturing"
  },
  {
    id: 4,
    billNumber: "BILL-2024-004",
    vendor: "Logistics Express",
    amount: 8900,
    dueDate: "2024-02-08",
    status: "paid",
    category: "Logistics"
  },
  {
    id: 5,
    billNumber: "BILL-2024-005",
    vendor: "Consulting Group",
    amount: 15600,
    dueDate: "2024-02-25",
    status: "pending",
    category: "Services"
  }
];

// Monthly trends data
const monthlyTrends = [
  { month: 'Jul', paid: 125000, pending: 45000, overdue: 12000 },
  { month: 'Aug', paid: 135000, pending: 52000, overdue: 18000 },
  { month: 'Sep', paid: 142000, pending: 48000, overdue: 15000 },
  { month: 'Oct', paid: 158000, pending: 55000, overdue: 22000 },
  { month: 'Nov', paid: 162000, pending: 49000, overdue: 19000 },
  { month: 'Dec', paid: 148000, pending: 62000, overdue: 28000 },
  { month: 'Jan', paid: 142350, pending: 89750, overdue: 25620 }
];

// Category breakdown data
const categoryBreakdown = [
  { name: 'Technology', value: 145800, color: '#8884d8', percentage: 30 },
  { name: 'Office Supplies', value: 98200, color: '#82ca9d', percentage: 20 },
  { name: 'Manufacturing', value: 126400, color: '#ffc658', percentage: 26 },
  { name: 'Logistics', value: 67200, color: '#ff7300', percentage: 14 },
  { name: 'Services', value: 48020, color: '#00ff88', percentage: 10 }
];

// Payment status data
const paymentStatusData = [
  { name: 'Paid', value: 142350, color: '#10b981' },
  { name: 'Pending', value: 89750, color: '#f59e0b' },
  { name: 'Overdue', value: 25620, color: '#ef4444' }
];

export default function AccountsPayableOverview() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { variant: "default" as const, label: "Paid", color: "text-green-600" },
      pending: { variant: "secondary" as const, label: "Pending", color: "text-yellow-600" },
      overdue: { variant: "destructive" as const, label: "Overdue", color: "text-red-600" },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      'Technology': Package,
      'Office Supplies': Package,
      'Manufacturing': Building,
      'Logistics': Truck,
      'Services': Users
    };
    return iconMap[category as keyof typeof iconMap] || Package;
  };

  // Calculate key metrics
  const totalOutstanding = dashboardData.pendingPayments + dashboardData.overduePayments;
  const paymentHealth = ((dashboardData.paidThisMonth / (dashboardData.paidThisMonth + totalOutstanding)) * 100);
  const overduePercentage = ((dashboardData.overduePayments / totalOutstanding) * 100);

  return (
    <RoleGuard allowedRoles={[UserRole.FINANCE_MANAGER, UserRole.ADMIN]}>
      <div className="space-y-6">
        <PageHeader
          title="Accounts Payable"
          description="Monitor vendor payments, track outstanding bills, and manage cash flow"
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
            <Link href="/finance/accounts-payable/vendors/create">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Vendor
              </Button>
            </Link>
          </div>
        </PageHeader>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payables</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalPayables)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{dashboardData.monthlyGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">{formatCurrency(dashboardData.overduePayments)}</span> overdue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.activeVendors}</div>
              <p className="text-xs text-muted-foreground">
                of {dashboardData.totalVendors} total vendors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Payment Days</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.avgPaymentDays}</div>
              <p className="text-xs text-muted-foreground">
                Target: 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
                <CardDescription>Monthly payment analysis over the last 7 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="paid" 
                      stackId="1" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.8}
                      name="Paid"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pending" 
                      stackId="1" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.8}
                      name="Pending"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="overdue" 
                      stackId="1" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.8}
                      name="Overdue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Current payables breakdown by vendor category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    {categoryBreakdown.map((category) => {
                      const IconComponent = getCategoryIcon(category.name);
                      return (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatCurrency(category.value)}</div>
                            <div className="text-xs text-muted-foreground">{category.percentage}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ percentage }) => `${percentage}%`}
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Info and Actions */}
          <div className="space-y-6">
            {/* Payment Health */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Health</CardTitle>
                <CardDescription>Overall payment performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Payment Rate</span>
                    <span className="text-sm text-muted-foreground">{paymentHealth.toFixed(1)}%</span>
                  </div>
                  <Progress value={paymentHealth} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overdue Rate</span>
                    <span className="text-sm text-muted-foreground">{overduePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={overduePercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  {paymentStatusData.map((status) => (
                    <div key={status.name} className="text-center">
                      <div className="text-lg font-bold" style={{ color: status.color }}>
                        {formatCurrency(status.value)}
                      </div>
                      <div className="text-xs text-muted-foreground">{status.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Vendors */}
            <Card>
              <CardHeader>
                <CardTitle>Top Vendors by Amount</CardTitle>
                <CardDescription>Vendors with highest outstanding balances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topVendors.slice(0, 5).map((vendor) => {
                  const IconComponent = getCategoryIcon(vendor.category);
                  return (
                    <div key={vendor.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={vendor.avatar || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(vendor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{vendor.name}</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <IconComponent className="h-3 w-3 mr-1" />
                            {vendor.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(vendor.totalOwed)}</div>
                        <div className="text-xs text-muted-foreground">{vendor.invoiceCount} bills</div>
                      </div>
                    </div>
                  );
                })}
                <Link href="/finance/accounts-payable/vendors">
                  <Button variant="outline" className="w-full mt-4">
                    View All Vendors
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/finance/accounts-payable/bills/create">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Bill
                  </Button>
                </Link>
                <Link href="/finance/accounts-payable/payments/create">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                </Link>
                <Link href="/finance/accounts-payable/vendors/create">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>
                </Link>
                <Link href="/finance/accounts-payable/reports">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Bills Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bills</CardTitle>
                <CardDescription>Latest bills requiring attention</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill #</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBills.map((bill) => {
                  const statusConfig = getStatusBadge(bill.status);
                  const IconComponent = getCategoryIcon(bill.category);
                  const isOverdue = bill.status === 'overdue';
                  
                  return (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.billNumber}</TableCell>
                      <TableCell>{bill.vendor}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IconComponent className="h-4 w-4 mr-2 text-muted-foreground" />
                          {bill.category}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(bill.amount)}</TableCell>
                      <TableCell className={isOverdue ? 'text-red-600' : ''}>
                        {formatDate(bill.dueDate)}
                        {isOverdue && <AlertTriangle className="h-3 w-3 inline ml-1" />}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {bill.status !== 'paid' && (
                            <Button variant="ghost" size="sm">
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing 5 of 47 bills
              </p>
              <Link href="/finance/accounts-payable/bills">
                <Button variant="outline">
                  View All Bills
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}