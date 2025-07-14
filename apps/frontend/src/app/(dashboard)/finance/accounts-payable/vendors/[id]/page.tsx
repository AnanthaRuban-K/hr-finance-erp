"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Edit3, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
  Clock,
  Download,
  Plus,
  MoreHorizontal,
  Package,
  Truck,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/page-header";
import { RoleGuard } from "@/components/auth/role-guard";
import { UserRole } from "@/types/auth";

// Sample vendor data - in real app, this would come from API
const vendorData = {
  id: 1,
  name: "John Doe",
  company: "Doe Enterprises",
  email: "johndoe@doeenterprises.com",
  phone: "927-130-7110",
  address: "123 Supply St, NY 10001",
  taxId: "TAX123456789",
  paymentTerms: "Net 30",
  creditLimit: 10000,
  openBalance: 1883.55,
  totalBills: 8,
  lastPayment: "2024-01-15",
  status: "active",
  vendorSince: "2023-03-15",
  category: "Office Supplies",
  avatar: null,
  notes: "Reliable supplier with consistent quality. Usually offers early payment discounts."
};

// Sample transaction history
const transactionHistory = [
  {
    id: 1,
    date: "2024-01-15",
    type: "payment",
    reference: "PAY-001",
    description: "Payment for Bill BILL-2024-001",
    amount: -2500.00,
    balance: 1883.55
  },
  {
    id: 2,
    date: "2024-01-10",
    type: "bill",
    reference: "BILL-2024-002",
    description: "Office Supplies Order",
    amount: 1250.00,
    balance: 4383.55
  },
  {
    id: 3,
    date: "2024-01-05",
    type: "bill",
    reference: "BILL-2024-001",
    description: "Stationery and Equipment",
    amount: 2500.00,
    balance: 3133.55
  },
  {
    id: 4,
    date: "2023-12-28",
    type: "payment",
    reference: "PAY-002",
    description: "Payment for Bill BILL-2023-012",
    amount: -1800.00,
    balance: 633.55
  }
];

// Sample bills
const bills = [
  {
    id: 1,
    number: "BILL-2024-002",
    date: "2024-01-10",
    dueDate: "2024-02-10",
    amount: 1250.00,
    status: "unpaid",
    description: "Office Supplies Order"
  },
  {
    id: 2,
    number: "BILL-2024-001",
    date: "2024-01-05",
    dueDate: "2024-02-05",
    amount: 2500.00,
    status: "paid",
    description: "Stationery and Equipment"
  },
  {
    id: 3,
    number: "BILL-2023-012",
    date: "2023-12-15",
    dueDate: "2024-01-15",
    amount: 1800.00,
    status: "paid",
    description: "Year-end Supplies"
  }
];

export default function VendorDetail() {
  const params = useParams();
  const vendorId = params.id;
  const [activeTab, setActiveTab] = useState("overview");

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { variant: "default" as const, label: "Paid" },
      unpaid: { variant: "destructive" as const, label: "Unpaid" },
      overdue: { variant: "secondary" as const, label: "Overdue" },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid;
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

  const creditUtilization = (vendorData.openBalance / vendorData.creditLimit) * 100;
  const CategoryIcon = getCategoryIcon(vendorData.category);

  return (
    <RoleGuard allowedRoles={[UserRole.FINANCE_MANAGER, UserRole.ADMIN]}>
      <div className="space-y-6">
        <PageHeader
          title={vendorData.company}
          description={`Vendor since ${formatDate(vendorData.vendorSince)} • ${vendorData.status.charAt(0).toUpperCase() + vendorData.status.slice(1)} Account`}
        >
          <div className="flex items-center gap-2">
            <Link href="/finance/accounts-payable/vendors">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vendors
              </Button>
            </Link>
            <Link href={`/finance/accounts-payable/vendors/${vendorId}/edit`}>
              <Button variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Vendor
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Bill
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Record Payment
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PageHeader>

        {/* Vendor Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(vendorData.openBalance)}</div>
              <p className="text-xs text-muted-foreground">
                Credit limit: {formatCurrency(vendorData.creditLimit)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorData.totalBills}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime bills
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Utilization</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{creditUtilization.toFixed(1)}%</div>
              <Progress value={creditUtilization} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(vendorData.lastPayment)}</div>
              <p className="text-xs text-muted-foreground">
                Payment made
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Vendor Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={vendorData.avatar || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(vendorData.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{vendorData.name}</h3>
                  <p className="text-sm text-muted-foreground">{vendorData.company}</p>
                  <Badge 
                    variant={vendorData.status === 'active' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {vendorData.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{vendorData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{vendorData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{vendorData.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground">{vendorData.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Tax ID</p>
                    <p className="text-sm text-muted-foreground">{vendorData.taxId}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Payment Terms</p>
                    <p className="text-sm text-muted-foreground">{vendorData.paymentTerms}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Vendor Since</p>
                    <p className="text-sm text-muted-foreground">{formatDate(vendorData.vendorSince)}</p>
                  </div>
                </div>
              </div>

              {vendorData.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {vendorData.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bills">Bills</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="overview" className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Credit Information</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Credit Limit:</span>
                            <span>{formatCurrency(vendorData.creditLimit)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Available Credit:</span>
                            <span>{formatCurrency(vendorData.creditLimit - vendorData.openBalance)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Utilization:</span>
                            <span>{creditUtilization.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Payment History</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>On-time Payments:</span>
                            <span className="text-green-600">92%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Average Days to Pay:</span>
                            <span>25 days</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Last Payment:</span>
                            <span>{formatDate(vendorData.lastPayment)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-2">Recent Activity</h4>
                    <div className="space-y-2">
                      {transactionHistory.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div>
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(transaction.date)} • {transaction.reference}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              transaction.amount > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="bills" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Bills</h3>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Bill
                      </Button>
                    </div>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Bill #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bills.map((bill) => {
                            const statusConfig = getStatusBadge(bill.status);
                            return (
                              <TableRow key={bill.id}>
                                <TableCell className="font-medium">{bill.number}</TableCell>
                                <TableCell>{formatDate(bill.date)}</TableCell>
                                <TableCell>{formatDate(bill.dueDate)}</TableCell>
                                <TableCell>{formatCurrency(bill.amount)}</TableCell>
                                <TableCell>
                                  <Badge variant={statusConfig.variant}>
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
                                      <DropdownMenuItem>View Bill</DropdownMenuItem>
                                      <DropdownMenuItem>Download PDF</DropdownMenuItem>
                                      <DropdownMenuItem>Record Payment</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="transactions" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Transaction History</h3>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactionHistory.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{formatDate(transaction.date)}</TableCell>
                              <TableCell>
                                <Badge variant={transaction.type === 'payment' ? 'default' : 'secondary'}>
                                  {transaction.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{transaction.reference}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell className={`font-medium ${
                                transaction.amount > 0 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                              </TableCell>
                              <TableCell>{formatCurrency(transaction.balance)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}