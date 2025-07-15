'use client';

import { useAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClientOnly } from '@/components/client-only';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  CreditCard,
  FileText,
  Calculator,
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Download
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { Permission } from '@/types/auth';

function FinanceDashboardContent() {
  const { user } = useAuth();

  const financeStats = [
    { 
      label: 'Monthly Payroll', 
      value: '$2,847,500', 
      icon: CreditCard, 
      trend: '+5.2%', 
      trendDirection: 'up',
      description: 'vs last month'
    },
    { 
      label: 'Total Expenses', 
      value: '$1,243,200', 
      icon: FileText, 
      trend: '-2.1%', 
      trendDirection: 'down',
      description: 'vs last month'
    },
    { 
      label: 'Budget Utilization', 
      value: '78.5%', 
      icon: PieChart, 
      trend: '+12%', 
      trendDirection: 'up',
      description: 'of annual budget'
    },
    { 
      label: 'Pending Approvals', 
      value: '15', 
      icon: Clock, 
      trend: '3 urgent', 
      trendDirection: 'neutral',
      description: 'requires attention'
    },
  ];

  const recentTransactions = [
    { id: 1, type: 'Payroll', description: 'January 2024 Salary Payment', amount: '$2,847,500', date: '2024-01-15', status: 'completed', category: 'salary' },
    { id: 2, type: 'Expense', description: 'Office Rent - Q1 2024', amount: '$45,000', date: '2024-01-14', status: 'pending', category: 'operational' },
    { id: 3, type: 'Reimbursement', description: 'Employee Travel Claims', amount: '$12,850', date: '2024-01-12', status: 'processing', category: 'travel' },
    { id: 4, type: 'Vendor Payment', description: 'Software Licenses', amount: '$28,500', date: '2024-01-10', status: 'completed', category: 'technology' },
  ];

  const budgetBreakdown = [
    { category: 'Salaries & Benefits', allocated: 3200000, spent: 2847500, percentage: 89 },
    { category: 'Operations', allocated: 800000, spent: 640000, percentage: 80 },
    { category: 'Technology', allocated: 400000, spent: 285000, percentage: 71 },
    { category: 'Marketing', allocated: 300000, spent: 195000, percentage: 65 },
    { category: 'Travel', allocated: 150000, spent: 89000, percentage: 59 },
  ];

  const upcomingPayments = [
    { id: 1, description: 'February Payroll', amount: '$2,890,000', dueDate: '2024-02-01', priority: 'high' },
    { id: 2, description: 'Quarterly Tax Payment', amount: '$180,000', dueDate: '2024-01-31', priority: 'high' },
    { id: 3, description: 'Insurance Premium', amount: '$25,000', dueDate: '2024-02-05', priority: 'medium' },
    { id: 4, description: 'Vendor Payments', amount: '$145,000', dueDate: '2024-02-10', priority: 'medium' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing': return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <RoleGuard requiredPermission={Permission.MANAGE_LEDGER}>
      <div className="space-y-6">
        <PageHeader
          title={`Welcome, ${user?.firstName || 'Finance Manager'}!`}
          description="Monitor financial performance, manage payroll, and track expenses"
        >
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </div>
        </PageHeader>

        {/* Finance Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {financeStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center mt-1">
                  {stat.trendDirection === 'up' && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
                  {stat.trendDirection === 'down' && <TrendingDown className="h-3 w-3 text-red-500 mr-1" />}
                  <p className={`text-xs ${
                    stat.trendDirection === 'up' ? 'text-green-600' : 
                    stat.trendDirection === 'down' ? 'text-red-600' : 
                    'text-muted-foreground'
                  }`}>
                    {stat.trend} {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activities and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.type} • {transaction.date}</p>
                      <p className="text-sm font-bold text-green-600">{transaction.amount}</p>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>Scheduled payments and financial obligations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className={`border-l-4 pl-3 ${getPriorityColor(payment.priority)}`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{payment.description}</p>
                        <p className="text-xs text-muted-foreground">Due: {payment.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{payment.amount}</p>
                        <Badge variant={payment.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                          {payment.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Budget Overview
            </CardTitle>
            <CardDescription>Current year budget allocation and utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetBreakdown.map((budget) => (
                <div key={budget.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{budget.category}</h4>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}</p>
                      <p className="text-xs text-muted-foreground">{budget.percentage}% utilized</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={budget.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Remaining: {formatCurrency(budget.allocated - budget.spent)}</span>
                      <span>{100 - budget.percentage}% available</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <CreditCard className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Process Payroll</p>
                  <p className="text-xs text-muted-foreground">Run monthly payroll</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Expense Reports</p>
                  <p className="text-xs text-muted-foreground">Review submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Calculator className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="font-medium">Financial Reports</p>
                  <p className="text-xs text-muted-foreground">Generate reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <DollarSign className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Budget Planning</p>
                  <p className="text-xs text-muted-foreground">Plan next quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}

export default function FinanceDashboard() {
  return (
    <ClientOnly fallback={
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <FinanceDashboardContent />
    </ClientOnly>
  );
}