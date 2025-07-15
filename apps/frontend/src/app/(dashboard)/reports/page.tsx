'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  ChevronRight,
  PieChart,
  LineChart,
  Target,
  Briefcase,
  Award,
  Wallet,
  Building,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/types/auth';

export default function ReportsMainPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  // Mock data for dashboard metrics
  const dashboardMetrics = {
    totalReports: 156,
    scheduledReports: 24,
    recentGenerations: 89,
    avgGenerationTime: '2.3s'
  };

  // Report categories with enhanced data
  const reportCategories = [
    {
      id: 'financial',
      title: 'Financial Reports',
      description: 'P&L, Balance Sheet, Cash Flow, and Budget Analysis',
      icon: DollarSign,
      color: 'bg-emerald-500',
      reports: 32,
      lastGenerated: '2 hours ago',
      href: '/reports/financial',
      metrics: {
        totalRevenue: '$2.4M',
        monthlyGrowth: '+12.5%',
        profitMargin: '18.2%'
      },
      quickActions: ['Generate P&L', 'Budget vs Actual', 'Cash Flow Forecast']
    },
    {
      id: 'hr',
      title: 'HR Reports',
      description: 'Employee Analytics, Performance, and Recruitment Stats',
      icon: Users,
      color: 'bg-blue-500',
      reports: 28,
      lastGenerated: '1 hour ago',
      href: '/reports/hr',
      metrics: {
        totalEmployees: '247',
        turnoverRate: '3.2%',
        avgTenure: '2.8 years'
      },
      quickActions: ['Headcount Report', 'Performance Analytics', 'Recruitment Funnel']
    },
    {
      id: 'payroll',
      title: 'Payroll Reports',
      description: 'Salary Analysis, Tax Deductions, and Benefits Overview',
      icon: Wallet,
      color: 'bg-purple-500',
      reports: 18,
      lastGenerated: '3 hours ago',
      href: '/reports/payroll',
      metrics: {
        monthlyPayroll: '$1.2M',
        avgSalary: '$4,863',
        benefitsCost: '$245K'
      },
      quickActions: ['Salary Register', 'Tax Summary', 'Benefits Analysis']
    },
    {
      id: 'attendance',
      title: 'Attendance Reports',
      description: 'Time Tracking, Leave Analysis, and Productivity Metrics',
      icon: Clock,
      color: 'bg-orange-500',
      reports: 15,
      lastGenerated: '30 minutes ago',
      href: '/reports/attendance',
      metrics: {
        avgAttendance: '96.8%',
        lateArrivals: '2.1%',
        leaveUtilization: '68%'
      },
      quickActions: ['Daily Attendance', 'Leave Summary', 'Overtime Analysis']
    }
  ];

  // Recent report activities
  const recentActivities = [
    {
      id: 1,
      type: 'generated',
      report: 'Monthly P&L Statement',
      user: 'John Smith',
      timestamp: '2 hours ago',
      category: 'Financial',
      status: 'completed'
    },
    {
      id: 2,
      type: 'scheduled',
      report: 'Weekly Attendance Summary',
      user: 'Sarah Johnson',
      timestamp: '4 hours ago',
      category: 'Attendance',
      status: 'pending'
    },
    {
      id: 3,
      type: 'exported',
      report: 'Employee Performance Review',
      user: 'Mike Davis',
      timestamp: '6 hours ago',
      category: 'HR',
      status: 'completed'
    },
    {
      id: 4,
      type: 'generated',
      report: 'Payroll Tax Summary',
      user: 'Lisa Chen',
      timestamp: '1 day ago',
      category: 'Payroll',
      status: 'completed'
    }
  ];

  // Quick insights data
  const quickInsights = [
    {
      title: 'Revenue Trend',
      value: '+15.2%',
      description: 'vs last month',
      trend: 'up',
      color: 'text-emerald-600'
    },
    {
      title: 'Employee Satisfaction',
      value: '4.2/5',
      description: 'Latest survey',
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      title: 'Payroll Variance',
      value: '-2.1%',
      description: 'vs budget',
      trend: 'down',
      color: 'text-purple-600'
    },
    {
      title: 'Attendance Rate',
      value: '96.8%',
      description: 'This month',
      trend: 'up',
      color: 'text-orange-600'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'generated': return <FileText className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'exported': return <Download className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.FINANCE_MANAGER, UserRole.SUPERVISOR]}>
      <div className="space-y-6">
        <PageHeader
          title="Reports & Analytics"
          description="Comprehensive business intelligence and reporting dashboard"
        >
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>
        </PageHeader>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Reports</p>
                  <p className="text-3xl font-bold text-blue-900">{dashboardMetrics.totalReports}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Scheduled</p>
                  <p className="text-3xl font-bold text-emerald-900">{dashboardMetrics.scheduledReports}</p>
                </div>
                <div className="p-3 bg-emerald-500 rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Recent Generations</p>
                  <p className="text-3xl font-bold text-purple-900">{dashboardMetrics.recentGenerations}</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg Generation Time</p>
                  <p className="text-3xl font-bold text-orange-900">{dashboardMetrics.avgGenerationTime}</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Report Categories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reportCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 ${category.color} rounded-xl shadow-lg`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                              {category.title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Category Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(category.metrics).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <p className="text-lg font-bold text-gray-900">{value}</p>
                            <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          </div>
                        ))}
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Quick Actions:</p>
                        <div className="flex flex-wrap gap-2">
                          {category.quickActions.map((action, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{category.reports} reports</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">Updated {category.lastGenerated}</span>
                        </div>
                        <Link href={category.href}>
                          <Button size="sm" variant="outline" className="group-hover:bg-blue-50 group-hover:border-blue-200">
                            <Eye className="h-4 w-4 mr-1" />
                            View All
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Detailed Category List */}
            <div className="grid grid-cols-1 gap-4">
              {reportCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 ${category.color} rounded-lg`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{category.title}</h3>
                            <p className="text-gray-600">{category.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-gray-500">{category.reports} reports available</span>
                              <Badge variant="outline">{category.lastGenerated}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <Link href={category.href}>
                            <Button size="sm">
                              View Reports
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickInsights.map((insight, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{insight.title}</p>
                        <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
                        <p className="text-sm text-gray-500">{insight.description}</p>
                      </div>
                      <div className="text-right">
                        {insight.trend === 'up' ? (
                          <ArrowUpRight className={`h-6 w-6 ${insight.color}`} />
                        ) : (
                          <ArrowDownRight className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI-Powered Insights */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>
                  Automated analysis and recommendations based on your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900">Revenue Optimization</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Your Q4 revenue is trending 15% above target. Consider expanding the sales team by 2-3 members.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900">Employee Retention</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Employees in the engineering department show 90% satisfaction. Implement similar practices company-wide.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Recent Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Report Activities</CardTitle>
                <CardDescription>Latest report generations, exports, and scheduled tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{activity.report}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>by {activity.user}</span>
                            <span>•</span>
                            <span>{activity.timestamp}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {activity.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusBadge(activity.status)}>
                          {activity.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}