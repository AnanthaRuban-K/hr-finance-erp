'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard, 
  PieChart,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { Permission } from '@/types/auth';

export default function FinanceDashboard() {
  const financialStats = [
    { 
      label: 'Total Revenue', 
      value: '$2,456,789', 
      change: '+12.5%', 
      icon: DollarSign,
      trend: 'up'
    },
    { 
      label: 'Total Expenses', 
      value: '$1,234,567', 
      change: '+8.2%', 
      icon: CreditCard,
      trend: 'up'
    },
    { 
      label: 'Net Profit', 
      value: '$1,222,222', 
      change: '+18.7%', 
      icon: TrendingUp,
      trend: 'up'
    },
    { 
      label: 'Cash Flow', 
      value: '$890,123', 
      change: '-2.1%', 
      icon: TrendingDown,
      trend: 'down'
    },
  ];

  const pendingTransactions = [
    {
      id: 1,
      type: 'Accounts Payable',
      vendor: 'ABC Suppliers',
      amount: '$15,000',
      dueDate: '2024-01-20',
      status: 'pending'
    },
    {
      id: 2,
      type: 'Accounts Receivable',
      customer: 'XYZ Corp',
      amount: '$25,000',
      dueDate: '2024-01-18',
      status: 'overdue'
    },
    {
      id: 3,
      type: 'Budget Approval',
      department: 'Marketing',
      amount: '$50,000',
      dueDate: '2024-01-25',
      status: 'review'
    },
  ];

  const recentTransactions = [
    { id: 1, description: 'Office Supplies Payment', amount: '-$2,500', date: '2024-01-15', status: 'completed' },
    { id: 2, description: 'Client Payment Received', amount: '+$45,000', date: '2024-01-14', status: 'completed' },
    { id: 3, description: 'Salary Payment', amount: '-$125,000', date: '2024-01-13', status: 'completed' },
    { id: 4, description: 'Equipment Purchase', amount: '-$8,000', date: '2024-01-12', status: 'pending' },
  ];

  const budgetOverview = [
    { category: 'Personnel', allocated: 500000, spent: 425000, percentage: 85 },
    { category: 'Operations', allocated: 200000, spent: 180000, percentage: 90 },
    { category: 'Marketing', allocated: 100000, spent: 75000, percentage: 75 },
    { category: 'Technology', allocated: 150000, spent: 120000, percentage: 80 },
  ];


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'review': return <FileText className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <RoleGuard requiredPermission={Permission.MANAGE_LEDGER}>
      <div className="space-y-6">
        <PageHeader
          title="Finance Dashboard"
          description="Financial overview and management"
        >
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </PageHeader>

        {/* Financial Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {financialStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pending Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Transactions</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{transaction.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.vendor || transaction.customer || transaction.department}
                      </p>
                      <Badge className={transaction.status === 'overdue' ? 'destructive' : 'outline'}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">{transaction.amount}</p>
                      <p className="text-xs text-muted-foreground">Due: {transaction.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(transaction.status)}
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount}
                      </p>
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
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Current budget allocation and spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {budgetOverview.map((budget) => (
                <div key={budget.category} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{budget.category}</h4>
                    <Badge className={budget.percentage > 90 ? 'destructive' : 'outline'}>
                      {budget.percentage}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Allocated</span>
                      <span>${budget.allocated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Spent</span>
                      <span>${budget.spent.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          budget.percentage > 90 ? 'bg-red-500' :
                          budget.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${budget.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <CreditCard className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Accounts Payable</p>
                  <p className="text-xs text-muted-foreground">Manage vendor payments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Accounts Receivable</p>
                  <p className="text-xs text-muted-foreground">Track customer payments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <PieChart className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Budget Planning</p>
                  <p className="text-xs text-muted-foreground">Plan and forecast budgets</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}