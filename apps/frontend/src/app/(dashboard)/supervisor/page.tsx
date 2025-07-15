'use client';

import { useAuth } from '@/hooks/use-auth';
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
  Award,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  Plus,
  Filter
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { Permission } from '@/types/auth';

function SupervisorDashboardContent() {
  const { user } = useAuth();

  const teamStats = [
    { label: 'Team Members', value: '12', icon: Users, trend: '+1 this month' },
    { label: 'Present Today', value: '11', icon: UserCheck, trend: '91.7% attendance' },
    { label: 'Pending Reviews', value: '3', icon: Award, trend: 'Due this week' },
    { label: 'Leave Requests', value: '2', icon: Calendar, trend: 'Awaiting approval' },
  ];

  const teamMembers = [
    { 
      id: 1, 
      name: 'Alice Johnson', 
      position: 'Senior Developer', 
      status: 'present', 
      performance: 92, 
      lastActive: '10:30 AM',
      currentTask: 'API Integration'
    },
    { 
      id: 2, 
      name: 'Bob Smith', 
      position: 'Frontend Developer', 
      status: 'present', 
      performance: 88, 
      lastActive: '11:15 AM',
      currentTask: 'UI Components'
    },
    { 
      id: 3, 
      name: 'Carol Davis', 
      position: 'QA Engineer', 
      status: 'absent', 
      performance: 95, 
      lastActive: 'Yesterday',
      currentTask: 'Testing Suite'
    },
    { 
      id: 4, 
      name: 'David Wilson', 
      position: 'Backend Developer', 
      status: 'present', 
      performance: 90, 
      lastActive: '9:45 AM',
      currentTask: 'Database Optimization'
    },
    { 
      id: 5, 
      name: 'Emma Brown', 
      position: 'DevOps Engineer', 
      status: 'on-leave', 
      performance: 87, 
      lastActive: '2 days ago',
      currentTask: 'CI/CD Pipeline'
    },
  ];

  const pendingTasks = [
    { id: 1, type: 'Performance Review', employee: 'Alice Johnson', dueDate: '2024-01-18', priority: 'high' },
    { id: 2, type: 'Leave Approval', employee: 'Bob Smith', dueDate: '2024-01-16', priority: 'medium' },
    { id: 3, type: 'Goal Setting', employee: 'David Wilson', dueDate: '2024-01-20', priority: 'medium' },
    { id: 4, type: 'Training Plan', employee: 'Emma Brown', dueDate: '2024-01-25', priority: 'low' },
  ];

  const teamProjects = [
    { id: 1, name: 'Customer Portal V2', progress: 75, status: 'on-track', assignees: 4, deadline: '2024-02-15' },
    { id: 2, name: 'Mobile App Integration', progress: 45, status: 'behind', assignees: 3, deadline: '2024-01-30' },
    { id: 3, name: 'Performance Optimization', progress: 90, status: 'ahead', assignees: 2, deadline: '2024-02-01' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600';
      case 'absent': return 'text-red-600';
      case 'on-leave': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent': return <UserX className="h-4 w-4 text-red-500" />;
      case 'on-leave': return <Calendar className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track': return <Badge className="bg-blue-100 text-blue-800">On Track</Badge>;
      case 'behind': return <Badge className="bg-red-100 text-red-800">Behind</Badge>;
      case 'ahead': return <Badge className="bg-green-100 text-green-800">Ahead</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <RoleGuard requiredPermission={Permission.MANAGE_TEAM_PERFORMANCE}>
      <div className="space-y-6">
        <PageHeader
          title={`Welcome, ${user?.firstName || 'Supervisor'}!`}
          description="Manage your team, track performance, and approve requests"
        >
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </PageHeader>

        {/* Team Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {teamStats.map((stat) => (
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
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>Current status and performance of your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(member.status)}
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.position}</p>
                        <p className="text-xs text-muted-foreground">Current: {member.currentTask}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getStatusColor(member.status)}`}>
                        {member.status.replace('-', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">Performance: {member.performance}%</p>
                      <p className="text-xs text-muted-foreground">Last: {member.lastActive}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
              <CardDescription>Tasks and approvals awaiting your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <div key={task.id} className={`border-l-4 pl-3 py-2 ${getPriorityColor(task.priority)}`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{task.type}</p>
                        <p className="text-xs text-muted-foreground">Employee: {task.employee}</p>
                        <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                      </div>
                      <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Team Projects
            </CardTitle>
            <CardDescription>Current project status and progress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamProjects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {project.assignees} team members • Deadline: {project.deadline}
                      </p>
                    </div>
                    {getProjectStatusBadge(project.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
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
                <Award className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Performance Reviews</p>
                  <p className="text-xs text-muted-foreground">Conduct team reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Leave Approvals</p>
                  <p className="text-xs text-muted-foreground">Review requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Target className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="font-medium">Goal Setting</p>
                  <p className="text-xs text-muted-foreground">Set team objectives</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Team Reports</p>
                  <p className="text-xs text-muted-foreground">Generate reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}

export default function SupervisorDashboard() {
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
      <SupervisorDashboardContent />
    </ClientOnly>
  );
}