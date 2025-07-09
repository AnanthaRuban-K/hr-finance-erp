'use client';

import { useAuth } from '@/components/clerk-wrapper';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClientOnly } from '@/components/client-only';
import { 
  Users, 
  Calendar, 
  Clock, 
  UserCheck,
  UserX,
  FileText,
  Award,
  TrendingUp,
  AlertCircle,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { Permission } from '@/types/auth';

function HRDashboardContent() {
  const { user } = useAuth();

  const hrStats = [
    { label: 'Total Employees', value: '247', icon: Users, trend: '+12 this month' },
    { label: 'Present Today', value: '231', icon: UserCheck, trend: '93.5% attendance' },
    { label: 'On Leave', value: '16', icon: Calendar, trend: '6.5% on leave' },
    { label: 'Pending Approvals', value: '8', icon: AlertCircle, trend: 'Requires action' },
  ];

  const recentActivities = [
    { id: 1, type: 'Leave Request', employee: 'John Smith', description: 'Annual leave for 5 days', date: '2024-01-15', status: 'pending', priority: 'medium' },
    { id: 2, type: 'New Hire', employee: 'Sarah Johnson', description: 'Software Engineer joining', date: '2024-01-14', status: 'approved', priority: 'high' },
    { id: 3, type: 'Performance Review', employee: 'Mike Davis', description: 'Q4 review completed', date: '2024-01-12', status: 'completed', priority: 'low' },
    { id: 4, type: 'Training Request', employee: 'Lisa Anderson', description: 'React certification course', date: '2024-01-10', status: 'approved', priority: 'medium' },
  ];

  const departmentMetrics = [
    { department: 'Engineering', total: 85, present: 82, absent: 3, onLeave: 0, performance: 92 },
    { department: 'Sales', total: 45, present: 43, absent: 1, onLeave: 1, performance: 88 },
    { department: 'Marketing', total: 28, present: 26, absent: 2, onLeave: 0, performance: 85 },
    { department: 'Finance', total: 22, present: 22, absent: 0, onLeave: 0, performance: 95 },
    { department: 'HR', total: 12, present: 11, absent: 0, onLeave: 1, performance: 90 },
  ];

  const upcomingEvents = [
    { id: 1, title: 'All Hands Meeting', date: '2024-01-18', time: '10:00 AM', attendees: 247 },
    { id: 2, title: 'New Employee Orientation', date: '2024-01-20', time: '9:00 AM', attendees: 5 },
    { id: 3, title: 'Performance Review Cycle', date: '2024-01-25', time: 'All Day', attendees: 50 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'completed': return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <RoleGuard requiredPermission={Permission.MANAGE_EMPLOYEES}>
      <div className="space-y-6">
        <PageHeader
          title={`Welcome, ${user?.firstName || 'HR Manager'}!`}
          description="Manage employees, track attendance, and oversee HR operations"
        >
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Employee
            </Button>
          </div>
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
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest HR activities requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">{activity.employee}</p>
                        <div className={`h-2 w-2 rounded-full ${getPriorityColor(activity.priority)}`} />
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.type} • {activity.date}</p>
                    </div>
                    {getStatusBadge(activity.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>HR events and meetings scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{event.title}</p>
                      <Badge variant="outline">{event.attendees} attendees</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.date} at {event.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Department Overview
            </CardTitle>
            <CardDescription>Attendance and performance metrics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentMetrics.map((dept) => (
                <div key={dept.department} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                  <div className="md:col-span-2">
                    <h4 className="font-medium">{dept.department}</h4>
                    <p className="text-sm text-muted-foreground">{dept.total} employees</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Present</span>
                    <span className="text-green-600 font-bold">{dept.present}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Absent</span>
                    <span className="text-red-600 font-bold">{dept.absent}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">On Leave</span>
                    <span className="text-yellow-600 font-bold">{dept.onLeave}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Performance</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={dept.performance} className="h-2 flex-1" />
                      <span className="text-sm font-bold">{dept.performance}%</span>
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
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Employee Directory</p>
                  <p className="text-xs text-muted-foreground">Manage employee records</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Leave Management</p>
                  <p className="text-xs text-muted-foreground">Approve leave requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Award className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="font-medium">Performance Reviews</p>
                  <p className="text-xs text-muted-foreground">Track evaluations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Reports</p>
                  <p className="text-xs text-muted-foreground">Generate HR reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}

export default function HRDashboard() {
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
      <HRDashboardContent />
    </ClientOnly>
  );
}