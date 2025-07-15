'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Wallet,
  DollarSign,
  Calculator,
  CreditCard,
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  Play,
  Pause,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Building2,
  Percent,
  Receipt,
  Shield,
  Target,
  Activity,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Mail,
  Phone
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/types/auth';

export default function PayrollMainPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [payrollStatus, setPayrollStatus] = useState('in-progress');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Payroll overview metrics
  const payrollMetrics = {
    totalPayroll: { value: '$1,247,850', change: '+5.2%', trend: 'up' },
    totalEmployees: { value: '247', change: '+3', trend: 'up' },
    avgSalary: { value: '$5,186', change: '+2.8%', trend: 'up' },
    totalDeductions: { value: '$312,450', change: '+3.1%', trend: 'up' },
    netPayout: { value: '$935,400', change: '+6.1%', trend: 'up' },
    pendingApprovals: { value: '12', change: '-5', trend: 'down' }
  };

  // Current payroll cycle information
  const currentPayrollCycle = {
    period: 'March 2025',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    payDate: '2025-04-05',
    status: 'Processing',
    progress: 75,
    totalAmount: '$1,247,850',
    employeesProcessed: 235,
    totalEmployees: 247,
    approvalsPending: 12
  };

  // Recent payroll activities
  const recentActivities = [
    {
      id: 1,
      action: 'Payroll Processed',
      description: 'Engineering Department - 85 employees',
      user: 'Sarah Johnson',
      timestamp: '2 hours ago',
      status: 'completed',
      amount: '$542,850'
    },
    {
      id: 2,
      action: 'Salary Adjustment',
      description: 'John Doe - Performance bonus added',
      user: 'Mike Davis',
      timestamp: '4 hours ago',
      status: 'approved',
      amount: '+$2,500'
    },
    {
      id: 3,
      action: 'Overtime Calculated',
      description: 'Sales Team - 124 hours overtime',
      user: 'Lisa Chen',
      timestamp: '6 hours ago',
      status: 'completed',
      amount: '$18,600'
    },
    {
      id: 4,
      action: 'Tax Deduction Updated',
      description: 'Q1 Tax calculation completed',
      user: 'System',
      timestamp: '1 day ago',
      status: 'completed',
      amount: '$187,250'
    }
  ];

  // Department payroll summary
  const departmentSummary = [
    {
      department: 'Engineering',
      employees: 85,
      totalCost: '$542,850',
      avgSalary: '$6,386',
      status: 'completed',
      lastProcessed: '2 hours ago'
    },
    {
      department: 'Sales',
      employees: 45,
      totalCost: '$287,250',
      avgSalary: '$6,383',
      status: 'completed',
      lastProcessed: '3 hours ago'
    },
    {
      department: 'Marketing',
      employees: 28,
      totalCost: '$168,420',
      avgSalary: '$6,015',
      status: 'processing',
      lastProcessed: '1 hour ago'
    },
    {
      department: 'Finance',
      employees: 22,
      totalCost: '$132,000',
      avgSalary: '$6,000',
      status: 'pending',
      lastProcessed: 'Not started'
    },
    {
      department: 'Operations',
      employees: 35,
      totalCost: '$175,000',
      avgSalary: '$5,000',
      status: 'pending',
      lastProcessed: 'Not started'
    },
    {
      department: 'HR',
      employees: 12,
      totalCost: '$72,000',
      avgSalary: '$6,000',
      status: 'pending',
      lastProcessed: 'Not started'
    }
  ];

  // Pending approvals
  const pendingApprovals = [
    {
      id: 1,
      employee: 'Robert Chen',
      department: 'Engineering',
      type: 'Overtime',
      amount: '$1,245',
      submittedBy: 'Team Lead',
      submittedDate: '2025-03-28',
      reason: 'Project deadline overtime'
    },
    {
      id: 2,
      employee: 'Maria Garcia',
      department: 'Sales',
      type: 'Bonus',
      amount: '$3,500',
      submittedBy: 'Sales Manager',
      submittedDate: '2025-03-27',
      reason: 'Q1 target achievement bonus'
    },
    {
      id: 3,
      employee: 'James Wilson',
      department: 'Marketing',
      type: 'Salary Adjustment',
      amount: '+$500',
      submittedBy: 'HR Manager',
      submittedDate: '2025-03-26',
      reason: 'Annual increment'
    }
  ];

  // Quick actions data
  const quickActions = [
    {
      title: 'Process Current Payroll',
      description: 'Run payroll for current period',
      icon: Play,
      color: 'bg-emerald-500',
      action: 'process-payroll'
    },
    {
      title: 'Generate Payslips',
      description: 'Create and distribute payslips',
      icon: FileText,
      color: 'bg-blue-500',
      action: 'generate-payslips'
    },
    {
      title: 'Tax Calculations',
      description: 'Calculate and update tax deductions',
      icon: Calculator,
      color: 'bg-purple-500',
      action: 'calculate-taxes'
    },
    {
      title: 'Bank Transfer',
      description: 'Initiate salary bank transfers',
      icon: Banknote,
      color: 'bg-orange-500',
      action: 'bank-transfer'
    },
    {
      title: 'Compliance Report',
      description: 'Generate statutory reports',
      icon: Shield,
      color: 'bg-cyan-500',
      action: 'compliance-report'
    },
    {
      title: 'Bulk Upload',
      description: 'Upload salary data in bulk',
      icon: Upload,
      color: 'bg-pink-500',
      action: 'bulk-upload'
    }
  ];

  const handleProcessPayroll = async () => {
    setIsProcessing(true);
    // Simulate payroll processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    console.log('Payroll processing initiated');
  };

  const handleApproval = async (id: number, action: 'approve' | 'reject') => {
    console.log(`${action} approval for ID: ${id}`);
    // Handle approval logic here
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Handle quick action logic here
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ArrowUpRight className="h-4 w-4 text-emerald-600" />
    ) : trend === 'down' ? (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    ) : null;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-emerald-100 text-emerald-800',
      processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER]}>
      <div className="space-y-6">
        <PageHeader
          title="Payroll Management"
          description="Comprehensive payroll processing, salary management, and compliance tracking"
        >
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={handleProcessPayroll}
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isProcessing ? 'Processing...' : 'Process Payroll'}
            </Button>
          </div>
        </PageHeader>

        {/* Payroll Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(payrollMetrics).map(([key, metric]) => (
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
                      <span className={`text-sm ${
                        metric.trend === 'up' ? 'text-emerald-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Payroll Cycle Status */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Current Payroll Cycle</CardTitle>
                <CardDescription>
                  {currentPayrollCycle.period} • Pay Date: {new Date(currentPayrollCycle.payDate).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(currentPayrollCycle.status.toLowerCase())}>
                {getStatusIcon(currentPayrollCycle.status.toLowerCase())}
                <span className="ml-1">{currentPayrollCycle.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Progress</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentPayrollCycle.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{currentPayrollCycle.progress}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-blue-600">{currentPayrollCycle.totalAmount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Employees Processed</p>
                <p className="text-lg font-bold text-emerald-600">
                  {currentPayrollCycle.employeesProcessed}/{currentPayrollCycle.totalEmployees}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-lg font-bold text-orange-600">{currentPayrollCycle.approvalsPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used payroll operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow group">
                        <CardContent className="p-4">
                          <div 
                            className="flex items-center space-x-3"
                            onClick={() => handleQuickAction(action.action)}
                          >
                            <div className={`p-3 ${action.color} rounded-lg group-hover:scale-105 transition-transform`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">
                                {action.title}
                              </h4>
                              <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Department Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Department Summary</CardTitle>
                <CardDescription>Payroll processing status by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentSummary.map((dept, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                            <p className="text-sm text-gray-500">{dept.employees} employees</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-6 text-center">
                          <div>
                            <p className="text-sm text-gray-500">Total Cost</p>
                            <p className="font-semibold text-gray-900">{dept.totalCost}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Avg Salary</p>
                            <p className="font-semibold text-blue-600">{dept.avgSalary}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <Badge className={getStatusColor(dept.status)}>{dept.status}</Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Last Processed</p>
                            <p className="text-xs text-gray-600">{dept.lastProcessed}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Payroll Activities</CardTitle>
                <CardDescription>Latest payroll transactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Activity className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{activity.action}</h4>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>by {activity.user}</span>
                            <span>•</span>
                            <span>{activity.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{activity.amount}</p>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            {/* Payroll Processing Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Payroll Processing</CardTitle>
                  <CardDescription>Run and manage payroll calculations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pay Period</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current-month">Current Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Include Overtime</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Auto-calculate Tax</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Generate Payslips</span>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={handleProcessPayroll}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      {isProcessing ? 'Processing Payroll...' : 'Start Payroll Processing'}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Processing
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Processing Status</CardTitle>
                  <CardDescription>Real-time payroll processing updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{currentPayrollCycle.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${currentPayrollCycle.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-emerald-50 rounded">
                        <span className="text-sm">Salary Calculations</span>
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-emerald-50 rounded">
                        <span className="text-sm">Tax Deductions</span>
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">Benefits Processing</span>
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Payslip Generation</span>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Processing Log */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Processing Log</CardTitle>
                <CardDescription>Detailed payroll processing activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="flex items-center space-x-2 text-sm p-2 bg-emerald-50 rounded">
                    <Clock className="h-3 w-3 text-emerald-600" />
                    <span className="text-gray-500">15:30:25</span>
                    <span>Engineering department processing completed - 85 employees</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm p-2 bg-blue-50 rounded">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span className="text-gray-500">15:28:12</span>
                    <span>Tax calculations updated for Q1 2025</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm p-2 bg-emerald-50 rounded">
                    <Clock className="h-3 w-3 text-emerald-600" />
                    <span className="text-gray-500">15:25:45</span>
                    <span>Overtime calculations completed - 124 hours processed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm p-2 bg-blue-50 rounded">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span className="text-gray-500">15:20:30</span>
                    <span>Salary processing initiated for March 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>Salary adjustments and additions requiring approval</CardDescription>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    {pendingApprovals.length} pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">{approval.employee}</h4>
                              <p className="text-sm text-gray-600">{approval.department}</p>
                            </div>
                            <Badge variant="outline">{approval.type}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Amount: </span>
                              <span className="font-medium">{approval.amount}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Submitted by: </span>
                              <span className="font-medium">{approval.submittedBy}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Date: </span>
                              <span className="font-medium">{approval.submittedDate}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Reason: </span>{approval.reason}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApproval(approval.id, 'reject')}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApproval(approval.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Report Generation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Create payroll and compliance reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payroll-summary">Payroll Summary</SelectItem>
                        <SelectItem value="tax-report">Tax Report</SelectItem>
                        <SelectItem value="department-wise">Department Wise</SelectItem>
                        <SelectItem value="compliance">Compliance Report</SelectItem>
                        <SelectItem value="payslips">Payslips</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current-month">Current Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="current-quarter">Current Quarter</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select>
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

                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Previously generated payroll reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">March 2025 Payroll Summary</h4>
                        <p className="text-sm text-gray-600">Generated 2 hours ago</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Q1 Tax Report</h4>
                        <p className="text-sm text-gray-600">Generated 1 day ago</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">February Payslips</h4>
                        <p className="text-sm text-gray-600">Generated 1 week ago</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Payroll Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Payroll Configuration</CardTitle>
                  <CardDescription>Basic payroll system settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Pay Frequency</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="sgd">SGD (S$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Auto-calculate overtime</span>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Email payslips automatically</span>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Require approval for bonuses</span>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Tax Configuration</CardTitle>
                  <CardDescription>Tax calculation and compliance settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tax Year</Label>
                    <Select defaultValue="2025">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Default Income Tax Rate (%)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>

                  <div className="space-y-2">
                    <Label>PF Contribution Rate (%)</Label>
                    <Input type="number" defaultValue="12" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Auto-calculate tax deductions</span>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Generate tax reports monthly</span>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure payroll-related notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span className="font-medium">Payroll completion alerts</span>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Email notifications</span>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">SMS alerts for errors</span>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label>Notification Recipients</Label>
                    <Input placeholder="Enter email addresses (comma separated)" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Data Backup & Security</CardTitle>
                  <CardDescription>Backup and security configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Automatic daily backups</span>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Encrypt sensitive data</span>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Retention (days)</Label>
                    <Input type="number" defaultValue="90" />
                  </div>

                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Manual Backup
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}