'use client';

import { useAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Calendar, 
  Clock, 
  FileText,
  Award,
  Target,
  TrendingUp,
  Bell,
  Settings,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  MapPin,
  BookOpen,
  Star,
  Briefcase,
  Zap,
  Gift,
  ChevronRight,
  Activity,
  CreditCard,
  CheckSquare,
  MoreHorizontal,
  ExternalLink,
  Timer,
  Home
} from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/types/auth';
import { format, startOfWeek, endOfWeek, isToday, isTomorrow } from 'date-fns';
import { useState, useEffect } from 'react';

// Types
interface EmployeeStats {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: string; direction: 'up' | 'down' | 'stable' };
  color: string;
  bgColor: string;
  description: string;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  status: 'approved' | 'completed' | 'pending' | 'rejected';
  priority?: 'high' | 'medium' | 'low';
  category: string;
  actionable?: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  category: string;
  estimatedHours?: number;
  assignedBy?: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: string;
  category: 'skill' | 'performance' | 'project' | 'certification';
  mentor?: string;
  resources?: string[];
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
  badge?: string;
}

// Helper functions
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-emerald-500';
    default: return 'bg-gray-500';
  }
};

const getPriorityTextColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-emerald-600';
    default: return 'text-gray-600';
  }
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    approved: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
    completed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const IconComponent = config.icon;
  
  return (
    <Badge className={`${config.color} border`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const getCategoryIcon = (category: string) => {
  const icons = {
    'time-off': Calendar,
    'learning': BookOpen,
    'review': Award,
    'payroll': CreditCard,
    'project': Briefcase,
    'profile': User,
    'administrative': CheckSquare,
    'certification': Star,
    'skill': Target,
    'performance': TrendingUp
  };
  return icons[category as keyof typeof icons] || Activity;
};

const getTrendIcon = (direction: string) => {
  switch (direction) {
    case 'up': return <ArrowUpRight className="w-4 h-4 text-emerald-600" />;
    case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    default: return null;
  }
};

const formatDueDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
};

const getTaskUrgency = (dueDate: string, priority: string) => {
  const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 1 && priority === 'high') return 'urgent';
  if (days <= 3 && priority === 'high') return 'soon';
  return 'normal';
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState<any>(null);

  // Mock data - in real app, this would come from API
  const employeeStats: EmployeeStats[] = [
    { 
      label: 'Leave Balance', 
      value: '18 days', 
      icon: Calendar, 
      trend: { value: '+2', direction: 'up' },
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Annual leave remaining'
    },
    { 
      label: 'This Month', 
      value: '168h', 
      icon: Clock, 
      trend: { value: '4h ahead', direction: 'up' },
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Hours worked vs expected 164h'
    },
    { 
      label: 'Performance', 
      value: '4.6/5.0', 
      icon: Award, 
      trend: { value: '+0.2', direction: 'up' },
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Latest review score'
    },
    { 
      label: 'Tasks Complete', 
      value: '87%', 
      icon: CheckCircle, 
      trend: { value: '+5%', direction: 'up' },
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'This quarter completion rate'
    },
  ];

  const recentActivities: Activity[] = [
    { 
      id: 1, 
      type: 'Leave Request', 
      title: 'Annual Leave Approved',
      description: 'March 15-19, 2024 vacation request', 
      date: '2024-01-15', 
      status: 'approved',
      category: 'time-off',
      actionable: false
    },
    { 
      id: 2, 
      type: 'Training', 
      title: 'Security Certification Complete',
      description: 'Cybersecurity awareness training finished', 
      date: '2024-01-12', 
      status: 'completed',
      category: 'learning'
    },
    { 
      id: 3, 
      type: 'Performance', 
      title: 'Q1 Review Scheduled',
      description: 'Meeting with Sarah Johnson on Jan 25', 
      date: '2024-01-10', 
      status: 'pending',
      category: 'review',
      priority: 'high',
      actionable: true
    },
    { 
      id: 4, 
      type: 'Payroll', 
      title: 'December Payslip Available',
      description: 'Download your December salary statement', 
      date: '2024-01-08', 
      status: 'completed',
      category: 'payroll',
      actionable: true
    },
    { 
      id: 5, 
      type: 'Project', 
      title: 'Website Redesign Milestone',
      description: 'Phase 1 deliverables completed', 
      date: '2024-01-05', 
      status: 'completed',
      category: 'project'
    }
  ];

  const upcomingTasks: Task[] = [
    { 
      id: 1, 
      title: 'Complete React Certification Exam', 
      description: 'Final assessment for React development course',
      dueDate: '2024-01-25', 
      priority: 'high', 
      progress: 75,
      category: 'learning',
      estimatedHours: 4,
      assignedBy: 'Learning & Development'
    },
    { 
      id: 2, 
      title: 'Submit Q4 Expense Report', 
      description: 'Upload receipts and complete expense claims',
      dueDate: '2024-01-22', 
      priority: 'medium', 
      progress: 60,
      category: 'administrative',
      estimatedHours: 1
    },
    { 
      id: 3, 
      title: 'Update Emergency Contact Information', 
      description: 'Review and update personal emergency contacts',
      dueDate: '2024-01-30', 
      priority: 'low', 
      progress: 0,
      category: 'profile',
      estimatedHours: 0.5
    },
    { 
      id: 4, 
      title: 'Team Presentation Preparation', 
      description: 'Prepare slides for monthly team showcase',
      dueDate: '2024-02-01', 
      priority: 'high', 
      progress: 30,
      category: 'project',
      estimatedHours: 6,
      assignedBy: 'Project Manager'
    }
  ];

  const goals: Goal[] = [
    { 
      id: 1, 
      title: 'Complete React Native Certification', 
      description: 'Advance mobile development skills',
      progress: 75, 
      target: '2024-02-15',
      category: 'certification',
      mentor: 'John Smith',
      resources: ['Official React Native Docs', 'Udemy Course', 'Practice Projects']
    },
    { 
      id: 2, 
      title: 'Improve Code Review Quality Score', 
      description: 'Enhance technical review skills',
      progress: 60, 
      target: '2024-01-31',
      category: 'skill',
      mentor: 'Sarah Johnson'
    },
    { 
      id: 3, 
      title: 'Lead Cross-Functional Project', 
      description: 'Take ownership of a multi-team initiative',
      progress: 30, 
      target: '2024-03-15',
      category: 'performance',
      mentor: 'Mike Chen'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      title: 'Request Time Off',
      description: 'Apply for vacation or sick leave',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/employee/leave/request',
      badge: '18 days left'
    },
    {
      title: 'View Payslips',
      description: 'Download salary statements',
      icon: FileText,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      href: '/employee/payslips',
      badge: 'New'
    },
    {
      title: 'Clock In/Out',
      description: 'Record your working hours',
      icon: Clock,
      color: 'bg-orange-500 hover:bg-orange-600',
      href: '/employee/timesheet',
      badge: undefined
    },
    {
      title: 'Submit Expenses',
      description: 'Upload expense claims',
      icon: CreditCard,
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/employee/expenses',
      badge: '3 pending'
    },
    {
      title: 'Performance Review',
      description: 'View goals and feedback',
      icon: TrendingUp,
      color: 'bg-cyan-500 hover:bg-cyan-600',
      href: '/employee/performance',
      badge: undefined
    },
    {
      title: 'Learning Center',
      description: 'Access training materials',
      icon: BookOpen,
      color: 'bg-pink-500 hover:bg-pink-600',
      href: '/employee/learning',
      badge: '2 new courses'
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={[UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.HR_MANAGER, UserRole.ADMIN]}>
      <div className="space-y-8">
        {/* Enhanced Header with User Info */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20 border-4 border-white/20 shadow-lg">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="bg-white/10 text-xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.firstName || 'Employee'}! 👋
                  </h1>
                  <p className="text-blue-100 text-lg mb-1">
                    Software Developer • Engineering
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-blue-100">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      San Francisco, CA
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {format(new Date(), 'EEEE, MMMM d')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {employeeStats.map((stat, index) => (
            <Card key={stat.label} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {stat.trend && (
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(stat.trend.direction)}
                      <span className={`text-sm font-medium ${
                        stat.trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {stat.trend.value}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600 mt-1">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-white">Tasks & Goals</TabsTrigger>
            <TabsTrigger value="time" className="data-[state=active]:bg-white">Time & Attendance</TabsTrigger>
            <TabsTrigger value="development" className="data-[state=active]:bg-white">Development</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions Grid */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Frequently used employee services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {quickActions.map((action, index) => (
                    <Card key={index} className="group cursor-pointer border-2 border-transparent hover:border-blue-200 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                        {action.badge && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {action.badge}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities & Notifications */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-500" />
                      Recent Activities
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </div>
                  <CardDescription>Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.slice(0, 5).map((activity) => {
                      const IconComponent = getCategoryIcon(activity.category);
                      return (
                        <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <IconComponent className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                              {getStatusBadge(activity.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">{format(new Date(activity.date), 'MMM d, yyyy')}</p>
                              {activity.actionable && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Action
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Important Notifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-500" />
                    Important Notifications
                  </CardTitle>
                  <CardDescription>Items requiring your attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      <strong>Action Required:</strong> Complete your annual security training by January 25, 2024.
                      <Button variant="link" className="p-0 h-auto text-amber-600 font-medium ml-2">
                        Start Training →
                      </Button>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-blue-200 bg-blue-50">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Reminder:</strong> Your Q1 performance review is scheduled for January 25 with Sarah Johnson.
                      <Button variant="link" className="p-0 h-auto text-blue-600 font-medium ml-2">
                        View Details →
                      </Button>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-emerald-200 bg-emerald-50">
                    <Gift className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800">
                      <strong>New Benefit:</strong> Health & wellness reimbursement program now available.
                      <Button variant="link" className="p-0 h-auto text-emerald-600 font-medium ml-2">
                        Learn More →
                      </Button>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upcoming Tasks */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <CheckSquare className="w-5 h-5 mr-2 text-green-500" />
                      Upcoming Tasks
                    </CardTitle>
                    <Badge variant="outline">{upcomingTasks.length} active</Badge>
                  </div>
                  <CardDescription>Tasks requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => {
                      const urgency = getTaskUrgency(task.dueDate, task.priority);
                      return (
                        <div key={task.id} className={`p-4 rounded-lg border-2 ${
                          urgency === 'urgent' ? 'border-red-200 bg-red-50' :
                          urgency === 'soon' ? 'border-yellow-200 bg-yellow-50' :
                          'border-gray-200 bg-white hover:bg-gray-50'
                        } transition-colors`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-sm text-gray-900">{task.title}</h4>
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Due: {formatDueDate(task.dueDate)}
                                </span>
                                {task.estimatedHours && (
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {task.estimatedHours}h
                                  </span>
                                )}
                                {task.assignedBy && (
                                  <span className="flex items-center">
                                    <User className="w-3 h-3 mr-1" />
                                    {task.assignedBy}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className={getPriorityTextColor(task.priority)}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </span>
                              <span className="text-gray-600">{task.progress}% Complete</span>
                            </div>
                            <Progress value={task.progress} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Goals & Performance */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-purple-500" />
                      Development Goals
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Goal
                    </Button>
                  </div>
                  <CardDescription>Track your professional development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goals.map((goal) => (
                      <div key={goal.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-sm text-gray-900">{goal.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {goal.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Target: {format(new Date(goal.target), 'MMM d')}
                              </span>
                              {goal.mentor && (
                                <span className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  Mentor: {goal.mentor}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-gray-900 font-medium">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                          {goal.resources && goal.resources.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {goal.resources.slice(0, 2).map((resource, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {resource}
                                </Badge>
                              ))}
                              {goal.resources.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{goal.resources.length - 2} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="time" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Time Tracking Summary */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Time Summary
                  </CardTitle>
                  <CardDescription>This week's overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Today</span>
                    <span className="font-semibold">8h 15m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This Week</span>
                    <span className="font-semibold">36h 30m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Target</span>
                    <span className="font-semibold text-green-600">168h / 160h</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Weekly Progress</span>
                      <span>91% (36.5h / 40h)</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Status */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Attendance
                  </CardTitle>
                  <CardDescription>Current status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-semibold text-green-800">Checked In</p>
                      <p className="text-sm text-green-600">Since 9:15 AM</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Check-in Time</span>
                      <span className="font-medium">9:15 AM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Office - Floor 3
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Break Time</span>
                      <span className="font-medium">45 minutes</span>
                    </div>
                  </div>
                  <Button className="w-full bg-red-500 hover:bg-red-600">
                    <Timer className="w-4 h-4 mr-2" />
                    Clock Out
                  </Button>
                </CardContent>
              </Card>

              {/* Leave Balance */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                    Leave Balance
                  </CardTitle>
                  <CardDescription>Available time off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Annual Leave</span>
                      <span className="font-semibold">18 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sick Leave</span>
                      <span className="font-semibold">5 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Personal Days</span>
                      <span className="font-semibold">3 days</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">26</p>
                    <p className="text-sm text-gray-600">Total days available</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Request Leave
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Schedule */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                  This Week's Schedule
                </CardTitle>
                <CardDescription>
                  {format(startOfWeek(new Date()), 'MMM d')} - {format(endOfWeek(new Date()), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const isCurrentDay = index === new Date().getDay() - 1;
                    const isWeekend = index >= 5;
                    return (
                      <div key={day} className={`p-3 text-center rounded-lg ${
                        isCurrentDay ? 'bg-blue-100 border-2 border-blue-300' :
                        isWeekend ? 'bg-gray-100 text-gray-500' :
                        'bg-gray-50 hover:bg-gray-100'
                      } transition-colors`}>
                        <p className="text-xs font-medium mb-1">{day}</p>
                        <p className="text-lg font-bold">{new Date().getDate() + index - new Date().getDay() + 1}</p>
                        {!isWeekend && (
                          <div className="mt-2 space-y-1">
                            <div className="w-full h-1 bg-green-200 rounded">
                              <div className="h-full bg-green-500 rounded" style={{ width: isCurrentDay ? '60%' : '100%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600">
                              {isCurrentDay ? '6h 15m' : '8h'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Learning Progress */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                      Learning Progress
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Learning Hub
                    </Button>
                  </div>
                  <CardDescription>Your skill development journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-900">React Native Certification</h4>
                      <Badge className="bg-blue-100 text-blue-800">75% Complete</Badge>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">Master mobile app development with React Native</p>
                    <Progress value={75} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-blue-600">
                      <span>8 of 12 modules completed</span>
                      <span>Target: Feb 15</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { course: 'TypeScript Advanced Features', progress: 60, category: 'Programming' },
                      { course: 'AWS Cloud Practitioner', progress: 40, category: 'Cloud' },
                      { course: 'Team Leadership Fundamentals', progress: 30, category: 'Soft Skills' }
                    ].map((course, idx) => (
                      <div key={idx} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{course.course}</h5>
                          <Badge variant="outline" className="text-xs">{course.category}</Badge>
                        </div>
                        <div className="space-y-1">
                          <Progress value={course.progress} className="h-1.5" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{course.progress}% complete</span>
                            <span>In Progress</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    Performance Insights
                  </CardTitle>
                  <CardDescription>Your professional growth metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-yellow-700">4.6</p>
                      <p className="text-xs text-yellow-600">Performance Score</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-green-700">+12%</p>
                      <p className="text-xs text-green-600">Improvement</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technical Skills</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Communication</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={90} className="w-20 h-2" />
                        <span className="text-sm font-medium">90%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Leadership</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-20 h-2" />
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Project Management</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={80} className="w-20 h-2" />
                        <span className="text-sm font-medium">80%</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Recent Achievements</h5>
                    <div className="space-y-2">
                      {[
                        { title: 'Code Quality Champion', date: 'Jan 10', type: 'Technical' },
                        { title: 'Team Collaboration Award', date: 'Dec 15', type: 'Teamwork' },
                        { title: 'Innovation Contributor', date: 'Nov 20', type: 'Innovation' }
                      ].map((achievement, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium">{achievement.title}</p>
                            <p className="text-xs text-gray-500">{achievement.date}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{achievement.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skill Development Roadmap */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-red-500" />
                  Skill Development Roadmap
                </CardTitle>
                <CardDescription>Your personalized learning path for career growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {[
                      {
                        title: 'Complete React Native Certification',
                        description: 'Master mobile development fundamentals',
                        status: 'in-progress',
                        progress: 75,
                        timeline: 'Feb 2024',
                        priority: 'high'
                      },
                      {
                        title: 'AWS Cloud Practitioner Exam',
                        description: 'Learn cloud computing basics and AWS services',
                        status: 'next',
                        progress: 0,
                        timeline: 'Mar 2024',
                        priority: 'medium'
                      },
                      {
                        title: 'Team Leadership Workshop',
                        description: 'Develop leadership and management skills',
                        status: 'planned',
                        progress: 0,
                        timeline: 'Apr 2024',
                        priority: 'medium'
                      },
                      {
                        title: 'Advanced System Design',
                        description: 'Learn scalable architecture patterns',
                        status: 'future',
                        progress: 0,
                        timeline: 'Q3 2024',
                        priority: 'low'
                      }
                    ].map((skill, idx) => (
                      <div key={idx} className="relative flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          skill.status === 'in-progress' ? 'bg-blue-100 border-blue-500' :
                          skill.status === 'next' ? 'bg-yellow-100 border-yellow-500' :
                          skill.status === 'planned' ? 'bg-gray-100 border-gray-300' :
                          'bg-gray-50 border-gray-200'
                        }`}>
                          {skill.status === 'in-progress' ? (
                            <Clock className="w-4 h-4 text-blue-600" />
                          ) : skill.status === 'next' ? (
                            <Target className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <div className={`w-3 h-3 rounded-full ${
                              skill.status === 'planned' ? 'bg-gray-400' : 'bg-gray-300'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{skill.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={
                                skill.priority === 'high' ? 'border-red-300 text-red-700' :
                                skill.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                'border-gray-300 text-gray-700'
                              }>
                                {skill.priority}
                              </Badge>
                              <span className="text-sm text-gray-500">{skill.timeline}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                          {skill.progress > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Progress</span>
                                <span>{skill.progress}%</span>
                              </div>
                              <Progress value={skill.progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}