'use client';

import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Download,
  Copy
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const CreateInvoice = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [invoiceData, setInvoiceData] = useState({
    customer: '',
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: '30',
    notes: '',
    terms: 'Payment is due within 30 days of invoice date.',
    subtotal: 0,
    taxRate: 10,
    taxAmount: 0,
    discount: 0,
    discountType: 'percentage', // 'percentage' or 'fixed'
    total: 0
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
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
  React.useEffect(() => {
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
  React.useEffect(() => {
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
    
    // Here you would typically make an API call to save the invoice
    console.log('Invoice data:', { invoiceData, lineItems, action });
    
    setIsSubmitting(false);
    
    if (action === 'send') {
      // Redirect to invoice detail page
      router.push(`/finance/accounts-receivable/invoices/1`);
    } else {
      // Show success message and stay on page
      alert('Invoice saved as draft!');
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Invoice</h1>
            <p className="text-gray-600">Generate a new invoice for your customer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSubmit('save')}
            disabled={isSubmitting}
            className="bg-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button 
            onClick={() => handleSubmit('send')}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="mr-2 h-4 w-4" />
            Create & Send
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
              <CardDescription>Basic invoice information</CardDescription>
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
                  <div className="flex gap-2">
                    <Input
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
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
                  <CardDescription>Add products or services to this invoice</CardDescription>
                </div>
                <Button onClick={addLineItem} size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead className="w-[15%]">Quantity</TableHead>
                      <TableHead className="w-[20%]">Rate</TableHead>
                      <TableHead className="w-[20%]">Amount</TableHead>
                      <TableHead className="w-[5%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Textarea
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            placeholder="Enter description..."
                            className="min-h-[60px] resize-none"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-right">
                            {formatCurrency(item.amount)}
                          </div>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Notes and Terms */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Notes and terms for this invoice</CardDescription>
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
                  {isSubmitting ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button 
                  onClick={() => handleSubmit('send')}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Creating...' : 'Create & Send'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                Draft
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Customer
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Invoice
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;