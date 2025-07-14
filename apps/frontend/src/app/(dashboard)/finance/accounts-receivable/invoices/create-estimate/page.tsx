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
  ArrowLeft,
  Eye,
  Download,
  Copy,
  CheckCircle,
  Clock,
  RefreshCw
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

const CreateEstimate = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [estimateData, setEstimateData] = useState({
    customer: '',
    estimateNumber: `EST-${Date.now().toString().slice(-6)}`,
    estimateDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    validityDays: '30',
    notes: 'This estimate is valid for 30 days from the date of issue.',
    terms: 'Prices are subject to change. Final invoice may vary based on actual services provided.',
    subtotal: 0,
    taxRate: 10,
    taxAmount: 0,
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
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

  // Sample service templates
  const serviceTemplates = [
    { id: '1', name: 'Software Development - Basic', rate: 75, description: 'Basic software development services' },
    { id: '2', name: 'Software Development - Senior', rate: 125, description: 'Senior developer services' },
    { id: '3', name: 'Project Management', rate: 95, description: 'Project management and coordination' },
    { id: '4', name: 'System Integration', rate: 150, description: 'System integration and setup' },
    { id: '5', name: 'Training Services', rate: 85, description: 'User training and documentation' },
    { id: '6', name: 'Support & Maintenance', rate: 65, description: 'Ongoing support and maintenance' }
  ];

  // Calculate expiry date based on validity days
  const calculateExpiryDate = (estimateDate: string, validityDays: string) => {
    const date = new Date(estimateDate);
    date.setDate(date.getDate() + parseInt(validityDays));
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

  // Add service template
  const addServiceTemplate = (templateId: string) => {
    const template = serviceTemplates.find(t => t.id === templateId);
    if (template) {
      const newItem: LineItem = {
        id: Date.now().toString(),
        description: template.description,
        quantity: 1,
        rate: template.rate,
        amount: template.rate
      };
      setLineItems(prev => [...prev, newItem]);
    }
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
    const discountAmount = estimateData.discountType === 'percentage' 
      ? (subtotal * estimateData.discount / 100) 
      : estimateData.discount;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * estimateData.taxRate / 100;
    const total = taxableAmount + taxAmount;

    setEstimateData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  }, [lineItems, estimateData.taxRate, estimateData.discount, estimateData.discountType]);

  // Update expiry date when estimate date or validity days change
  useEffect(() => {
    if (estimateData.estimateDate && estimateData.validityDays) {
      const expiryDate = calculateExpiryDate(estimateData.estimateDate, estimateData.validityDays);
      setEstimateData(prev => ({ ...prev, expiryDate }));
    }
  }, [estimateData.estimateDate, estimateData.validityDays]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSubmit = async (action: 'save' | 'send' | 'convert') => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would typically make an API call to save the estimate
    console.log('Estimate data:', { estimateData, lineItems, action });
    
    setIsSubmitting(false);
    
    if (action === 'convert') {
      // Redirect to create invoice with estimate data
      router.push('/finance/accounts-receivable/invoices/create?from=estimate');
    } else if (action === 'send') {
      // Redirect to estimates list
      router.push('/finance/accounts-receivable/estimates');
    } else {
      // Show success message and stay on page
      alert('Estimate saved as draft!');
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
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Estimate</h1>
            <p className="text-gray-600">Create a professional estimate for your potential customer</p>
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
        {/* Main Estimate Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estimate Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Estimate Details
              </CardTitle>
              <CardDescription>Basic estimate information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer *</Label>
                  <Select 
                    value={estimateData.customer} 
                    onValueChange={(value) => setEstimateData(prev => ({ ...prev, customer: value }))}
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
                  <Label htmlFor="estimateNumber">Estimate Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="estimateNumber"
                      value={estimateData.estimateNumber}
                      onChange={(e) => setEstimateData(prev => ({ ...prev, estimateNumber: e.target.value }))}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimateDate">Estimate Date *</Label>
                  <Input
                    id="estimateDate"
                    type="date"
                    value={estimateData.estimateDate}
                    onChange={(e) => setEstimateData(prev => ({ ...prev, estimateDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validityDays">Valid For (Days)</Label>
                  <Select 
                    value={estimateData.validityDays} 
                    onValueChange={(value) => setEstimateData(prev => ({ ...prev, validityDays: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="45">45 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={estimateData.expiryDate}
                    onChange={(e) => setEstimateData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Templates */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                Quick Add Services
              </CardTitle>
              <CardDescription>Add common services to your estimate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="justify-between h-auto p-3"
                    onClick={() => addServiceTemplate(template.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(template.rate)}/hour</div>
                    </div>
                    <Plus className="h-4 w-4" />
                  </Button>
                ))}
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
                  <CardDescription>Add services and products to this estimate</CardDescription>
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
              <CardDescription>Notes and terms for this estimate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={estimateData.notes}
                  onChange={(e) => setEstimateData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes for your customer..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms and Conditions</Label>
                <Textarea
                  id="terms"
                  value={estimateData.terms}
                  onChange={(e) => setEstimateData(prev => ({ ...prev, terms: e.target.value }))}
                  placeholder="Enter terms and conditions..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estimate Summary Sidebar */}
        <div className="space-y-6">
          {/* Totals Card */}
          <Card className="border-0 shadow-lg sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Estimate Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Discount */}
              <div className="space-y-3">
                <Label>Discount</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={estimateData.discount}
                    onChange={(e) => setEstimateData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                  />
                  <Select 
                    value={estimateData.discountType} 
                    onValueChange={(value: 'percentage' | 'fixed') => setEstimateData(prev => ({ ...prev, discountType: value }))}
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
                  value={estimateData.taxRate}
                  onChange={(e) => setEstimateData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(estimateData.subtotal)}</span>
                </div>
                
                {estimateData.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>
                      -{formatCurrency(estimateData.discountType === 'percentage' 
                        ? (estimateData.subtotal * estimateData.discount / 100) 
                        : estimateData.discount
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>Tax ({estimateData.taxRate}%):</span>
                  <span>{formatCurrency(estimateData.taxAmount)}</span>
                </div>

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatCurrency(estimateData.total)}</span>
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
                <Button 
                  onClick={() => handleSubmit('convert')}
                  disabled={isSubmitting}
                  variant="outline"
                  className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Convert to Invoice
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Estimate Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                <Clock className="mr-1 h-3 w-3" />
                Draft
              </Badge>
            </CardContent>
          </Card>

          {/* Validity Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Validity Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Valid For</span>
                <span className="text-sm font-medium">{estimateData.validityDays} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expires On</span>
                <span className="text-sm font-medium">
                  {estimateData.expiryDate ? new Date(estimateData.expiryDate).toLocaleDateString() : 'Not set'}
                </span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Estimate will automatically expire after the validity period
                </p>
              </div>
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
                Duplicate Estimate
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Eye className="mr-2 h-4 w-4" />
                Preview PDF
              </Button>
            </CardContent>
          </Card>

          {/* Conversion Notice */}
          <Card className="border-0 shadow-lg border-l-4 border-l-green-500 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-800">
                    Ready to Convert?
                  </p>
                  <p className="text-xs text-green-700">
                    Once approved by customer, you can easily convert this estimate to an invoice with one click.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateEstimate;