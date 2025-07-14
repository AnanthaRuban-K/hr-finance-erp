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
  ChevronRight,
  Truck,
  Package,
  CreditCard
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

// Enhanced vendor data with additional fields
const vendorData = [
  { 
    id: 1, 
    name: "John Doe", 
    company: "Doe Enterprises", 
    email: "johndoe@doeenterprises.com", 
    phone: "927-130-7110", 
    openBalance: 1883.55,
    totalBills: 8,
    lastPayment: "2024-01-15",
    status: "active",
    creditLimit: 10000,
    avatar: null,
    address: "123 Supply St, NY 10001",
    taxId: "TAX123456789",
    paymentTerms: "Net 30",
    vendorSince: "2023-03-15",
    category: "Office Supplies"
  },
  { 
    id: 2, 
    name: "Alice Johnson", 
    company: "Johnson LLC", 
    email: "alicejohnson@johnsonllc.com", 
    phone: "321-591-8843", 
    openBalance: 2125.21,
    totalBills: 12,
    lastPayment: "2024-01-20",
    status: "active",
    creditLimit: 15000,
    avatar: null,
    address: "456 Manufacturing Ave, CA 90210",
    taxId: "TAX987654321",
    paymentTerms: "Net 15",
    vendorSince: "2023-01-10",
    category: "Manufacturing"
  },
  { 
    id: 3, 
    name: "Bob Brown", 
    company: "Brown Industries", 
    email: "bobbrown@brownindustries.com", 
    phone: "168-374-3542", 
    openBalance: 4681.03,
    totalBills: 25,
    lastPayment: "2024-01-10",
    status: "active",
    creditLimit: 20000,
    avatar: null,
    address: "789 Industrial Blvd, TX 75201",
    taxId: "TAX456789123",
    paymentTerms: "Net 45",
    vendorSince: "2022-11-20",
    category: "Raw Materials"
  },
  { 
    id: 4, 
    name: "Frank Harris", 
    company: "Harris Group", 
    email: "frankharris@harrisgroup.com", 
    phone: "613-124-2613", 
    openBalance: 1532.17,
    totalBills: 6,
    lastPayment: "2024-01-25",
    status: "inactive",
    creditLimit: 8000,
    avatar: null,
    address: "321 Service Plaza, FL 33101",
    taxId: "TAX321654987",
    paymentTerms: "Net 30",
    vendorSince: "2023-06-05",
    category: "Services"
  },
  { 
    id: 5, 
    name: "Jane Smith", 
    company: "Smith Co.", 
    email: "janesmith@smithco.com", 
    phone: "381-904-1206", 
    openBalance: 3382.54,
    totalBills: 18,
    lastPayment: "2024-01-18",
    status: "active",
    creditLimit: 12000,
    avatar: null,
    address: "654 Commerce Dr, WA 98101",
    taxId: "TAX654321789",
    paymentTerms: "Net 30",
    vendorSince: "2022-08-12",
    category: "Technology"
  },
  { 
    id: 6, 
    name: "Grace Martin", 
    company: "Martin Ltd", 
    email: "gracemartin@martinltd.com", 
    phone: "816-442-3332", 
    openBalance: 1727.67,
    totalBills: 9,
    lastPayment: "2024-01-12",
    status: "active",
    creditLimit: 9000,
    avatar: null,
    address: "987 Limited Lane, IL 60601",
    taxId: "TAX789123456",
    paymentTerms: "Net 30",
    vendorSince: "2023-04-20",
    category: "Logistics"
  },
  { 
    id: 7, 
    name: "David Wilson", 
    company: "Wilson Corp", 
    email: "davidwilson@wilsoncorp.com", 
    phone: "825-323-1945", 
    openBalance: 1043.92,
    totalBills: 4,
    lastPayment: "2024-01-08",
    status: "inactive",
    creditLimit: 5000,
    avatar: null,
    address: "147 Corporate Way, OH 44101",
    taxId: "TAX147258369",
    paymentTerms: "Net 15",
    vendorSince: "2023-09-30",
    category: "Consulting"
  }
];

type SortField = 'name' | 'company' | 'openBalance' | 'totalBills' | 'lastPayment';
type SortOrder = 'asc' | 'desc';

export default function Vendors() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const activeVendors = vendorData.filter(v => v.status === 'active');
    const inactiveVendors = vendorData.filter(v => v.status === 'inactive');
    const totalOpenBalance = vendorData.reduce((sum, v) => sum + v.openBalance, 0);
    const totalBills = vendorData.reduce((sum, v) => sum + v.totalBills, 0);
    
    return {
      activeCount: activeVendors.length,
      inactiveCount: inactiveVendors.length,
      totalOpenBalance,
      totalBills,
      avgBalance: totalOpenBalance / vendorData.length
    };
  }, []);

  // Filter and sort vendors
  const filteredAndSortedVendors = useMemo(() => {
    let filtered = vendorData.filter(vendor => {
      const matchesTab = activeTab === 'all' || vendor.status === activeTab;
      const matchesSearch = searchTerm === '' || 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
      
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
  const totalPages = Math.ceil(filteredAndSortedVendors.length / itemsPerPage);
  const paginatedVendors = filteredAndSortedVendors.slice(
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

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      'Office Supplies': Package,
      'Manufacturing': Building,
      'Raw Materials': Truck,
      'Services': Users,
      'Technology': Package,
      'Logistics': Truck,
      'Consulting': Users
    };
    return iconMap[category] || Package;
  };

  return (
    <RoleGuard allowedRoles={[UserRole.FINANCE_MANAGER, UserRole.ADMIN]}>
      <div className="space-y-6">
        <PageHeader
          title="Vendor Management"
          description="Manage your vendor relationships, track payables, and monitor payment schedules"
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
              <Button size="sm" className="bg-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Vendor
              </Button>
            </Link>
          </div>
        </PageHeader>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.activeCount}</div>
              <p className="text-xs text-muted-foreground">
                +3 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payables</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalOpenBalance)}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalBills}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
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
                +7% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vendors</CardTitle>
                <CardDescription>
                  A list of all vendors including their contact information and account status.
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors..."
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
                    <DropdownMenuItem>By Category</DropdownMenuItem>
                    <DropdownMenuItem>By Status</DropdownMenuItem>
                    <DropdownMenuItem>By Balance</DropdownMenuItem>
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
                  All ({vendorData.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('company')}>
                          <div className="flex items-center">
                            Company
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('openBalance')}>
                          <div className="flex items-center">
                            Open Balance
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('totalBills')}>
                          <div className="flex items-center">
                            Bills
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
                      {paginatedVendors.map((vendor) => {
                        const CategoryIcon = getCategoryIcon(vendor.category);
                        return (
                          <TableRow key={vendor.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={vendor.avatar || undefined} />
                                  <AvatarFallback>{getInitials(vendor.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{vendor.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    ID: {vendor.id}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                                {vendor.company}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center text-sm">
                                  <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                                  {vendor.email}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                                  {vendor.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <CategoryIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Badge variant="outline">{vendor.category}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {formatCurrency(vendor.openBalance)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Credit: {formatCurrency(vendor.creditLimit)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{vendor.totalBills}</Badge>
                            </TableCell>
                            <TableCell>
                              {formatDate(vendor.lastPayment)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={vendor.status === 'active' ? 'default' : 'secondary'}
                              >
                                {vendor.status}
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
                                    <Link href={`/finance/accounts-payable/vendors/${vendor.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/finance/accounts-payable/vendors/${vendor.id}/edit`}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit Vendor
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Create Bill
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Record Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Vendor
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