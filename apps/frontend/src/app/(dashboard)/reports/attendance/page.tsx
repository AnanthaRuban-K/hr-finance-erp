'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Clock,
  Calendar as CalendarIcon,
  Users,
  UserCheck,
  UserX,
  MapPin,
  Timer,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  StopCircle,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Eye,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Building,
  Home,
  Coffee,
  Moon,
  Sun,
  Activity,
  Target,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Mail,
  Phone,
  Zap,
  Shield,
  Camera,
  Fingerprint,
  Smartphone,
  X,
  Check,
  FileText,
  CalendarDays,
  ClockIcon,
  Users2,
  UserPlus,
  UserMinus,
  ChevronDown,
  MoreHorizontal,
  AlertTriangle,
 
  FileSpreadsheet,
  PrinterIcon,
  Share2,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Calendar as Cal,
  MapPinIcon,
  WifiIcon,
  WifiOffIcon
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole, Permission } from '@/types/auth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Types
interface AttendanceMetrics {
  totalPresent: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
  totalAbsent: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
  attendanceRate: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
  lateArrivals: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
  earlyDepartures: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
  onBreak: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
}

interface Employee {
  id: number;
  name: string;
  avatar: string;
  department: string;
  status: 'checked-in' | 'checked-out' | 'on-break' | 'work-from-home' | 'late' | 'absent';
  checkInTime: string;
  checkOutTime?: string;
  location: string;
  workingHours: string;
  lastActivity: string;
  photo?: string;
  employeeId: string;
  shift: string;
  overtime: string;
  breaks: { start: string; end?: string }[];
}

interface Department {
  department: string;
  total: number;
  present: number;
  absent: number;
  rate: string;
  avgCheckIn: string;
  trend: 'up' | 'down' | 'stable';
  onTime: number;
  late: number;
  workFromHome: number;
}

interface LeaveRequest {
  id: number;
  employee: string;
  employeeId: string;
  department: string;
  type: 'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Emergency Leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

interface Activity {
  id: number;
  type: 'check-in' | 'check-out' | 'break-start' | 'break-end' | 'late-arrival' | 'early-departure';
  employee: string;
  employeeId: string;
  time: string;
  location: string;
  method: 'Biometric' | 'Mobile App' | 'Web Portal' | 'Card Swipe' | 'Manual Entry';
  timestamp: string;
  deviceInfo?: string;
  ipAddress?: string;
}

export default function AttendanceMainPage() {
  // States
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Dialog states
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showShiftManagement, setShowShiftManagement] = useState(false);
  const [showReportGeneration, setShowReportGeneration] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Real-time attendance metrics
  const attendanceMetrics: AttendanceMetrics = {
    totalPresent: { value: '241', change: '+3', trend: 'up' },
    totalAbsent: { value: '6', change: '-2', trend: 'down' },
    attendanceRate: { value: '97.6%', change: '+1.2%', trend: 'up' },
    lateArrivals: { value: '12', change: '-5', trend: 'down' },
    earlyDepartures: { value: '3', change: '-1', trend: 'down' },
    onBreak: { value: '18', change: '+2', trend: 'up' }
  };

  // Today's attendance summary
  const todaysSummary = {
    totalEmployees: 247,
    present: 241,
    absent: 6,
    late: 12,
    onTime: 229,
    workFromHome: 67,
    onSite: 174,
    avgCheckInTime: '8:47 AM',
    peakHour: '9:15 AM',
    productivityScore: 94,
    complianceRate: '98.2%'
  };

  // Real-time employee status
  const [employeeStatus, setEmployeeStatus] = useState<Employee[]>([
    {
      id: 1,
      name: 'John Smith',
      avatar: 'JS',
      employeeId: 'EMP001',
      department: 'Engineering',
      status: 'checked-in',
      checkInTime: '8:30 AM',
      location: 'Office - Floor 3',
      workingHours: '7h 45m',
      lastActivity: '2 mins ago',
      shift: 'Day Shift (9AM-6PM)',
      overtime: '1h 15m',
      breaks: [{ start: '12:00 PM', end: '1:00 PM' }, { start: '3:30 PM' }]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      employeeId: 'EMP002',
      department: 'Sales',
      status: 'on-break',
      checkInTime: '8:45 AM',
      location: 'Office - Cafeteria',
      workingHours: '6h 30m',
      lastActivity: '15 mins ago',
      shift: 'Day Shift (9AM-6PM)',
      overtime: '0h',
      breaks: [{ start: '12:15 PM', end: '1:15 PM' }, { start: '3:45 PM' }]
    },
    {
      id: 3,
      name: 'Mike Davis',
      avatar: 'MD',
      employeeId: 'EMP003',
      department: 'Marketing',
      status: 'work-from-home',
      checkInTime: '9:00 AM',
      location: 'Remote - Home Office',
      workingHours: '6h 15m',
      lastActivity: '5 mins ago',
      shift: 'Flexible (8AM-5PM)',
      overtime: '0h',
      breaks: [{ start: '1:00 PM', end: '2:00 PM' }]
    },
    {
      id: 4,
      name: 'Lisa Chen',
      avatar: 'LC',
      employeeId: 'EMP004',
      department: 'Finance',
      status: 'checked-in',
      checkInTime: '8:15 AM',
      location: 'Office - Floor 2',
      workingHours: '8h 00m',
      lastActivity: '1 min ago',
      shift: 'Day Shift (9AM-6PM)',
      overtime: '2h 00m',
      breaks: [{ start: '11:45 AM', end: '12:45 PM' }]
    },
    {
      id: 5,
      name: 'Robert Garcia',
      avatar: 'RG',
      employeeId: 'EMP005',
      department: 'Operations',
      status: 'late',
      checkInTime: '9:30 AM',
      location: 'Office - Floor 1',
      workingHours: '5h 45m',
      lastActivity: '30 mins ago',
      shift: 'Day Shift (9AM-6PM)',
      overtime: '0h',
      breaks: []
    },
    {
      id: 6,
      name: 'Emily Wilson',
      avatar: 'EW',
      employeeId: 'EMP006',
      department: 'HR',
      status: 'absent',
      checkInTime: '-',
      location: '-',
      workingHours: '-',
      lastActivity: 'Yesterday',
      shift: 'Day Shift (9AM-6PM)',
      overtime: '0h',
      breaks: []
    }
  ]);

  // Department attendance breakdown
  const departmentAttendance: Department[] = [
    {
      department: 'Engineering',
      total: 85,
      present: 82,
      absent: 3,
      rate: '96.5%',
      avgCheckIn: '8:35 AM',
      trend: 'up',
      onTime: 79,
      late: 3,
      workFromHome: 25
    },
    {
      department: 'Sales',
      total: 45,
      present: 43,
      absent: 2,
      rate: '95.6%',
      avgCheckIn: '8:42 AM',
      trend: 'stable',
      onTime: 40,
      late: 3,
      workFromHome: 12
    },
    {
      department: 'Marketing',
      total: 28,
      present: 27,
      absent: 1,
      rate: '96.4%',
      avgCheckIn: '8:38 AM',
      trend: 'up',
      onTime: 25,
      late: 2,
      workFromHome: 8
    },
    {
      department: 'Finance',
      total: 22,
      present: 22,
      absent: 0,
      rate: '100%',
      avgCheckIn: '8:30 AM',
      trend: 'up',
      onTime: 22,
      late: 0,
      workFromHome: 5
    },
    {
      department: 'Operations',
      total: 35,
      present: 34,
      absent: 1,
      rate: '97.1%',
      avgCheckIn: '8:45 AM',
      trend: 'stable',
      onTime: 31,
      late: 3,
      workFromHome: 8
    },
    {
      department: 'HR',
      total: 12,
      present: 12,
      absent: 0,
      rate: '100%',
      avgCheckIn: '8:25 AM',
      trend: 'up',
      onTime: 12,
      late: 0,
      workFromHome: 4
    },
    {
      department: 'Customer Support',
      total: 20,
      present: 19,
      absent: 1,
      rate: '95.0%',
      avgCheckIn: '8:50 AM',
      trend: 'down',
      onTime: 17,
      late: 2,
      workFromHome: 5
    }
  ];

  // Leave requests pending approval
  const leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      employee: 'Alex Thompson',
      employeeId: 'EMP007',
      department: 'Engineering',
      type: 'Annual Leave',
      startDate: '2025-04-10',
      endDate: '2025-04-12',
      days: 3,
      reason: 'Family vacation',
      status: 'pending',
      submittedDate: '2025-03-28'
    },
    {
      id: 2,
      employee: 'Maria Rodriguez',
      employeeId: 'EMP008',
      department: 'Sales',
      type: 'Sick Leave',
      startDate: '2025-04-05',
      endDate: '2025-04-05',
      days: 1,
      reason: 'Medical appointment',
      status: 'pending',
      submittedDate: '2025-03-29'
    },
    {
      id: 3,
      employee: 'David Kim',
      employeeId: 'EMP009',
      department: 'Marketing',
      type: 'Casual Leave',
      startDate: '2025-04-08',
      endDate: '2025-04-08',
      days: 1,
      reason: 'Personal work',
      status: 'pending',
      submittedDate: '2025-03-30'
    }
  ];

  // Recent attendance activities
  const recentActivities: Activity[] = [
    {
      id: 1,
      type: 'check-in',
      employee: 'John Smith',
      employeeId: 'EMP001',
      time: '8:30 AM',
      location: 'Main Office - Floor 3',
      method: 'Biometric',
      timestamp: '2 mins ago',
      deviceInfo: 'Terminal #3',
      ipAddress: '192.168.1.23'
    },
    {
      id: 2,
      type: 'break-start',
      employee: 'Sarah Johnson',
      employeeId: 'EMP002',
      time: '3:00 PM',
      location: 'Cafeteria',
      method: 'Mobile App',
      timestamp: '15 mins ago',
      deviceInfo: 'iPhone 14',
      ipAddress: '192.168.1.45'
    },
    {
      id: 3,
      type: 'check-out',
      employee: 'Mike Davis',
      employeeId: 'EMP003',
      time: '5:30 PM',
      location: 'Remote',
      method: 'Web Portal',
      timestamp: '1 hour ago',
      deviceInfo: 'MacBook Pro',
      ipAddress: '203.122.45.67'
    },
    {
      id: 4,
      type: 'late-arrival',
      employee: 'Robert Garcia',
      employeeId: 'EMP005',
      time: '9:30 AM',
      location: 'Main Office - Floor 1',
      method: 'Card Swipe',
      timestamp: '6 hours ago',
      deviceInfo: 'Card Reader #1',
      ipAddress: '192.168.1.12'
    }
  ];

  // Quick actions configuration
  const quickActions = [
    {
      title: 'Mark Attendance',
      description: 'Manual attendance entry',
      icon: UserCheck,
      color: 'bg-emerald-500',
      action: 'mark-attendance',
      permission: Permission.MANAGE_EMPLOYEES
    },
    {
      title: 'Approve Leave',
      description: 'Process leave requests',
      icon: CheckCircle,
      color: 'bg-blue-500',
      action: 'approve-leave',
      permission: Permission.APPROVE_LEAVES
    },
    {
      title: 'Generate Report',
      description: 'Create attendance reports',
      icon: BarChart3,
      color: 'bg-purple-500',
      action: 'generate-report',
      permission: Permission.VIEW_ALL_ATTENDANCE
    },
    {
      title: 'Shift Management',
      description: 'Manage work shifts',
      icon: Clock,
      color: 'bg-orange-500',
      action: 'shift-management',
      permission: Permission.MANAGE_EMPLOYEES
    },
    {
      title: 'Time Tracking',
      description: 'Monitor work hours',
      icon: Timer,
      color: 'bg-cyan-500',
      action: 'time-tracking',
      permission: Permission.VIEW_TEAM_ATTENDANCE
    },
    {
      title: 'Bulk Import',
      description: 'Import attendance data',
      icon: Upload,
      color: 'bg-pink-500',
      action: 'bulk-import',
      permission: Permission.MANAGE_EMPLOYEES
    }
  ];

  // Effects
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLiveTracking) {
        setLastUpdated(new Date());
        setRefreshKey(prev => prev + 1);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isLiveTracking]);

  // Filter employees based on search and filters
  const filteredEmployees = employeeStatus.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'mark-attendance':
        setShowMarkAttendance(true);
        break;
      case 'approve-leave':
        // Navigate to leave approvals
        break;
      case 'generate-report':
        setShowReportGeneration(true);
        break;
      case 'shift-management':
        setShowShiftManagement(true);
        break;
      case 'time-tracking':
        // Navigate to time tracking
        break;
      case 'bulk-import':
        setShowBulkImport(true);
        break;
      default:
        console.log(`Quick action: ${action}`);
    }
  };

  const handleLeaveApproval = (id: number, action: 'approve' | 'reject', comments?: string) => {
    console.log(`${action} leave request ID: ${id}`, { comments });
    // Implement leave approval logic
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
    setRefreshKey(prev => prev + 1);
  };

  const handleExportData = (format: 'csv' | 'excel' | 'pdf') => {
    console.log(`Exporting data in ${format} format`);
    // Implement export logic
  };

  // Utility functions
  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ArrowUpRight className="h-4 w-4 text-emerald-600" />
    ) : trend === 'down' ? (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    ) : null;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'checked-in': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'checked-out': 'bg-gray-100 text-gray-800 border-gray-200',
      'on-break': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'work-from-home': 'bg-blue-100 text-blue-800 border-blue-200',
      'late': 'bg-orange-100 text-orange-800 border-orange-200',
      'absent': 'bg-red-100 text-red-800 border-red-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checked-in':
        return <UserCheck className="h-4 w-4" />;
      case 'checked-out':
        return <StopCircle className="h-4 w-4" />;
      case 'on-break':
        return <Coffee className="h-4 w-4" />;
      case 'work-from-home':
        return <Home className="h-4 w-4" />;
      case 'late':
        return <Clock className="h-4 w-4" />;
      case 'absent':
        return <UserX className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'check-in':
        return <UserCheck className="h-4 w-4 text-emerald-600" />;
      case 'check-out':
        return <StopCircle className="h-4 w-4 text-gray-600" />;
      case 'break-start':
        return <Coffee className="h-4 w-4 text-yellow-600" />;
      case 'break-end':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'late-arrival':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'early-departure':
        return <Timer className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatActivityType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.SUPERVISOR]}>
      <div className="space-y-6">
        <PageHeader
          title="Attendance Management"
          description="Real-time attendance tracking, leave management, and workforce monitoring"
        >
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <FilterIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid gap-2">
                  <Button variant="ghost" onClick={() => handleExportData('csv')} className="justify-start">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button variant="ghost" onClick={() => handleExportData('excel')} className="justify-start">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as Excel
                  </Button>
                  <Button variant="ghost" onClick={() => handleExportData('pdf')} className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <RoleGuard requiredPermission={Permission.MANAGE_EMPLOYEES}>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowMarkAttendance(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </RoleGuard>
          </div>
        </PageHeader>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {format(selectedDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departmentAttendance.map(dept => (
                        <SelectItem key={dept.department} value={dept.department}>
                          {dept.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="checked-in">Checked In</SelectItem>
                      <SelectItem value="checked-out">Checked Out</SelectItem>
                      <SelectItem value="on-break">On Break</SelectItem>
                      <SelectItem value="work-from-home">Work From Home</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>View Mode</Label>
                  <Select value={viewMode} onValueChange={setViewMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Tracking Status */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500 rounded-full">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Real-time Tracking</h3>
                  <p className="text-gray-600">Live attendance monitoring is active</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last updated</p>
                  <p className="font-medium">{lastUpdated.toLocaleTimeString()}</p>
                </div>
                <Switch checked={isLiveTracking} onCheckedChange={setIsLiveTracking} />
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(attendanceMetrics).map(([key, metric]) => (
            <Card key={key} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
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

        {/* Today's Summary */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Today's Attendance Summary</CardTitle>
                <CardDescription>
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  {todaysSummary.complianceRate} Compliance
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {todaysSummary.productivityScore}% Productivity
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="text-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                <UserCheck className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-emerald-900">{todaysSummary.present}</p>
                <p className="text-sm text-emerald-600">Present</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <UserX className="h-6 w-6 text-red-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-900">{todaysSummary.absent}</p>
                <p className="text-sm text-red-600">Absent</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-orange-900">{todaysSummary.late}</p>
                <p className="text-sm text-orange-600">Late</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-900">{todaysSummary.onTime}</p>
                <p className="text-sm text-blue-600">On Time</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Home className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-purple-900">{todaysSummary.workFromHome}</p>
                <p className="text-sm text-purple-600">Remote</p>
              </div>
              <div className="text-center p-3 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                <Building className="h-6 w-6 text-cyan-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-cyan-900">{todaysSummary.onSite}</p>
                <p className="text-sm text-cyan-600">On-site</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Timer className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{todaysSummary.avgCheckInTime}</p>
                <p className="text-sm text-gray-600">Avg Check-in</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <TrendingUp className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-indigo-900">{todaysSummary.peakHour}</p>
                <p className="text-sm text-indigo-600">Peak Hour</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="live-tracking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="live-tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="leave-management">Leave Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="live-tracking" className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used attendance operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <RoleGuard key={index} requiredPermission={action.permission} fallback={null}>
                        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 group hover:scale-105">
                          <CardContent className="p-4">
                            <div 
                              className="flex items-center space-x-3"
                              onClick={() => handleQuickAction(action.action)}
                            >
                              <div className={`p-3 ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {action.title}
                                </h4>
                                <p className="text-sm text-gray-600">{action.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </RoleGuard>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Employee Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Real-time Employee Status</CardTitle>
                    <CardDescription>Live employee attendance tracking ({filteredEmployees.length} employees)</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {employee.avatar}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                              <span className="text-sm text-gray-500">({employee.employeeId})</span>
                            </div>
                            <p className="text-sm text-gray-600">{employee.department} • {employee.shift}</p>
                          </div>
                          <Badge className={getStatusColor(employee.status)}>
                            {getStatusIcon(employee.status)}
                            <span className="ml-1 capitalize">{employee.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-5 gap-6 text-center text-sm">
                          <div>
                            <p className="text-gray-500">Check-in</p>
                            <p className="font-semibold">{employee.checkInTime}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <div className="flex items-center justify-center space-x-1">
                              <MapPinIcon className="h-3 w-3 text-gray-400" />
                              <p className="font-semibold text-xs">{employee.location}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500">Working Hours</p>
                            <p className="font-semibold">{employee.workingHours}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Overtime</p>
                            <p className="font-semibold text-orange-600">{employee.overtime}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Last Activity</p>
                            <p className="text-xs text-gray-600">{employee.lastActivity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedEmployee(employee)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <RoleGuard requiredPermission={Permission.MANAGE_EMPLOYEES}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </RoleGuard>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest attendance events and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.employee} ({activity.employeeId}) - {formatActivityType(activity.type)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.time} • {activity.location} • via {activity.method}
                          </p>
                          {activity.deviceInfo && (
                            <p className="text-xs text-gray-500">
                              Device: {activity.deviceInfo} • IP: {activity.ipAddress}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.timestamp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Department-wise Attendance</CardTitle>
                <CardDescription>
                  Attendance overview and performance by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentAttendance.map((dept, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Building className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                            <p className="text-sm text-gray-500">{dept.total} employees</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-7 gap-6 text-center">
                          <div>
                            <p className="text-sm text-gray-500">Present</p>
                            <p className="font-semibold text-emerald-600">{dept.present}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Absent</p>
                            <p className="font-semibold text-red-600">{dept.absent}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">On Time</p>
                            <p className="font-semibold text-blue-600">{dept.onTime}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Late</p>
                            <p className="font-semibold text-orange-600">{dept.late}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Remote</p>
                            <p className="font-semibold text-purple-600">{dept.workFromHome}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Rate</p>
                            <p className="font-semibold text-blue-600">{dept.rate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Avg Check-in</p>
                            <p className="font-semibold text-gray-900">{dept.avgCheckIn}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(dept.trend)}
                          <Progress value={parseFloat(dept.rate)} className="w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave-management" className="space-y-6">
            <RoleGuard requiredPermission={Permission.APPROVE_LEAVES}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Pending Leave Requests</CardTitle>
                  <CardDescription>
                    Review and approve employee leave applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaveRequests.map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {request.employee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{request.employee}</h4>
                              <p className="text-sm text-gray-600">{request.department} • {request.employeeId}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-5 gap-6 text-center text-sm">
                            <div>
                              <p className="text-gray-500">Type</p>
                              <Badge variant="outline">{request.type}</Badge>
                            </div>
                            <div>
                              <p className="text-gray-500">Duration</p>
                              <p className="font-semibold">{request.days} day{request.days > 1 ? 's' : ''}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">From</p>
                              <p className="font-semibold">{format(new Date(request.startDate), 'MMM d')}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">To</p>
                              <p className="font-semibold">{format(new Date(request.endDate), 'MMM d')}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Submitted</p>
                              <p className="text-xs text-gray-600">{format(new Date(request.submittedDate), 'MMM d')}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Leave Request Details</DialogTitle>
                                  <DialogDescription>
                                    Review and approve/reject this leave request
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500">Employee</p>
                                      <p className="font-semibold">{request.employee}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Department</p>
                                      <p className="font-semibold">{request.department}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Leave Type</p>
                                      <p className="font-semibold">{request.type}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Duration</p>
                                      <p className="font-semibold">{request.days} days</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-sm">Reason</p>
                                    <p className="text-gray-900">{request.reason}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Comments (Optional)</Label>
                                    <Textarea placeholder="Add your comments..." />
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                      onClick={() => handleLeaveApproval(request.id, 'approve')}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      className="flex-1"
                                      onClick={() => handleLeaveApproval(request.id, 'reject')}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </RoleGuard>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <RoleGuard requiredPermission={Permission.VIEW_ALL_ATTENDANCE}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Attendance Reports</CardTitle>
                  <CardDescription>
                    Generate comprehensive attendance and workforce analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-blue-500 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Daily Attendance</h4>
                            <p className="text-sm text-gray-600">Day-wise attendance tracking</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-emerald-500 rounded-lg">
                            <PieChart className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Department Summary</h4>
                            <p className="text-sm text-gray-600">Department-wise analytics</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-purple-500 rounded-lg">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Time Analysis</h4>
                            <p className="text-sm text-gray-600">Working hours breakdown</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-orange-500 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Trends & Patterns</h4>
                            <p className="text-sm text-gray-600">Attendance trend analysis</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-red-500 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Compliance Report</h4>
                            <p className="text-sm text-gray-600">Policy adherence tracking</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-cyan-500 rounded-lg">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Custom Report</h4>
                            <p className="text-sm text-gray-600">Build your own reports</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </RoleGuard>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER]}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Attendance Settings</CardTitle>
                  <CardDescription>
                    Configure attendance tracking and policy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Working Hours</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Start Time</Label>
                          <Input type="time" className="w-32" defaultValue="09:00" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>End Time</Label>
                          <Input type="time" className="w-32" defaultValue="18:00" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Break Duration (minutes)</Label>
                          <Input type="number" className="w-32" defaultValue="60" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Attendance Policies</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Late Arrival Grace (minutes)</Label>
                          <Input type="number" className="w-32" defaultValue="15" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Auto Clock-out (hours)</Label>
                          <Input type="number" className="w-32" defaultValue="10" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Overtime Threshold (hours)</Label>
                          <Input type="number" className="w-32" defaultValue="8" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Notifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Late Arrival Alerts</Label>
                          <p className="text-sm text-gray-500">Notify supervisors of late arrivals</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Absence Notifications</Label>
                          <p className="text-sm text-gray-500">Send daily absence reports</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Overtime Alerts</Label>
                          <p className="text-sm text-gray-500">Notify when overtime exceeds limits</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Weekly Reports</Label>
                          <p className="text-sm text-gray-500">Send weekly attendance summaries</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Integration Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Biometric Integration</Label>
                          <p className="text-sm text-gray-500">Connect with biometric devices</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <WifiIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Connected</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Mobile App Sync</Label>
                          <p className="text-sm text-gray-500">Sync with mobile attendance app</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <WifiIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Active</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Card Reader Integration</Label>
                          <p className="text-sm text-gray-500">RFID/Card based attendance</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <WifiOffIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Disconnected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-6 border-t">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </RoleGuard>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        
        {/* Mark Attendance Dialog */}
        <Dialog open={showMarkAttendance} onOpenChange={setShowMarkAttendance}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
              <DialogDescription>
                Manually record employee attendance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeStatus.map(emp => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.name} ({emp.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="check-in">Check In</SelectItem>
                      <SelectItem value="check-out">Check Out</SelectItem>
                      <SelectItem value="break-start">Start Break</SelectItem>
                      <SelectItem value="break-end">End Break</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" defaultValue={new Date().toTimeString().slice(0, 5)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Enter location" />
              </div>
              <div className="space-y-2">
                <Label>Reason (Optional)</Label>
                <Textarea placeholder="Add reason for manual entry..." />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowMarkAttendance(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Record Attendance
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Import Dialog */}
        <Dialog open={showBulkImport} onOpenChange={setShowBulkImport}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Bulk Import Attendance</DialogTitle>
              <DialogDescription>
                Import attendance data from CSV or Excel file
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Drop your file here or <span className="text-blue-600 cursor-pointer">browse</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
              <div className="space-y-2">
                <Label>Import Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="overwrite" />
                    <Label htmlFor="overwrite" className="text-sm">
                      Overwrite existing records
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="validate" defaultChecked />
                    <Label htmlFor="validate" className="text-sm">
                      Validate data before import
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify" defaultChecked />
                    <Label htmlFor="notify" className="text-sm">
                      Send notification on completion
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowBulkImport(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Import Data
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Employee Details Dialog */}
        {selectedEmployee && (
          <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Employee Details - {selectedEmployee.name}</DialogTitle>
                <DialogDescription>
                  Complete attendance and activity information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Employee ID:</span>
                          <span className="font-medium">{selectedEmployee.employeeId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Department:</span>
                          <span className="font-medium">{selectedEmployee.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Shift:</span>
                          <span className="font-medium">{selectedEmployee.shift}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <Badge className={getStatusColor(selectedEmployee.status)}>
                            {selectedEmployee.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Today's Activity</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Check-in:</span>
                          <span className="font-medium">{selectedEmployee.checkInTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Working Hours:</span>
                          <span className="font-medium">{selectedEmployee.workingHours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Overtime:</span>
                          <span className="font-medium text-orange-600">{selectedEmployee.overtime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Location:</span>
                          <span className="font-medium">{selectedEmployee.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Break History</h4>
                      <div className="space-y-2">
                        {selectedEmployee.breaks.map((breakTime, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-500">Break {index + 1}:</span>
                            <span className="font-medium">
                              {breakTime.start} {breakTime.end ? `- ${breakTime.end}` : '(Ongoing)'}
                            </span>
                          </div>
                        ))}
                        {selectedEmployee.breaks.length === 0 && (
                          <p className="text-sm text-gray-500">No breaks taken today</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Status
                        </Button>
                        <Button variant="outline" size="sm">
                          <Clock className="h-4 w-4 mr-1" />
                          Time Log
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Send Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Recent Activity Timeline</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {recentActivities
                      .filter(activity => activity.employee === selectedEmployee.name)
                      .map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3 text-sm">
                          <div className="p-1 bg-gray-100 rounded">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{formatActivityType(activity.type)}</span>
                            <span className="text-gray-500 ml-2">{activity.time}</span>
                          </div>
                          <span className="text-xs text-gray-400">{activity.timestamp}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </RoleGuard>
  );
}