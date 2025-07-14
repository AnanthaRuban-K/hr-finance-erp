'use client';

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

import { 
  Search, 
  Plus, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  CreditCard,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  MoreHorizontal,
  Star,
  Target
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AccountsReceivableDashboard = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('30days');

  // Sample data for the dashboard
  const summaryData = {
    totalOutstanding: 156750.00,
    overdue: 45320.50,
    dueThisWeek: 23400.00,
    collected: 89650.75,
    totalCustomers: 47,
    activeInvoices: 89,
    averageCollectionDays: 28,
    collectionRate: 94.2
  };

  const monthlyData = [
    { month: 'Jan', invoiced: 85000, collected: 78000, outstanding: 12000 },
    { month: 'Feb', invoiced: 92000, collected: 85000, outstanding: 15000 },
    { month: 'Mar', invoiced: 78000, collected: 92000, outstanding: 8000 },
    { month: 'Apr', invoiced: 95000, collected: 89000, outstanding: 18000 },
    { month: 'May', invoiced: 88000, collected: 91000, outstanding: 14000 },
    { month: 'Jun', invoiced: 102000, collected: 96000, outstanding: 22000 }
  ];

  const agingData = [
    { category: 'Current (0-30 days)', amount: 75400, percentage: 48.1, color: '#10B981' },
    { category: '31-60 days', amount: 35200, percentage: 22.4, color: '#F59E0B' },
    { category: '61-90 days', amount: 28650, percentage: 18.3, color: '#F97316' },
    { category: '90+ days', amount: 17500, percentage: 11.2, color: '#EF4444' }
  ];

  const topCustomers = [
    { name: 'TechVerse Solutions', outstanding: 25400, invoices: 12, status: 'Good', lastPayment: '2025-01-10' },
    { name: 'Alpha Corporation', outstanding: 18750, invoices: 8, status: 'Excellent', lastPayment: '2025-01-08' },
    { name: 'Brady Ltd', outstanding: 15600, invoices: 6, status: 'Good', lastPayment: '2025-01-05' },
    { name: 'Momentum Retail', outstanding: 12300, invoices: 9, status: 'Watch', lastPayment: '2024-12-28' },
    { name: 'Eta Corporation', outstanding: 9850, invoices: 4, status: 'Good', lastPayment: '2025-01-12' }
  ];

  const recentInvoices = [
    { id: 'INV-2025-001', customer: 'TechVerse Solutions', amount: 5400, dueDate: '2025-01-20', status: 'Pending', priority: 'High' },
    { id: 'INV-2025-002', customer: 'Alpha Corporation', amount: 3200, dueDate: '2025-01-18', status: 'Paid', priority: 'Medium' },
    { id: 'INV-2025-003', customer: 'Brady Ltd', amount: 7800, dueDate: '2025-01-22', status: 'Overdue', priority: 'High' },
    { id: 'INV-2025-004', customer: 'Momentum Retail', amount: 2100, dueDate: '2025-01-25', status: 'Pending', priority: 'Low' },
    { id: 'INV-2025-005', customer: 'Eta Corporation', amount: 4500, dueDate: '2025-01-15', status: 'Partially Paid', priority: 'Medium' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      "Pending": { color: "bg-amber-100 text-amber-800 border-amber-200" },
      "Paid": { color: "bg-green-100 text-green-800 border-green-200" },
      "Overdue": { color: "bg-red-100 text-red-800 border-red-200" },
      "Partially Paid": { color: "bg-blue-100 text-blue-800 border-blue-200" },
      "Good": { color: "bg-green-100 text-green-800 border-green-200" },
      "Excellent": { color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      "Watch": { color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    };
    return configs[status] || { color: "bg-gray-100 text-gray-800 border-gray-200" };
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Accounts Receivable</h1>
          <p className="text-gray-600">Monitor and manage customer payments and outstanding invoices</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="bg-white">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Link href="/finance/accounts-receivable/customers">
            <Button variant="outline" className="bg-white">
              <Users className="mr-2 h-4 w-4" />
              Manage Customers
            </Button>
          </Link>
          <Link href="/finance/accounts-receivable/invoices/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-blue-700 font-medium text-sm">Total Outstanding</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-900">
                    {formatCurrency(summaryData.totalOutstanding)}
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +5.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100/50 border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-red-700 font-medium text-sm">Overdue Amount</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-900">
                    {formatCurrency(summaryData.overdue)}
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-red-200 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <TrendingDown className="mr-1 h-4 w-4" />
              -12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-green-700 font-medium text-sm">Collected This Month</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-900">
                    {formatCurrency(summaryData.collected)}
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +18% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-purple-700 font-medium text-sm">Collection Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-900">
                    {summaryData.collectionRate}%
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Monthly Trends
            </CardTitle>
            <CardDescription>Invoice vs Collection trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="invoiced" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="collected" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Aging Analysis */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Accounts Receivable Aging
            </CardTitle>
            <CardDescription>Distribution of outstanding amounts by age</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agingData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ category, percentage }) => `${percentage}%`}
                >
                  {agingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {agingData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.category}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Top Customers by Outstanding
                </CardTitle>
                <CardDescription>Customers with highest outstanding amounts</CardDescription>
              </div>
              <Link href="/finance/accounts-receivable/customers">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">
                      {customer.invoices} invoices • Last payment: {new Date(customer.lastPayment).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold text-gray-900">{formatCurrency(customer.outstanding)}</div>
                    <Badge className={`${getStatusConfig(customer.status).color} border text-xs`}>
                      {customer.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Recent Invoices
                </CardTitle>
                <CardDescription>Latest invoice activity</CardDescription>
              </div>
              <Link href="/finance/accounts-receivable/invoices">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{invoice.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {invoice.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.customer} • Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</div>
                    <Badge className={`${getStatusConfig(invoice.status).color} border text-xs`}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/finance/accounts-receivable/invoices/create">
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-blue-50 border-blue-200">
                <Plus className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Create Invoice</span>
              </Button>
            </Link>
            <Link href="/finance/accounts-receivable/customers/create">
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-green-50 border-green-200">
                <Users className="h-6 w-6 text-green-600" />
                <span className="text-sm">Add Customer</span>
              </Button>
            </Link>
            <Link href="/finance/accounts-receivable/invoices/create-estimate">
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-purple-50 border-purple-200">
                <FileText className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Create Estimate</span>
              </Button>
            </Link>
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-orange-50 border-orange-200">
              <Download className="h-6 w-6 text-orange-600" />
              <span className="text-sm">Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsReceivableDashboard;