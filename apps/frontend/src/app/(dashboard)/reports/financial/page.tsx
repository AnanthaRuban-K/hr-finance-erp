'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Calendar,
  FileText,
  Calculator,
  Target,
  Briefcase,
  CreditCard,
  Building,
  Eye,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Wallet,
  Receipt
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/types/auth';

export default function FinancialReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Financial overview metrics
  const financialMetrics = {
    totalRevenue: { value: '$2,847,500', change: '+12.5%', trend: 'up' },
    totalExpenses: { value: '$1,943,200', change: '+8.3%', trend: 'up' },
    netProfit: { value: '$904,300', change: '+18.7%', trend: 'up' },
    profitMargin: { value: '31.8%', change: '+2.1%', trend: 'up' },
    cashFlow: { value: '$1,245,600', change: '+15.2%', trend: 'up' },
    workingCapital: { value: '$3,421,800', change: '+5.7%', trend: 'up' }
  };

  // Report categories with detailed information
  const reportCategories = [
    {
      id: 'profit-loss',
      title: 'Profit & Loss Statement',
      description: 'Comprehensive income statement showing revenue, expenses, and net profit',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      lastGenerated: '2 hours ago',
      frequency: 'Monthly',
      status: 'active',
      metrics: {
        revenue: '$2.84M',
        expenses: '$1.94M',
        profit: '$904K'
      }
    },
    {
      id: 'balance-sheet',
      title: 'Balance Sheet',
      description: 'Assets, liabilities, and equity position at a specific point in time',
      icon: Building,
      color: 'bg-blue-500',
      lastGenerated: '1 day ago',
      frequency: 'Quarterly',
      status: 'active',
      metrics: {
        assets: '$12.5M',
        liabilities: '$3.2M',
        equity: '$9.3M'
      }
    },
    {
      id: 'cash-flow',
      title: 'Cash Flow Statement',
      description: 'Operating, investing, and financing cash flow activities',
      icon: Banknote,
      color: 'bg-purple-500',
      lastGenerated: '3 hours ago',
      frequency: 'Monthly',
      status: 'active',
      metrics: {
        operating: '$1.24M',
        investing: '-$245K',
        financing: '$180K'
      }
    },
    {
      id: 'budget-analysis',
      title: 'Budget vs Actual Analysis',
      description: 'Compare actual performance against budgeted targets',
      icon: Target,
      color: 'bg-orange-500',
      lastGenerated: '5 hours ago',
      frequency: 'Monthly',
      status: 'active',
      metrics: {
        variance: '+5.2%',
        accuracy: '94.8%',
        forecast: '$3.1M'
      }
    },
    {
      id: 'receivables',
      title: 'Accounts Receivable Report',
      description: 'Outstanding customer payments and aging analysis',
      icon: Receipt,
      color: 'bg-cyan-500',
      lastGenerated: '1 hour ago',
      frequency: 'Weekly',
      status: 'active',
      metrics: {
        outstanding: '$845K',
        overdue: '$124K',
        avgDays: '28 days'
      }
    },
    {
      id: 'payables',
      title: 'Accounts Payable Report',
      description: 'Vendor payments and supplier analysis',
      icon: CreditCard,
      color: 'bg-red-500',
      lastGenerated: '4 hours ago',
      frequency: 'Weekly',
      status: 'active',
      metrics: {
        totalDue: '$523K',
        upcoming: '$245K',
        avgDays: '35 days'
      }
    },
    {
      id: 'tax-report',
      title: 'Tax Reports',
      description: 'GST, income tax, and statutory compliance reports',
      icon: Calculator,
      color: 'bg-indigo-500',
      lastGenerated: '1 day ago',
      frequency: 'Monthly',
      status: 'active',
      metrics: {
        gstLiability: '$89K',
        incomeTax: '$156K',
        compliance: '100%'
      }
    },
    {
      id: 'expense-analysis',
      title: 'Expense Analysis',
      description: 'Detailed breakdown of operational and capital expenses',
      icon: Wallet,
      color: 'bg-pink-500',
      lastGenerated: '6 hours ago',
      frequency: 'Monthly',
      status: 'active',
      metrics: {
        operational: '$1.65M',
        capital: '$289K',
        variance: '-2.3%'
      }
    }
  ];

  // Key financial ratios
  const financialRatios = [
    { name: 'Current Ratio', value: '2.45', benchmark: '2.0+', status: 'good' },
    { name: 'Quick Ratio', value: '1.89', benchmark: '1.0+', status: 'good' },
    { name: 'Debt to Equity', value: '0.34', benchmark: '<0.5', status: 'excellent' },
    { name: 'ROA', value: '15.2%', benchmark: '10%+', status: 'excellent' },
    { name: 'ROE', value: '22.8%', benchmark: '15%+', status: 'excellent' },
    { name: 'Gross Margin', value: '45.6%', benchmark: '40%+', status: 'good' }
  ];

  const handleGenerateReport = async (reportId: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log('Generating report:', reportId);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: 'bg-emerald-100 text-emerald-800',
      good: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.good;
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ArrowUpRight className="h-4 w-4 text-emerald-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.FINANCE_MANAGER]}>
      <div className="space-y-6">
        <PageHeader
          title="Financial Reports"
          description="Comprehensive financial analysis and reporting dashboard"
        >
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </PageHeader>

        {/* Financial Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(financialMetrics).map(([key, metric]) => (
            <Card key={key} className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm ${metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">All Reports</TabsTrigger>
            <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
            <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="period">Time Period</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current-month">Current Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="current-quarter">Current Quarter</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="current-year">Current Year</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Reports</SelectItem>
                        <SelectItem value="statements">Financial Statements</SelectItem>
                        <SelectItem value="analysis">Analysis Reports</SelectItem>
                        <SelectItem value="compliance">Compliance Reports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Export Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Categories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {reportCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 ${category.color} rounded-xl shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {category.frequency}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Report Metrics */}
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(category.metrics).map(([key, value]) => (
                          <div key={key} className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm font-bold text-gray-900">{value}</p>
                            <p className="text-xs text-gray-500 capitalize">{key}</p>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-gray-500">
                          Updated {category.lastGenerated}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateReport(category.id)}
                            disabled={isLoading}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleGenerateReport(category.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="ratios" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Key Financial Ratios</CardTitle>
                <CardDescription>
                  Essential financial ratios to assess company performance and health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {financialRatios.map((ratio, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{ratio.name}</h4>
                        <Badge className={getStatusColor(ratio.status)}>
                          {ratio.status}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{ratio.value}</p>
                      <p className="text-sm text-gray-500">Benchmark: {ratio.benchmark}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ratio Analysis Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Ratio Trend Analysis</CardTitle>
                <CardDescription>
                  Historical performance of key financial ratios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Ratio trend chart would be displayed here</p>
                    <p className="text-sm text-gray-400">Integration with charting library required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Revenue trend chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Categorized expense analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Expense pie chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Profit Margin Trend</CardTitle>
                  <CardDescription>Gross and net profit margin evolution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Profit margin trend</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Cash Flow Analysis</CardTitle>
                  <CardDescription>Operating, investing, and financing cash flows</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Cash flow analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>AI-Powered Financial Forecast</CardTitle>
                  <CardDescription>
                    Machine learning-based predictions for the next 12 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50 rounded-lg">
                        <p className="text-sm text-emerald-600 font-medium">Predicted Revenue</p>
                        <p className="text-2xl font-bold text-emerald-900">$36.5M</p>
                        <p className="text-sm text-emerald-600">+28.2% growth</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium">Predicted Profit</p>
                        <p className="text-2xl font-bold text-blue-900">$11.8M</p>
                        <p className="text-sm text-blue-600">32.3% margin</p>
                      </div>
                    </div>
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">AI forecast visualization</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Scenario Analysis</CardTitle>
                  <CardDescription>
                    Best case, worst case, and most likely scenarios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium text-emerald-800">Best Case</span>
                          <span className="text-emerald-600">+45% growth</span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-800">Most Likely</span>
                          <span className="text-blue-600">+28% growth</span>
                        </div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium text-orange-800">Worst Case</span>
                          <span className="text-orange-600">+12% growth</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Run Custom Scenario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Analysis */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Financial Risk Assessment</CardTitle>
                <CardDescription>
                  Automated risk analysis and early warning indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-800">Low Risk</h4>
                    <p className="text-sm text-emerald-600">Liquidity Position</p>
                    <p className="text-emerald-500 text-xs">Strong cash reserves</p>
                  </div>
                  <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800">Medium Risk</h4>
                    <p className="text-sm text-yellow-600">Customer Concentration</p>
                    <p className="text-yellow-500 text-xs">Monitor top 3 clients</p>
                  </div>
                  <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-800">Low Risk</h4>
                    <p className="text-sm text-emerald-600">Debt Levels</p>
                    <p className="text-emerald-500 text-xs">Well within limits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}