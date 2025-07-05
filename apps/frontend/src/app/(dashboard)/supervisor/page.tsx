'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Award,
  Target
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { Permission } from '@/types/auth';

export default function SupervisorDashboard() {
  const teamStats = [
    { label: 'Team Members', value: '12', icon: Users },
    { label: 'Attendance Rate', value: '96%', icon: Clock },
    { label: 'Pending Approvals', value: '5', icon: AlertCircle },
    { label: 'Team Performance', value: '4.3/5', icon: Award },
  ];

  const pendingApprovals = [
    {
      id: 1,
      employee: 'John Doe',
      type: 'Annual Leave',
      duration: '5 days',
      dates: 'Jan 22-26, 2024',
      reason: 'Family vacation',
      submitted: '2024-01-15'
    },
    {
      id: 2,
      employee: 'Jane Smith',
      type: 'Sick Leave',
      duration: '2 days',
      dates: 'Jan 18-19, 2024',
      reason: 'Medical appointment',
      submitted: '2024-01-16'
    },
    {
      id: 3,
      employee: 'Mike Johnson',
      type: 'Overtime',
      duration: '8 hours',
      dates: 'Jan 20, 2024',
      reason: 'Project deadline',
      submitted: '2024-01-17'
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Senior Developer',
      attendance: 98,
      performance: 4.5,
      projects: 3,
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Frontend Developer',
      attendance: 95,
      performance: 4.2,
      projects: 2,
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Backend Developer',
      attendance: 97,
      performance: 4.0,
      projects: 4,
      status: 'active'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      role: 'QA Engineer',
      attendance: 92,
      performance: 4.3,
      projects: 2,
      status: 'on_leave'
    },
  ];

  const upcomingReviews = [
    { id: 1, employee: 'John Doe', type: 'Quarterly Review', date: '2024-01-25' },
    { id: 2, employee: 'Jane Smith', type: 'Probation Review', date: '2024-01-28' },
    { id: 3, employee: 'Mike Johnson', type: 'Performance Review', date: '2024-02-01' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'on_leave': return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      case 'inactive': return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default: return <Badge className="outline">{status}</Badge>;
    }
  };

  return (
    <RoleGuard requiredPermission={Permission.APPROVE_LEAVES}>
      <div className="space-y-6">
        <PageHeader
          title="Supervisor Dashboard"
          description="Manage your team and approve requests"
        >
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Team Overview
          </Button>
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
                  <div key={approval.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{approval.employee}</p>
                        <p className="text-sm text-muted-foreground">{approval.type}</p>
                      </div>
                      <Badge className="outline">{approval.duration}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm"><span className="font-medium">Dates:</span> {approval.dates}</p>
                      <p className="text-sm"><span className="font-medium">Reason:</span> {approval.reason}</p>
                      <p className="text-xs text-muted-foreground">Submitted: {approval.submitted}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="px-3 py-1 text-sm border border-gray-300">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                      <Button className="px-3 py-1 text-sm border border-gray-300">
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Upcoming Reviews
              </CardTitle>
              <CardDescription>Scheduled performance evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingReviews.map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{review.employee}</p>
                      <p className="text-xs text-muted-foreground">{review.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{review.date}</p>
                      <Button className="px-3 py-1 text-sm border border-gray-300">
  Schedule
</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>Performance metrics and status of your team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{member.attendance}%</p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{member.performance}/5</p>
                      <p className="text-xs text-muted-foreground">Performance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{member.projects}</p>
                      <p className="text-xs text-muted-foreground">Projects</p>
                    </div>
                    {getStatusBadge(member.status)}
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
                  <p className="font-medium">Team Management</p>
                  <p className="text-xs text-muted-foreground">View detailed team analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Goal Setting</p>
                  <p className="text-xs text-muted-foreground">Set and track team goals</p>
                </div>
                </div>
            </CardContent>
          </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <Award className="h-8 w-8 text-purple-500" />
                    <div>
                    <p className="font-medium">Performance Reviews</p>
                    <p className="text-xs text-muted-foreground">Manage team performance evaluations</p>
                    </div>
                </div>
                </CardContent>
            </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="font-medium">Attendance Tracking</p>
                  <p className="text-xs text-muted-foreground">Monitor team attendance</p>
                </div>
              </div>
            </CardContent>
            </Card>

        </div>
      </div>
    </RoleGuard>
  );
}