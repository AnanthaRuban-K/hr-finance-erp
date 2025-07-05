'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  Clock, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { Permission } from '@/types/auth';

export default function HRDashboard() {
  const hrStats = [
    { label: 'Total Employees', value: '1,234', change: '+12', icon: Users },
    { label: 'New Hires (Month)', value: '45', change: '+8', icon: UserPlus },
    { label: 'Attendance Rate', value: '94.5%', change: '+2.1%', icon: Clock },
    { label: 'Avg Salary', value: '$65,000', change: '+5%', icon: DollarSign },
  ];

  const pendingApprovals = [
    { id: 1, type: 'Leave Request', employee: 'John Doe', department: 'Engineering', date: '2024-01-15', duration: '3 days' },
    { id: 2, type: 'Overtime', employee: 'Jane Smith', department: 'Marketing', date: '2024-01-14', duration: '8 hours' },
    { id: 3, type: 'Leave Request', employee: 'Mike Johnson', department: 'Sales', date: '2024-01-13', duration: '1 day' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'New Employee Orientation', date: '2024-01-20', attendees: 5 },
    { id: 2, title: 'Performance Review Training', date: '2024-01-25', attendees: 12 },
    { id: 3, title: 'Company All Hands', date: '2024-01-30', attendees: 150 },
  ];

  const departmentStats = [
    { name: 'Engineering', employees: 45, growth: 12, satisfaction: 92 },
    { name: 'Sales', employees: 32, growth: 8, satisfaction: 88 },
    { name: 'Marketing', employees: 18, growth: 5, satisfaction: 94 },
    { name: 'Support', employees: 25, growth: 3, satisfaction: 90 },
  ];

  return (
    <RoleGuard requiredPermission={Permission.MANAGE_EMPLOYEES}>
      <div className="space-y-6">
        <PageHeader
          title="HR Dashboard"
          description="Human Resources management and analytics"
        >
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </PageHeader>

        {/* HR Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {hrStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                Pending Approvals
              </CardTitle>
              <CardDescription>Requests awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{approval.employee}</p>
                      <p className="text-xs text-muted-foreground">{approval.department}</p>
                      <Badge className="outline">{approval.type}</Badge>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm">{approval.duration}</p>
                      <p className="text-xs text-muted-foreground">{approval.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Scheduled HR events and training</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge>{event.attendees} attendees</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Employee distribution and satisfaction metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{dept.name}</h4>
                    <Badge className="outline">{dept.employees} employees</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Growth Rate</span>
                      <span className="text-green-600">+{dept.growth}%</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Satisfaction</span>
                        <span>{dept.satisfaction}%</span>
                      </div>
                      <Progress value={dept.satisfaction} className="h-2" />
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
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Employee Directory</p>
                  <p className="text-xs text-muted-foreground">View and manage employees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Award className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Performance Reviews</p>
                  <p className="text-xs text-muted-foreground">Manage performance evaluations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">HR Analytics</p>
                  <p className="text-xs text-muted-foreground">View detailed HR metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}