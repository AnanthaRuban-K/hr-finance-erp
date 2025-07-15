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
  Users,
  UserCheck,
  UserPlus,
  UserMinus,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Award,
  Clock,
  Calendar,
  Target,
  Briefcase,
  GraduationCap,
  Heart,
  MapPin,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  AlertCircle,
  CheckCircle,
  Building2,
  Phone
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/types/auth';

export default function HRReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // HR overview metrics
  const hrMetrics = {
    totalEmployees: { value: '247', change: '+8', trend: 'up' },
    activeEmployees: { value: '241', change: '+6', trend: 'up' },
    newHires: { value: '12', change: '+3', trend: 'up' },
    turnoverRate: { value: '3.2%', change: '-0.8%', trend: 'down' },
    avgTenure: { value: '2.8 yrs', change: '+0.2', trend: 'up' },
    satisfactionScore: { value: '4.2/5', change: '+0.1', trend: 'up' }
  };

  // Department breakdown
  const departmentData = [
    { name: 'Engineering', employees: 85, change: '+5', satisfaction: 4.3, turnover: '2.1%' },
    { name: 'Sales', employees: 45, change: '+2', satisfaction: 4.1, turnover: '4.2%' },
    { name: 'Marketing', employees: 28, change: '+1', satisfaction: 4.0, turnover: '3.8%' },
    { name: 'Finance', employees: 22, change: '0', satisfaction: 4.2, turnover: '1.9%' },
    { name: 'HR', employees: 12, change: '0', satisfaction: 4.4, turnover: '2.5%' },
    { name: 'Operations', employees: 35, change: '+3', satisfaction: 3.9, turnover: '5.1%' },
    { name: 'Customer Support', employees: 20, change: '+1', satisfaction: 4.0, turnover: '6.2%' }
  ];

  // HR report categories
  const reportCategories = [
    {
      id: 'employee-overview',
      title: 'Employee Overview Report',
      description: 'Comprehensive headcount analysis and demographic breakdown',
      icon: Users,
      color: 'bg-blue-500',
      lastGenerated: '1 hour ago',
      frequency: 'Daily',
      status: 'active',
      metrics: {
        headcount: '247',
        departments: '7',
        locations: '3'
      }
    },
    {
      id: 'recruitment-analysis',
      title: 'Recruitment & Hiring Report',
      description: 'Hiring pipeline, source effectiveness, and time-to-hire metrics',
      icon: UserPlus,
      color: 'bg-emerald-500',
      lastGenerated: '2 hours ago',
      frequency: 'Weekly',
      status: 'active',
      metrics: {
        openPositions: '18',
        avgTimeToHire: '28 days',
        costPerHire: '$3,245'
      }
    },
    {
      id: 'performance-analytics',
      title: 'Performance Analytics',
      description: 'Employee performance scores, goal achievement, and review cycles',
      icon: Award,
      color: 'bg-purple-500',
      lastGenerated: '4 hours ago',
      frequency: 'Monthly',
      status: 'active',
      metrics: {
        avgRating: '4.1/5',
        goalAchievement: '87%',
        reviewsCompleted: '94%'
      }
    },
    {
      id: 'training-development',
      title: 'Training & Development',
      description: 'Learning programs, skill development, and certification tracking',
      icon: GraduationCap,
      color: 'bg-orange-500',
      lastGenerated: '3 hours ago',
      frequency: 'Monthly',
      status: 'active',
      metrics: {
        trainingHours: '1,248',
        certifications: '156',
        completion: '92%'
      }
    },
    {
      id: 'employee-engagement',
      title: 'Employee Engagement',
      description: 'Satisfaction surveys, engagement scores, and feedback analysis',
      icon: Heart,
      color: 'bg-pink-500',
      lastGenerated: '1 day ago',
      frequency: 'Quarterly',
      status: 'active',
      metrics: {
        engagementScore: '78%',
        surveyResponse: '89%',
        npsScore: '+45'
      }
    },
    {
      id: 'diversity-inclusion',
      title: 'Diversity & Inclusion',
      description: 'Workforce diversity metrics and inclusion program effectiveness',
      icon: Building2,
      color: 'bg-cyan-500',
      lastGenerated: '5 hours ago',
      frequency: 'Monthly',
      status: 'active',
      metrics: {
        genderRatio: '52:48',
        diversityIndex: '73%',
        inclusionScore: '81%'
      }
    },
    {
      id: 'compensation-benefits',
      title: 'Compensation & Benefits',
      description: 'Salary benchmarking, benefits utilization, and cost analysis',
      icon: Briefcase,
      color: 'bg-indigo-500',
      lastGenerated: '6 hours ago',
      frequency: 'Monthly',
      status: 'active',
      metrics: {
        avgSalary: '$64,850',
        benefitsUtilization: '87%',
        payEquity: '96%'
      }
    },
    {
      id: 'workforce-planning',
      title: 'Workforce Planning',
      description: 'Succession planning, skill gap analysis, and future workforce needs',
      icon: Target,
      color: 'bg-red-500',
      lastGenerated: '8 hours ago',
      frequency: 'Quarterly',
      status: 'active',
      metrics: {
        skillGaps: '12',
        successorsCovered: '78%',
        criticalRoles: '15'
      }
    }
  ];

  // Employee lifecycle data
  const lifecycleData = [
    { stage: 'Onboarding', count: 8, avgDays: 5, satisfaction: 4.1 },
    { stage: 'Probation', count: 15, avgDays: 87, satisfaction: 3.9 },
    { stage: 'Active', count: 209, avgDays: 845, satisfaction: 4.2 },
    { stage: 'Exit Process', count: 3, avgDays: 12, satisfaction: 3.7 }
  ];

  // Performance distribution
  const performanceDistribution = [
    { rating: 'Exceptional (5.0)', count: 24, percentage: '9.7%', color: 'bg-emerald-500' },
    { rating: 'Exceeds (4.0-4.9)', count: 89, percentage: '36.0%', color: 'bg-blue-500' },
    { rating: 'Meets (3.0-3.9)', count: 118, percentage: '47.8%', color: 'bg-yellow-500' },
    { rating: 'Below (2.0-2.9)', count: 14, percentage: '5.7%', color: 'bg-orange-500' },
    { rating: 'Poor (1.0-1.9)', count: 2, percentage: '0.8%', color: 'bg-red-500' }
  ];

  const handleGenerateReport = async (reportId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log('Generating HR report:', reportId);
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ArrowUpRight className="h-4 w-4 text-emerald-600" />
    ) : trend === 'down' ? (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    ) : null;
  };

  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR]}>
      <div className="space-y-6">
        <PageHeader
          title="HR Reports & Analytics"
          description="Comprehensive workforce analytics and human resources insights"
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

        {/* HR Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(hrMetrics).map(([key, metric]) => (
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

        <Tabs defaultValue="reports" className="space-y-6">
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
                    <Label htmlFor="department">Department</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
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

            {/* HR Report Categories Grid */}
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
                            <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
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

          <TabsContent value="departments" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>
                  Headcount, satisfaction scores, and turnover rates by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                            <p className="text-sm text-gray-500">{dept.employees} employees</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-8 text-center">
                          <div>
                            <p className="text-sm text-gray-500">Growth</p>
                            <p className="font-semibold text-emerald-600">{dept.change}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Satisfaction</p>
                            <div className="flex items-center justify-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <p className="font-semibold">{dept.satisfaction}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Turnover</p>
                            <p className="font-semibold text-gray-900">{dept.turnover}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Headcount by Department</CardTitle>
                  <CardDescription>Current employee distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Department distribution chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Satisfaction Scores</CardTitle>
                  <CardDescription>Employee satisfaction by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Satisfaction scores chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                  <CardDescription>Employee performance rating breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceDistribution.map((perf, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${perf.color}`}></div>
                          <span className="font-medium">{perf.rating}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">{perf.count} employees</span>
                          <Badge variant="outline">{perf.percentage}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Employee Lifecycle</CardTitle>
                  <CardDescription>Current employees by lifecycle stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lifecycleData.map((stage, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{stage.stage}</h4>
                          <Badge variant="outline">{stage.count} employees</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span>Avg Duration: {stage.avgDays} days</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 mr-1" />
                            <span>Satisfaction: {stage.satisfaction}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Performance rating trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Performance trend chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Goal Achievement</CardTitle>
                  <CardDescription>Employee goal completion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Goal achievement chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-sm text-gray-500">Engagement Score</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm text-gray-500">Survey Response</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">+45</p>
                  <p className="text-sm text-gray-500">NPS Score</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">4.2</p>
                  <p className="text-sm text-gray-500">Satisfaction Rating</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Engagement by Department</CardTitle>
                  <CardDescription>Department-wise engagement scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Engagement by department chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Engagement Drivers</CardTitle>
                  <CardDescription>Top factors affecting employee engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <span className="font-medium">Work-Life Balance</span>
                      <Badge className="bg-emerald-100 text-emerald-800">87%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Career Development</span>
                      <Badge className="bg-blue-100 text-blue-800">82%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Management Support</span>
                      <Badge className="bg-purple-100 text-purple-800">79%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Recognition</span>
                      <Badge className="bg-orange-100 text-orange-800">75%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Engagement Trends</CardTitle>
                  <CardDescription>Engagement score over the last 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Engagement trends chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Exit Interview Insights</CardTitle>
                  <CardDescription>Common reasons for employee departures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Better Opportunity</span>
                      <Badge className="bg-red-100 text-red-800">45%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Career Growth</span>
                      <Badge className="bg-yellow-100 text-yellow-800">23%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Compensation</span>
                      <Badge className="bg-orange-100 text-orange-800">18%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Other</span>
                      <Badge className="bg-gray-100 text-gray-800">14%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>AI-Powered HR Insights</CardTitle>
                  <CardDescription>
                    Machine learning insights and predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900">Attrition Risk Prediction</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        8 employees identified as high attrition risk. Immediate intervention recommended.
                      </p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-emerald-900">High Performer Identification</h4>
                      <p className="text-sm text-emerald-700 mt-1">
                        23 employees show high potential for leadership roles based on performance data.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900">Skill Gap Analysis</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Critical skill gaps identified in Data Science and Cloud Computing areas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Workforce Predictions</CardTitle>
                  <CardDescription>
                    6-month workforce planning forecasts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Predicted Headcount</p>
                        <p className="text-2xl font-bold text-gray-900">285</p>
                        <p className="text-sm text-emerald-600">+15.4% growth</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Hiring Needs</p>
                        <p className="text-2xl font-bold text-gray-900">42</p>
                        <p className="text-sm text-blue-600">Next 6 months</p>
                      </div>
                    </div>
                    <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <Target className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-500">Workforce prediction chart</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Diversity Metrics</CardTitle>
                  <CardDescription>Workforce diversity and inclusion tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Diversity metrics visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Compensation Analysis</CardTitle>
                  <CardDescription>Salary benchmarking and pay equity analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Compensation analysis chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}