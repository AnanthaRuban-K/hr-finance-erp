'use client';

import { useAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { Permission } from '@/types/auth';

export default function EmployeeDashboard() {
  const { user } = useAuth();

  const employeeStats = [
    { label: 'Leave Balance', value: '18 days', icon: Calendar },
    { label: 'Hours This Month', value: '152h', icon: Clock },
    { label: 'Current Salary', value: '$65,000', icon: DollarSign },
    { label: 'Performance Score', value: '4.2/5', icon: Award },
  ];

  const recentActivities = [
    { id: 1, type: 'Leave Request', description: 'Annual leave approved', date: '2024-01-15', status: 'approved' },
    { id: 2, type: 'Timesheet', description: 'Weekly timesheet submitted', date: '2024-01-12', status: 'completed' },
    { id: 3, type: 'Training', description: 'Security training completed', date: '2024-01-10', status: 'completed' },
    { id: 4, type: 'Performance', description: 'Q4 review scheduled', date: '2024-01-08', status: 'pending' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Complete Annual Security Training', dueDate: '2024-01-25', priority: 'high', progress: 60 },
    { id: 2, title: 'Submit Expense Report', dueDate: '2024-01-22', priority: 'medium', progress: 80 },
    { id: 3, title: 'Update Emergency Contact Info', dueDate: '2024-01-30', priority: 'low', progress: 0 },
  ];

  const goals = [
    { id: 1, title: 'Complete React Certification', progress: 75, target: '2024-02-15' },
    { id: 2, title: 'Improve Code Review Metrics', progress: 60, target: '2024-01-31' },
    { id: 3, title: 'Lead Team Presentation', progress: 30, target: '2024-02-28' },
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
      default: return <Badge className="border border-gray-300">{status}</Badge>;
    }
  };

  return (
    <RoleGuard requiredPermission={Permission.VIEW_OWN_DATA}>
      <div className="space-y-6">
        <PageHeader
          title={`Welcome, ${user?.firstName || 'Employee'}!`}
          description="Your personal dashboard and self-service portal"
        >
          <Button>
            <User className="mr-2 h-4 w-4" />
            Update Profile
          </Button>
        </PageHeader>

        {/* Employee Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {employeeStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.type} • {activity.date}</p>
                    </div>
                    {getStatusBadge(activity.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Tasks requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{task.title}</p>
                      <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals & Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Goals & Performance
            </CardTitle>
            <CardDescription>Track your professional development goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-3 p-4 border rounded-lg">
                  <h4 className="font-medium text-sm">{goal.title}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: {goal.target}</p>
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
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Request Leave</p>
                  <p className="text-xs text-muted-foreground">Apply for time off</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">View Payslips</p>
                  <p className="text-xs text-muted-foreground">Download pay stubs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="font-medium">Log Hours</p>
                  <p className="text-xs text-muted-foreground">Submit timesheet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Performance</p>
                  <p className="text-xs text-muted-foreground">View reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}