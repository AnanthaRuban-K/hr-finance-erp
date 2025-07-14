"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Eye, 
  Pencil, 
  Trash2, 
  RefreshCw, 
  Download, 
  Plus, 
  Search,
  Filter,
  MoreHorizontal,
  Building,
  Mail,
  Phone,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { PageHeader } from "@/components/layout/page-header";
import { RoleGuard } from "@/components/auth/role-guard";
import { UserRole } from "@/types/auth";

// Sample customer data with enhanced fields
const customerData = [
  { 
    id: 1, 
    name: "John Doe", 
    company: "Doe Enterprises", 
    email: "johndoe@doeenterprises.com", 
    phone: "927-130-7110", 
    openBalance: 1883.55,
    totalInvoices: 12,
    lastPayment: "2024-01-15",
    status: "active",
    creditLimit: 5000,
    avatar: null,
    address: "123 Business St, NY 10001",
    taxId: "TAX123456789",
    paymentTerms: "Net 30",
    customerSince: "2023-03-15"
  },
  { 
    id: 2, 
    name: "Alice Johnson", 
    company: "Johnson LLC", 
    email: "alicejohnson@johnsonllc.com", 
    phone: "321-591-8843", 
    openBalance: 2125.21,
    totalInvoices: 8,
    lastPayment: "2024-01-20",
    status: "active",
    creditLimit: 7500,
    avatar: null,
    address: "456 Corporate Ave, CA 90210",
    taxId: "TAX987654321",
    paymentTerms: "Net 15",
    customerSince: "2023-01-10"
  },
  { 
    id: 3, 
    name: "Bob Brown", 
    company: "Brown Industries", 
    email: "bobbrown@brownindustries.com", 
    phone: "168-374-3542", 
    openBalance: 4681.03,
    totalInvoices: 25,
    lastPayment: "2024-01-10",
    status: "active",
    creditLimit: 10000,
    avatar: null,
    address: "789 Industrial Blvd, TX 75201",
    taxId: "TAX456789123",
    paymentTerms: "Net 45",
    customerSince: "2022-11-20"
  },
  { 
    id: 4, 
    name: "Frank Harris", 
    company: "Harris Group", 
    email: "frankharris@harrisgroup.com", 
    phone: "613-124-2613", 
    openBalance: 1532.17,
    totalInvoices: 6,
    lastPayment: "2024-01-25",
    status: "inactive",
    creditLimit: 3000,
    avatar: null,
    address: "321 Group Plaza, FL 33101",
    taxId: "TAX321654987",
    paymentTerms: "Net 30",
    customerSince: "2023-06-05"
  },
  { 
    id: 5, 
    name: "Jane Smith", 
    company: "Smith Co.", 
    email: "janesmith@smithco.com", 
    phone: "381-904-1206", 
    openBalance: 3382.54,
    totalInvoices: 18,
    lastPayment: "2024-01-18",
    status: "active",
    creditLimit: 8000,
    avatar: null,
    address: "654 Commerce Dr, WA 98101",
    taxId: "TAX654321789",
    paymentTerms: "Net 30",
    customerSince: "2022-08-12"
  },
  { 
    id: 6, 
    name: "Grace Martin", 
    company: "Martin Ltd", 
    email: "gracemartin@martinltd.com", 
    phone: "816-442-3332", 
    openBalance: 1727.67,
    totalInvoices: 9,
    lastPayment: "2024-01-12",
    status: "active",
    creditLimit: 4500,
    avatar: null,
    address: "987 Limited Lane, IL 60601",
    taxId: "TAX789123456",
    paymentTerms: "Net 30",
    customerSince: "2023-04-20"
  },
  { 
    id: 7, 
    name: "David Wilson", 
    company: "Wilson Corp", 
    email: "davidwilson@wilsoncorp.com", 
    phone: "825-323-1945", 
    openBalance: 1043.92,
    totalInvoices: 4,
    lastPayment: "2024-01-08",
    status: "inactive",
    creditLimit: 2500,
    avatar: null,
    address: "147 Corporate Way, OH 44101",
    taxId: "TAX147258369",
    paymentTerms: "Net 15",
    customerSince: "2023-09-30"
  }
];

type SortField = 'name' | 'company' | 'openBalance' | 'totalInvoices' | 'lastPayment';
type SortOrder = 'asc' | 'desc';

export default function Customers() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const activeCustomers = customerData.filter(c => c.status === 'active');
    const inactiveCustomers = customerData.filter(c => c.status === 'inactive');
    const totalOpenBalance = customerData.reduce((sum, c) => sum + c.openBalance, 0);
    const totalInvoices = customerData.reduce((sum, c) => sum + c.totalInvoices, 0);
    
    return {
      activeCount: activeCustomers.length,
      inactiveCount: inactiveCustomers.length,
      totalOpenBalance,
      totalInvoices,
      avgBalance: totalOpenBalance / customerData.length
    };
  }, []);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customerData.filter(customer => {
      const matchesTab = activeTab === 'all' || customer.status === activeTab;
      const matchesSearch = searchTerm === '' || 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesTab && matchesSearch;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'lastPayment') {
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
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredAndSortedCustomers.slice(
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  return (
    <RoleGuard allowedRoles={[UserRole.FINANCE_MANAGER, UserRole.ADMIN]}>
      <div className="space-y-6">
        <PageHeader
          title="Customer Management"
          description="Manage your customer relationships, track balances, and monitor payment history"
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
            <Link href="/finance/accounts-receivable/customers/create">
              <Button size="sm" className="bg-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Customer
              </Button>
            </Link>
          </div>
        </PageHeader>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.activeCount}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalOpenBalance)}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Balance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summaryStats.avgBalance)}</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customers</CardTitle>
                <CardDescription>
                  A list of all customers including their contact information and account status.
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
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
                    <DropdownMenuItem>By Status</DropdownMenuItem>
                    <DropdownMenuItem>By Balance</DropdownMenuItem>
                    <DropdownMenuItem>By Date</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Clear Filters</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">
                  Active ({summaryStats.activeCount})
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive ({summaryStats.inactiveCount})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({customerData.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('company')}>
                          <div className="flex items-center">
                            Company
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('openBalance')}>
                          <div className="flex items-center">
                            Open Balance
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('totalInvoices')}>
                          <div className="flex items-center">
                            Invoices
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('lastPayment')}>
                          <div className="flex items-center">
                            Last Payment
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={customer.avatar || undefined} />
                                <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {customer.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                              {customer.company}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                                {customer.email}
                              </div>
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                                {customer.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {formatCurrency(customer.openBalance)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Credit: {formatCurrency(customer.creditLimit)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{customer.totalInvoices}</Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(customer.lastPayment)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={customer.status === 'active' ? 'default' : 'secondary'}
                            >
                              {customer.status}
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
                                <DropdownMenuItem asChild>
                                  <Link href={`/finance/accounts-receivable/customers/${customer.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/finance/accounts-receivable/customers/${customer.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Customer
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Statement
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Create Invoice
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Customer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
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