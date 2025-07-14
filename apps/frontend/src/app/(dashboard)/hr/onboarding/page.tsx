"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  User
} from "lucide-react";
import Link from 'next/link';

interface OnboardingProcess {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  completionPercentage: number;
  assignedBuddy?: string;
  hrContact: string;
  createdAt: string;
}

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.sbrosenterpriseerp.com/';
};

export default function OnboardingPage() {
  const [processes, setProcesses] = useState<OnboardingProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOnboardingProcesses();
  }, []);

  const fetchOnboardingProcesses = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = getApiUrl();
      const response = await fetch(`${API_BASE_URL}/onboarding`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch onboarding processes');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setProcesses(result.data);
      } else {
        setError(result.error || 'Failed to fetch onboarding processes');
      }
    } catch (error) {
      console.error('Error fetching onboarding processes:', error);
      setError('Failed to load onboarding processes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || process.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: processes.length,
    inProgress: processes.filter(p => p.status === 'in_progress').length,
    completed: processes.filter(p => p.status === 'completed').length,
    pending: processes.filter(p => p.status === 'pending').length,
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employee Onboarding</h2>
          <p className="text-muted-foreground">
            Manage and track new employee onboarding processes
          </p>
        </div>
        <Button asChild>
          <Link href="/hr/onboarding/create">
            <Plus className="mr-2 h-4 w-4" />
            Start Onboarding
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Processes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md text-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/15 text-destructive border border-destructive/20 rounded-md p-4">
          {error}
        </div>
      )}

      {/* Onboarding Processes */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading onboarding processes...</span>
            </div>
          </div>
        ) : filteredProcesses.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No onboarding processes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter ? 'Try adjusting your filters' : 'Start your first employee onboarding process'}
                </p>
                <Button asChild>
                  <Link href="/hr/onboarding/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Start Onboarding
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredProcesses.map((process) => (
            <Card key={process.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{process.employeeName}</h3>
                      <Badge variant="outline" className={getStatusColor(process.status)}>
                        {getStatusIcon(process.status)}
                        <span className="ml-1 capitalize">{process.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{process.position}</span>
                      <span>•</span>
                      <span className="capitalize">{process.department}</span>
                      <span>•</span>
                      <span>Started: {new Date(process.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{process.completionPercentage}%</span>
                        </div>
                        <Progress value={process.completionPercentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/hr/onboarding/${process.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}