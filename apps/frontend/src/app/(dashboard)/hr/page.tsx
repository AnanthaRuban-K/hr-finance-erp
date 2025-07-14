"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserPlus,
  Clock,
  Calendar,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Plus
} from "lucide-react";
import Link from 'next/link';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onboardingInProgress: number;
  pendingLeaveRequests: number;
  upcomingReviews: number;
  attendanceToday: {
    present: number;
    absent: number;
    late: number;
  };
}

interface OnboardingProcess {
  id: string;
  employeeName: string;
  department: string;
  position: string;
  status: string;
  completionPercentage: number;
  startDate: string;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
}

export default function HRDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    onboardingInProgress: 0,
    pendingLeaveRequests: 0,
    upcomingReviews: 0,
    attendanceToday: { present: 0, absent: 0, late: 0 }
  });
  const [onboardingProcesses, setOnboardingProcesses] = useState<OnboardingProcess[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls - replace with actual API endpoints
      const mockStats: DashboardStats = {
        totalEmployees: 156,
        activeEmployees: 148,
        onboardingInProgress: 3,
        pendingLeaveRequests: 7,
        upcomingReviews: 12,
        attendanceToday: { present: 142, absent: 6, late: 4 }
      };

      const mockOnboarding: OnboardingProcess[] = [
        {
          id: '1',
          employeeName: 'Priya Sharma',
          department: 'IT',
          position: 'Software Engineer',
          status: 'in_progress',
          completionPercentage: 65,
          startDate: '2024-01-15'
        },
        {
          id: '2',
          employeeName: 'Rajesh Kumar',
          department: 'Marketing',
          position: 'Digital Marketing Specialist',
          status: 'in_progress',
          completionPercentage: 30,
          startDate: '2024-01-18'
        }
      ];

      const mockLeaves: LeaveRequest[] = [
        {
          id: '1',
          employeeName: 'Sarah Johnson',
          department: 'Finance',
          leaveType: 'Annual Leave',
          startDate: '2024-02-01',
          endDate: '2024-02-05',
          totalDays: 5,
          status: 'pending'
        },
        {
          id: '2',
          employeeName: 'Michael Chen',
          department: 'HR',
          leaveType: 'Sick Leave',
          startDate: '2024-01-25',
          endDate: '2024-01-26',
          totalDays: 2,
          status: 'pending'
        }
      ];

      setStats(mockStats);
      setOnboardingProcesses(mockOnboarding);
      setPendingLeaves(mockLeaves);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">HR Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/hr/employees/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeEmployees} active employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarding</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onboardingInProgress}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLeaveRequests}</div>
            <p className="text-xs text-muted-foreground">
              Pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceToday.present}</div>
            <p className="text-xs text-muted-foreground">
              {stats.attendanceToday.absent} absent, {stats.attendanceToday.late} late
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Onboarding Progress */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Active Onboarding Processes</CardTitle>
            <CardDescription>
              Track new employee onboarding progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {onboardingProcesses.map((process) => (
                <div key={process.id} className="flex items-center space-x-4 rounded-lg border p-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {process.employeeName}
                      </p>
                      <Badge variant="outline" className={getStatusColor(process.status)}>
                        {process.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {process.position} • {process.department}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Progress value={process.completionPercentage} className="flex-1" />
                      <span className="text-sm text-muted-foreground">
                        {process.completionPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/hr/onboarding/${process.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              {onboardingProcesses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No active onboarding processes
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pending Leave Requests</CardTitle>
            <CardDescription>
              Requests awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingLeaves.map((leave) => (
                <div key={leave.id} className="flex items-center space-x-4 rounded-lg border p-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {leave.employeeName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {leave.leaveType} • {leave.totalDays} days
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {leave.startDate} to {leave.endDate}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
              {pendingLeaves.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No pending leave requests
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common HR tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/hr/employees">
                <Users className="h-6 w-6 mb-2" />
                Employee Directory
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/hr/onboarding">
                <UserPlus className="h-6 w-6 mb-2" />
                Start Onboarding
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/hr/leave">
                <Calendar className="h-6 w-6 mb-2" />
                Leave Management
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/hr/performance">
                <Award className="h-6 w-6 mb-2" />
                Performance Reviews
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}