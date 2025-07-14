// This is the enhanced invoices page we created earlier
// apps/frontend/src/app/(dashboard)/finance/accounts-receivable/invoices/page.tsx

'use client';

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { 
  Search, 
  Filter, 
  RefreshCw, 
  Plus, 
  Eye, 
  Pencil, 
  Trash, 
  Download,
  Upload,
  Send,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  FileText,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  CreditCard,
  Printer,
  Share2,
  Archive,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  SlidersHorizontal
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const InvoicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Enhanced sample transaction data with more realistic information
  const transactions = [
    { 
      id: 1, 
      transactionDate: "2025-03-01", 
      dueDate: "2025-04-06", 
      no: "INV-001", 
      customer: "Brady Ltd", 
      customerEmail: "contact@brady.com",
      category: "Invoice", 
      status: "Pending", 
      balance: 2290.68, 
      amount: 2935.94,
      priority: "High",
      paymentMethod: "Bank Transfer",
      description: "Software licensing and support services"
    },
    { 
      id: 2, 
      transactionDate: "2025-03-14", 
      dueDate: "2025-04-09", 
      no: "INV-002", 
      customer: "Alpha Corp", 
      customerEmail: "billing@alphacorp.com",
      category: "Invoice", 
      status: "Draft", 
      balance: 744.08, 
      amount: 2340.70,
      priority: "Medium",
      paymentMethod: "Credit Card",
      description: "Consulting services for Q1"
    },
    { 
      id: 3, 
      transactionDate: "2025-03-23", 
      dueDate: "2025-04-03", 
      no: "PAY-003", 
      customer: "Eta Corp", 
      customerEmail: "payments@etacorp.com",
      category: "Payment", 
      status: "Rejected", 
      balance: 2934.13, 
      amount: 2932.45,
      priority: "High",
      paymentMethod: "Bank Transfer",
      description: "Payment for service agreement"
    },
    { 
      id: 4, 
      transactionDate: "2025-03-15", 
      dueDate: "2025-04-20", 
      no: "CON-004", 
      customer: "Eta Corp", 
      customerEmail: "contracts@etacorp.com",
      category: "Contract Invoice", 
      status: "Partially Received", 
      balance: 1402.45, 
      amount: 364.99,
      priority: "Medium",
      paymentMethod: "ACH",
      description: "Monthly retainer payment"
    },
    { 
      id: 5, 
      transactionDate: "2025-03-07", 
      dueDate: "2025-04-17", 
      no: "RET-005", 
      customer: "Alpha Corp", 
      customerEmail: "finance@alphacorp.com",
      category: "Retainage Bill", 
      status: "Partially Received", 
      balance: 1188.19, 
      amount: 63.81,
      priority: "Low",
      paymentMethod: "Check",
      description: "Project completion milestone"
    },
    { 
      id: 6, 
      transactionDate: "2025-03-03", 
      dueDate: "2025-04-06", 
      no: "RET-006", 
      customer: "Momentum Retail", 
      customerEmail: "ap@momentum.com",
      category: "Retainage Bill", 
      status: "Closed", 
      balance: 2828.97, 
      amount: 1801.63,
      priority: "Medium",
      paymentMethod: "Wire Transfer",
      description: "Retail system implementation"
    },
    { 
      id: 7, 
      transactionDate: "2025-03-23", 
      dueDate: "2025-04-22", 
      no: "RET-007", 
      customer: "Techverse Solutions", 
      customerEmail: "billing@techverse.com",
      category: "Retainage Bill", 
      status: "Open", 
      balance: 2755.00, 
      amount: 1582.17,
      priority: "High",
      paymentMethod: "Bank Transfer",
      description: "Technical support contract"
    },
    { 
      id: 8, 
      transactionDate: "2025-03-10", 
      dueDate: "2025-04-10", 
      no: "INV-008", 
      customer: "Zeta Inc", 
      customerEmail: "accounts@zeta.com",
      category: "Invoice", 
      status: "Paid", 
      balance: 2735.18, 
      amount: 2171.65,
      priority: "Medium",
      paymentMethod: "Credit Card",
      description: "Product delivery and installation"
    },
    { 
      id: 9, 
      transactionDate: "2025-03-01", 
      dueDate: "2025-04-20", 
      no: "RET-009", 
      customer: "Eta Corp", 
      customerEmail: "procurement@etacorp.com",
      category: "Retainage Bill", 
      status: "Available", 
      balance: 1842.90, 
      amount: 396.63,
      priority: "Low",
      paymentMethod: "ACH",
      description: "Equipment lease payment"
    },
    { 
      id: 10, 
      transactionDate: "2025-03-10", 
      dueDate: "2025-04-12", 
      no: "RET-010", 
      customer: "Zeta Inc", 
      customerEmail: "finance@zeta.com",
      category: "Retainage Bill", 
      status: "Partially Received", 
      balance: 1815.97, 
      amount: 2687.06,
      priority: "High",
      paymentMethod: "Bank Transfer",
      description: "Infrastructure services"
    }
  ];

  // Filtered and searched transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchTerm, statusFilter, categoryFilter, transactions]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const overdue = transactions.filter(t => 
      new Date(t.dueDate) < new Date() && 
      !['Paid', 'Closed'].includes(t.status)
    );
    const dueWithin7Days = transactions.filter(t => {
      const dueDate = new Date(t.dueDate);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return dueDate <= weekFromNow && dueDate >= new Date() && !['Paid', 'Closed'].includes(t.status);
    });
    const open = transactions.filter(t => ['Open', 'Pending', 'Available'].includes(t.status));

    return {
      overdue: {
        count: overdue.length,
        amount: overdue.reduce((sum, t) => sum + t.balance, 0)
      },
      dueWithin7Days: {
        count: dueWithin7Days.length,
        amount: dueWithin7Days.reduce((sum, t) => sum + t.balance, 0)
      },
      open: {
        count: open.length,
        amount: open.reduce((sum, t) => sum + t.balance, 0)
      }
    };
  }, [transactions]);

  // Status configuration
  const getStatusConfig = (status: string) => {
    const configs = {
      "Pending": { color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
      "Draft": { color: "bg-gray-100 text-gray-800 border-gray-200", icon: FileText },
      "Rejected": { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
      "Partially Received": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: AlertTriangle },
      "Closed": { color: "bg-slate-100 text-slate-800 border-slate-200", icon: Archive },
      "Open": { color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Eye },
      "Paid": { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      "Available": { color: "bg-cyan-100 text-cyan-800 border-cyan-200", icon: Star }
    };
    return configs[status] || { color: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertCircle };
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      "High": { color: "bg-red-50 border-l-red-500", dot: "bg-red-500" },
      "Medium": { color: "bg-yellow-50 border-l-yellow-500", dot: "bg-yellow-500" },
      "Low": { color: "bg-green-50 border-l-green-500", dot: "bg-green-500" }
    };
    return configs[priority] || { color: "bg-gray-50 border-l-gray-500", dot: "bg-gray-500" };
  };

  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSelectInvoice = (id: number) => {
    setSelectedInvoices(prev => 
      prev.includes(id) 
        ? prev.filter(invoiceId => invoiceId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === paginatedTransactions.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(paginatedTransactions.map(t => t.id));
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-gray-50/50">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Invoices</h1>
          <p className="text-gray-600">Manage customer invoices and track payments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                Quick Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                Send Reminders
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Bulk Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Print Invoices
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/finance/accounts-receivable/invoices/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100/50 border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-red-700 font-medium text-sm">Overdue Invoices</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-900">
                    {formatCurrency(summaryStats.overdue.amount)}
                  </span>
                  <span className="text-red-600 text-sm">({summaryStats.overdue.count})</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-red-200 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100/50 border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-amber-700 font-medium text-sm">Due within 7 days</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-amber-900">
                    {formatCurrency(summaryStats.dueWithin7Days.amount)}
                  </span>
                  <span className="text-amber-600 text-sm">({summaryStats.dueWithin7Days.count})</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-amber-200 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-amber-600">
              <TrendingDown className="mr-1 h-4 w-4" />
              -5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-blue-700 font-medium text-sm">Open Invoices</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-900">
                    {formatCurrency(summaryStats.open.amount)}
                  </span>
                  <span className="text-blue-600 text-sm">({summaryStats.open.count})</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +8% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invoices, customers, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Contract Invoice">Contract Invoice</SelectItem>
                  <SelectItem value="Retainage Bill">Retainage Bill</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                  className="bg-gray-50 border-gray-200"
                >
                  {viewMode === 'table' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </Button>
                
                <Button variant="outline" size="sm" className="bg-gray-50 border-gray-200">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" className="bg-gray-50 border-gray-200">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </div>

          {selectedInvoices.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedInvoices.length} invoice(s) selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                    <Send className="mr-2 h-3 w-3" />
                    Send Reminder
                  </Button>
                  <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                    <Mail className="mr-2 h-3 w-3" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                    <Download className="mr-2 h-3 w-3" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Data Table */}
      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Invoice
                      <Filter className="h-3 w-3 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Status
                      <Filter className="h-3 w-3 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Balance</TableHead>
                  <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Priority</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction) => {
                  const statusConfig = getStatusConfig(transaction.status);
                  const priorityConfig = getPriorityConfig(transaction.priority);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <TableRow 
                      key={transaction.id} 
                      className={`hover:bg-gray-50 transition-colors border-l-2 ${priorityConfig.color}`}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(transaction.id)}
                          onChange={() => handleSelectInvoice(transaction.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Link 
                            href={`/finance/accounts-receivable/invoices/${transaction.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            {transaction.no}
                          </Link>
                          <div className="text-xs text-gray-500">{formatDate(transaction.transactionDate)}</div>
                          <div className="text-xs text-gray-500 max-w-32 truncate" title={transaction.description}>
                            {transaction.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{transaction.customer}</div>
                          <div className="text-xs text-gray-500">{transaction.customerEmail}</div>
                          <div className="text-xs text-blue-600">{transaction.paymentMethod}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig.color} border font-medium`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {formatCurrency(transaction.balance)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDate(transaction.dueDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
                          <span className="text-sm font-medium">{transaction.priority}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/finance/accounts-receivable/invoices/${transaction.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/finance/accounts-receivable/invoices/${transaction.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Invoice
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
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

          {/* Enhanced Pagination */}
          <div className="flex items-center justify-between p-4 border-t bg-gray-50/50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Showing</span>
              <span className="font-medium">
                {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
              </span>
              <span>of</span>
              <span className="font-medium">{filteredTransactions.length}</span>
              <span>invoices</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white border-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-blue-600 text-white" : "bg-white border-gray-200"}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))
                }
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-white border-gray-200"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Analytics Card */}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Quick Analytics
          </CardTitle>
          <CardDescription>
            Key insights from your invoice data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Avg. Collection Time</p>
                  <p className="text-2xl font-bold text-blue-900">28 days</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Collection Rate</p>
                  <p className="text-2xl font-bold text-green-900">94.2%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Total Customers</p>
                  <p className="text-2xl font-bold text-purple-900">47</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">Avg. Invoice Value</p>
                  <p className="text-2xl font-bold text-orange-900">$1,847</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesPage;