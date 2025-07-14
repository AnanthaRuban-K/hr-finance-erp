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
  MoreHorizontal
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

// Sample customer data - in real app, this would come from API
const customerData = {
  id: 1,
  name: "John Doe",
  company: "Doe Enterprises",
  email: "johndoe@doeenterprises.com",
  phone: "927-130-7110",
  address: "123 Business St, NY 10001",
  taxId: "TAX123456789",
  paymentTerms: "Net 30",
  creditLimit: 5000,
  openBalance: 1883.55,
  totalInvoices: 12,
  lastPayment: "2024-01-15",
  status: "active",
  customerSince: "2023-03-15",
  avatar: null,
  notes: "Preferred customer with excellent payment history. Usually pays early."
};

// Sample transaction history
const transactionHistory = [
  {
    id: 1,
    date: "2024-01-15",
    type: "payment",
    reference: "PAY-001",
    description: "Payment for Invoice INV-2024-001",
    amount: -2500.00,
    balance: 1883.55
  },
  {
    id: 2,
    date: "2024-01-10",
    type: "invoice",
    reference: "INV-2024-002",
    description: "Monthly Service Fee",
    amount: 1250.00,
    balance: 4383.55
  },
  {
    id: 3,
    date: "2024-01-05",
    type: "invoice",
    reference: "INV-2024-001",
    description: "Consulting Services",
    amount: 2500.00,
    balance: 3133.55
  },
  {
    id: 4,
    date: "2023-12-28",
    type: "payment",
    reference: "PAY-002",
    description: "Payment for Invoice INV-2023-012",
    amount: -1800.00,
    balance: 633.55
  }
];

// Sample invoices
const invoices = [
  {
    id: 1,
    number: "INV-2024-002",
    date: "2024-01-10",
    dueDate: "2024-02-10",
    amount: 1250.00,
    status: "unpaid",
    description: "Monthly Service Fee"
  },
  {
    id: 2,
    number: "INV-2024-001",
    date: "2024-01-05",
    dueDate: "2024-02-05",
    amount: 2500.00,
    status: "paid",
    description: "Consulting Services"
  },
  {
    id: 3,
    number: "INV-2023-012",
    date: "2023-12-15",
    dueDate: "2024-01-15",
    amount: 1800.00,
    status: "paid",
    description: "Product Development"
  }
];

export default function CustomerDetail() {
  const params = useParams();
  const customerId = params.id;
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

  const creditUtilization = (customerData.openBalance / customerData.creditLimit) * 100;

  return (
    <RoleGuard allowedRoles={[UserRole.FINANCE_MANAGER, UserRole.ADMIN]}>
      <div className="space-y-6">
        <PageHeader
          title={customerData.company}
          description={`Customer since ${formatDate(customerData.customerSince)} • ${customerData.status.charAt(0).toUpperCase() + customerData.status.slice(1)} Account`}
        >
          <div className="flex items-center gap-2">
            <Link href="/finance/accounts-receivable/customers">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Customers
              </Button>
            </Link>
            <Link href={`/finance/accounts-receivable/customers/${customerId}/edit`}>
              <Button variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Customer
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
                  Create Invoice
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Statement
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PageHeader>

        {/* Customer Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(customerData.openBalance)}</div>
              <p className="text-xs text-muted-foreground">
                Credit limit: {formatCurrency(customerData.creditLimit)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerData.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime invoices
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
              <div className="text-2xl font-bold">{formatDate(customerData.lastPayment)}</div>
              <p className="text-xs text-muted-foreground">
                Payment received
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Customer Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={customerData.avatar || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(customerData.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{customerData.name}</h3>
                  <p className="text-sm text-muted-foreground">{customerData.company}</p>
                  <Badge 
                    variant={customerData.status === 'active' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {customerData.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{customerData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{customerData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{customerData.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Tax ID</p>
                    <p className="text-sm text-muted-foreground">{customerData.taxId}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Payment Terms</p>
                    <p className="text-sm text-muted-foreground">{customerData.paymentTerms}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Customer Since</p>
                    <p className="text-sm text-muted-foreground">{formatDate(customerData.customerSince)}</p>
                  </div>
                </div>
              </div>

              {customerData.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {customerData.notes}
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
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
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
                            <span>{formatCurrency(customerData.creditLimit)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Available Credit:</span>
                            <span>{formatCurrency(customerData.creditLimit - customerData.openBalance)}</span>
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
                            <span className="text-green-600">95%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Average Days to Pay:</span>
                            <span>28 days</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Last Payment:</span>
                            <span>{formatDate(customerData.lastPayment)}</span>
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
                
                <TabsContent value="invoices" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Invoices</h3>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Invoice
                      </Button>
                    </div>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.map((invoice) => {
                            const statusConfig = getStatusBadge(invoice.status);
                            return (
                              <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.number}</TableCell>
                                <TableCell>{formatDate(invoice.date)}</TableCell>
                                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
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
                                      <DropdownMenuItem>View Invoice</DropdownMenuItem>
                                      <DropdownMenuItem>Download PDF</DropdownMenuItem>
                                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
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