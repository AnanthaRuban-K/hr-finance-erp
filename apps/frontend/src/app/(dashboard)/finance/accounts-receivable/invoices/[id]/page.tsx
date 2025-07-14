'use client';

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  ArrowLeft,
  Edit,
  Send,
  Download,
  Printer, // Changed from Print to Printer
  Share2,
  Copy,
  MoreHorizontal,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  FileText,
  Eye,
  MessageSquare,
  Activity,
  Plus
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
  status: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  date: string;
  user: string;
}

const InvoiceDetail = () => {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id;
  
  // Sample invoice data
  const invoiceData = {
    id: '1',
    number: 'INV-001',
    status: 'Pending',
    priority: 'High',
    issueDate: '2025-03-01',
    dueDate: '2025-04-06',
    paymentTerms: 'Net 30 days',
    customer: {
      id: '1',
      name: 'Brady Ltd',
      email: 'contact@brady.com',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Business Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      }
    },
    company: {
      name: 'Your Company Inc.',
      email: 'billing@yourcompany.com',
      phone: '+1 (555) 987-6543',
      address: {
        street: '456 Corporate Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90210',
        country: 'USA'
      }
    },
    lineItems: [
      {
        id: '1',
        description: 'Software licensing and support services for Q1 2025',
        quantity: 1,
        rate: 2500.00,
        amount: 2500.00
      },
      {
        id: '2',
        description: 'Implementation and training services',
        quantity: 8,
        rate: 150.00,
        amount: 1200.00
      }
    ] as InvoiceLineItem[],
    subtotal: 3700.00,
    discountRate: 5,
    discountAmount: 185.00,
    taxRate: 10,
    taxAmount: 351.50,
    total: 3866.50,
    paidAmount: 1500.00,
    balancedue: 2366.50,
    notes: 'Thank you for your business. Please process payment within the specified terms.',
    terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional fees.'
  };

  const payments: Payment[] = [
    {
      id: '1',
      date: '2025-03-15',
      amount: 1500.00,
      method: 'Bank Transfer',
      reference: 'TXN-789123',
      status: 'Completed'
    }
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'payment',
      description: 'Partial payment received via Bank Transfer',
      date: '2025-03-15T10:30:00Z',
      user: 'System'
    },
    {
      id: '2',
      type: 'email',
      description: 'Invoice sent to customer via email',
      date: '2025-03-01T09:15:00Z',
      user: 'John Doe'
    },
    {
      id: '3',
      type: 'created',
      description: 'Invoice created and saved as draft',
      date: '2025-03-01T08:45:00Z',
      user: 'John Doe'
    }
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      "Pending": { color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
      "Paid": { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      "Overdue": { color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle },
      "Partially Paid": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: DollarSign }
    };
    return configs[status] || { color: "bg-gray-100 text-gray-800 border-gray-200", icon: FileText };
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      "High": { color: "bg-red-100 text-red-800 border-red-200" },
      "Medium": { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      "Low": { color: "bg-green-100 text-green-800 border-green-200" }
    };
    return configs[priority] || { color: "bg-gray-100 text-gray-800 border-gray-200" };
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
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'email': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'created': return <FileText className="h-4 w-4 text-gray-600" />;
      case 'updated': return <Edit className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const statusConfig = getStatusConfig(invoiceData.status);
  const priorityConfig = getPriorityConfig(invoiceData.priority);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex-1 space-y-6 p-6 bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/finance/accounts-receivable/invoices">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Invoice {invoiceData.number}
              </h1>
              <Badge className={`${statusConfig.color} border font-medium`}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {invoiceData.status}
              </Badge>
              <Badge className={`${priorityConfig.color} border text-xs`}>
                {invoiceData.priority} Priority
              </Badge>
            </div>
            <p className="text-gray-600">
              Issued on {formatDate(invoiceData.issueDate)} • Due {formatDate(invoiceData.dueDate)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="bg-white">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="bg-white">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" className="bg-white">
            <Send className="mr-2 h-4 w-4" />
            Send Email
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Invoice
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Mark as Overdue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={`/finance/accounts-receivable/invoices/${invoiceId}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="mr-2 h-4 w-4" />
              Edit Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Header */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* From */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">From</h3>
                  <div className="space-y-2 text-sm">
                    <div className="font-medium text-gray-900">{invoiceData.company.name}</div>
                    <div className="text-gray-600">{invoiceData.company.address.street}</div>
                    <div className="text-gray-600">
                      {invoiceData.company.address.city}, {invoiceData.company.address.state} {invoiceData.company.address.zip}
                    </div>
                    <div className="text-gray-600">{invoiceData.company.address.country}</div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {invoiceData.company.email}
                    </div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {invoiceData.company.phone}
                    </div>
                  </div>
                </div>

                {/* To */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To</h3>
                  <div className="space-y-2 text-sm">
                    <div className="font-medium text-gray-900">{invoiceData.customer.name}</div>
                    <div className="text-gray-600">{invoiceData.customer.address.street}</div>
                    <div className="text-gray-600">
                      {invoiceData.customer.address.city}, {invoiceData.customer.address.state} {invoiceData.customer.address.zip}
                    </div>
                    <div className="text-gray-600">{invoiceData.customer.address.country}</div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {invoiceData.customer.email}
                    </div>
                    <div className="text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {invoiceData.customer.phone}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">Invoice Number</div>
                  <div className="font-medium">{invoiceData.number}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Issue Date</div>
                  <div className="font-medium">{formatDate(invoiceData.issueDate)}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Due Date</div>
                  <div className="font-medium">{formatDate(invoiceData.dueDate)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Items & Services</CardTitle>
              <CardDescription>Detailed breakdown of services provided</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium text-gray-700 w-[50%]">Description</th>
                    <th className="text-center p-2 font-medium text-gray-700 w-[15%]">Qty</th>
                    <th className="text-right p-2 font-medium text-gray-700 w-[20%]">Rate</th>
                    <th className="text-right p-2 font-medium text-gray-700 w-[15%]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.lineItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">
                        <div className="font-medium">{item.description}</div>
                      </td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">{formatCurrency(item.rate)}</td>
                      <td className="p-2 text-right font-medium">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-end">
                <div className="w-80 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(invoiceData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({invoiceData.discountRate}%):</span>
                    <span>-{formatCurrency(invoiceData.discountAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({invoiceData.taxRate}%):</span>
                    <span>{formatCurrency(invoiceData.taxAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(invoiceData.total)}</span>
                  </div>
                  <div className="flex justify-between text-blue-600 font-medium">
                    <span>Paid:</span>
                    <span>{formatCurrency(invoiceData.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-red-600">
                    <span>Balance Due:</span>
                    <span>{formatCurrency(invoiceData.balancedue)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Additional Information */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <Tabs defaultValue="notes" className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="notes">Notes & Terms</TabsTrigger>
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                    <TabsTrigger value="activity">Activity Log</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="notes" className="p-6 pt-4">
                  <div className="space-y-4">
                    {invoiceData.notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {invoiceData.notes}
                        </p>
                      </div>
                    )}
                    
                    {invoiceData.terms && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Terms & Conditions</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {invoiceData.terms}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="payments" className="p-6 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Payment History</h4>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Record Payment
                      </Button>
                    </div>
                    
                    {payments.length > 0 ? (
                      <div className="space-y-3">
                        {payments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-gray-900">
                                  {formatCurrency(payment.amount)}
                                </span>
                                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                                  {payment.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                {payment.method} • {payment.reference} • {formatDate(payment.date)}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No payments recorded yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="p-6 pt-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Activity Timeline</h4>
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(activity.date)} • by {activity.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Summary */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="font-semibold">{formatCurrency(invoiceData.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="font-semibold text-green-600">{formatCurrency(invoiceData.paidAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Balance Due</span>
                  <span className="font-semibold text-red-600">{formatCurrency(invoiceData.balancedue)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(invoiceData.paidAmount / invoiceData.total) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((invoiceData.paidAmount / invoiceData.total) * 100)}% paid
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium text-gray-900">{invoiceData.customer.name}</div>
                <div className="text-sm text-gray-600">{invoiceData.customer.email}</div>
                <div className="text-sm text-gray-600">{invoiceData.customer.phone}</div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Billing Address</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  <div>{invoiceData.customer.address.street}</div>
                  <div>
                    {invoiceData.customer.address.city}, {invoiceData.customer.address.state} {invoiceData.customer.address.zip}
                  </div>
                  <div>{invoiceData.customer.address.country}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Send className="mr-2 h-4 w-4" />
                Send Reminder
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Customer
              </Button>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Terms</span>
                <span className="text-sm font-medium">{invoiceData.paymentTerms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Due Date</span>
                <span className="text-sm font-medium">{formatDate(invoiceData.dueDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Days Until Due</span>
                <span className="text-sm font-medium">
                  {Math.ceil((new Date(invoiceData.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;