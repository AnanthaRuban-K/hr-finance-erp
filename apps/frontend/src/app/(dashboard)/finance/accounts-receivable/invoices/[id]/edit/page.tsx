'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  Calculator,
  User,
  Calendar,
  FileText,
  DollarSign,
  Percent,
  ArrowLeft,
  Eye,
  AlertTriangle,
  Clock
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function EditInvoice() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state - pre-populated with existing data
  const [invoiceData, setInvoiceData] = useState({
    customer: '1', // Brady Ltd
    invoiceNumber: 'INV-001',
    invoiceDate: '2025-03-01',
    dueDate: '2025-04-06',
    paymentTerms: '30',
    status: 'Pending',
    notes: 'Thank you for your business. Please process payment within the specified terms.',
    terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional fees.',
    subtotal: 0,
    taxRate: 10,
    taxAmount: 0,
    discount: 5,
    discountType: 'percentage' as 'percentage' | 'fixed',
    total: 0
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
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
  ]);

  // Sample customers data
  const customers = [
    { id: '1', name: 'Brady Ltd', email: 'contact@brady.com' },
    { id: '2', name: 'Alpha Corp', email: 'billing@alphacorp.com' },
    { id: '3', name: 'Eta Corp', email: 'payments@etacorp.com' },
    { id: '4', name: 'TechVerse Solutions', email: 'billing@techverse.com' },
    { id: '5', name: 'Momentum Retail', email: 'ap@momentum.com' }
  ];

  // Calculate due date based on payment terms
  const calculateDueDate = (invoiceDate: string, paymentTerms: string) => {
    const date = new Date(invoiceDate);
    date.setDate(date.getDate() + parseInt(paymentTerms));
    return date.toISOString().split('T')[0];
  };

  // Update line item
  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  // Add new line item
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setLineItems(prev => [...prev, newItem]);
  };

  // Remove line item
  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Calculate totals
  useEffect(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = invoiceData.discountType === 'percentage' 
      ? (subtotal * invoiceData.discount / 100) 
      : invoiceData.discount;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * invoiceData.taxRate / 100;
    const total = taxableAmount + taxAmount;

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  }, [lineItems, invoiceData.taxRate, invoiceData.discount, invoiceData.discountType]);

  // Update due date when invoice date or payment terms change
  useEffect(() => {
    if (invoiceData.invoiceDate && invoiceData.paymentTerms) {
      const dueDate = calculateDueDate(invoiceData.invoiceDate, invoiceData.paymentTerms);
      setInvoiceData(prev => ({ ...prev, dueDate }));
    }
  }, [invoiceData.invoiceDate, invoiceData.paymentTerms]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSubmit = async (action: 'save' | 'send') => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would typically make an API call to update the invoice
    console.log('Updated invoice data:', { invoiceData, lineItems, action });
    
    setIsSubmitting(false);
    
    if (action === 'send') {
      // Redirect to invoice detail page
      router.push(`/finance/accounts-receivable/invoices/${invoiceId}`);
    } else {
      // Show success message and stay on page
      alert('Invoice updated successfully!');
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: React.ComponentType<any> }> = {
      "Pending": { color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
      "Draft": { color: "bg-gray-100 text-gray-800 border-gray-200", icon: FileText },
      "Overdue": { color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle }
    };
    return configs[status] || { color: "bg-gray-100 text-gray-800 border-gray-200", icon: FileText };
  };

  const statusConfig = getStatusConfig(invoiceData.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex-1 space-y-6 p-6 bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/finance/accounts-receivable/invoices/${invoiceId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoice
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Edit Invoice {invoiceData.invoiceNumber}
              </h1>
              <Badge className={`${statusConfig.color} border font-medium`}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {invoiceData.status}
              </Badge>
            </div>
            <p className="text-gray-600">Modify invoice details and line items</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/finance/accounts-receivable/invoices/${invoiceId}`}>
            <Button variant="outline" className="bg-white">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => handleSubmit('save')}
            disabled={isSubmitting}
            className="bg-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button 
            onClick={() => handleSubmit('send')}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Updating...' : 'Update & Send'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Invoice Details
              </CardTitle>
              <CardDescription>Update basic invoice information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer *</Label>
                  <Select 
                    value={invoiceData.customer} 
                    onValueChange={(value) => setInvoiceData(prev => ({ ...prev, customer: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex flex-col">
                            <span>{customer.name}</span>
                            <span className="text-xs text-gray-500">{customer.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="bg-gray-50"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date *</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceData.invoiceDate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select 
                    value={invoiceData.paymentTerms} 
                    onValueChange={(value) => setInvoiceData(prev => ({ ...prev, paymentTerms: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">Net 15 days</SelectItem>
                      <SelectItem value="30">Net 30 days</SelectItem>
                      <SelectItem value="45">Net 45 days</SelectItem>
                      <SelectItem value="60">Net 60 days</SelectItem>
                      <SelectItem value="0">Due on receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={invoiceData.status} 
                    onValueChange={(value) => setInvoiceData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Sent">Sent</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Line Items
                  </CardTitle>
                  <CardDescription>Modify products or services in this invoice</CardDescription>
                </div>
                <Button onClick={addLineItem} size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium text-gray-700 w-[40%]">Description</th>
                      <th className="text-left p-2 font-medium text-gray-700 w-[15%]">Quantity</th>
                      <th className="text-left p-2 font-medium text-gray-700 w-[20%]">Rate</th>
                      <th className="text-left p-2 font-medium text-gray-700 w-[20%]">Amount</th>
                      <th className="text-left p-2 font-medium text-gray-700 w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, index) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">
                          <Textarea
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            placeholder="Enter description..."
                            className="min-h-[60px] resize-none"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="p-2">
                          <div className="font-medium text-right">
                            {formatCurrency(item.amount)}
                          </div>
                        </td>
                        <td className="p-2">
                          {lineItems.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLineItem(item.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Notes and Terms */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Update notes and terms for this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes for your customer..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms and Conditions</Label>
                <Textarea
                  id="terms"
                  value={invoiceData.terms}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, terms: e.target.value }))}
                  placeholder="Enter terms and conditions..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Summary Sidebar */}
        <div className="space-y-6">
          {/* Totals Card */}
          <Card className="border-0 shadow-lg sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Discount */}
              <div className="space-y-3">
                <Label>Discount</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={invoiceData.discount}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                  />
                  <Select 
                    value={invoiceData.discountType} 
                    onValueChange={(value: 'percentage' | 'fixed') => setInvoiceData(prev => ({ ...prev, discountType: value }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="fixed">$</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tax Rate */}
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={invoiceData.taxRate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoiceData.subtotal)}</span>
                </div>
                
                {invoiceData.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>
                      -{formatCurrency(invoiceData.discountType === 'percentage' 
                        ? (invoiceData.subtotal * invoiceData.discount / 100) 
                        : invoiceData.discount
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>Tax ({invoiceData.taxRate}%):</span>
                  <span>{formatCurrency(invoiceData.taxAmount)}</span>
                </div>

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatCurrency(invoiceData.total)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button 
                  onClick={() => handleSubmit('save')}
                  disabled={isSubmitting}
                  variant="outline" 
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  onClick={() => handleSubmit('send')}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Updating...' : 'Update & Send'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Log */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Recent Changes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Modified:</span>
                  <span className="font-medium">Mar 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Modified By:</span>
                  <span className="font-medium">John Doe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">2.1</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Last change: Updated payment terms from Net 15 to Net 30 days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Warning Card */}
          <Card className="border-0 shadow-lg border-l-4 border-l-amber-500 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800">
                    Invoice Modification
                  </p>
                  <p className="text-xs text-amber-700">
                    Changes to sent invoices will create a new version. Previous version history will be maintained.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}