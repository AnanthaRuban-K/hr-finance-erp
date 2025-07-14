"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar,
  FileText,
  MessageSquare,
  Loader2,
  Check,
  X,
  Play
} from "lucide-react";
import Link from 'next/link';

interface OnboardingStep {
  stepId: string;
  stepName: string;
  description: string;
  order: number;
  isRequired: boolean;
  estimatedDuration: number;
  category: string;
  progressId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: string;
  completedBy?: string;
  progressNotes?: string;
  documentsUploaded?: string;
}

interface OnboardingProcess {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  status: string;
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  assignedBuddy?: string;
  hrContact: string;
  notes?: string;
  completionPercentage: number;
  createdAt: string;
  steps: OnboardingStep[];
}

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.sbrosenterpriseerp.com/';
};

export default function OnboardingDetailPage() {
  const params = useParams();
  const [process, setProcess] = useState<OnboardingProcess | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const processId = params.id as string;

  useEffect(() => {
    if (processId) {
      fetchOnboardingProcess();
    }
  }, [processId]);

  const fetchOnboardingProcess = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = getApiUrl();
      const response = await fetch(`${API_BASE_URL}/onboarding/${processId}`);
      
      if (!response.ok) {
        throw new Error('Onboarding process not found');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setProcess(result.data);
      } else {
        setError(result.error || 'Failed to fetch onboarding process');
      }
    } catch (error) {
      console.error('Error fetching onboarding process:', error);
      setError('Failed to load onboarding process');
    } finally {
      setLoading(false);
    }
  };

  const updateStepStatus = async (stepId: string, status: string, notes?: string) => {
    try {
      setUpdating(stepId);
      const API_BASE_URL = getApiUrl();
      const response = await fetch(`${API_BASE_URL}/onboarding/${processId}/steps/${stepId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update step');
      }

      const result = await response.json();

      if (result.success) {
        // Refresh the process data
        await fetchOnboardingProcess();
      } else {
        setError(result.error || 'Failed to update step');
      }
    } catch (error) {
      console.error('Error updating step:', error);
      setError('Failed to update step');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'skipped': return <X className="h-5 w-5 text-gray-400" />;
      default: return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'documentation': 'bg-purple-100 text-purple-800',
      'technical': 'bg-blue-100 text-blue-800',
      'orientation': 'bg-green-100 text-green-800',
      'training': 'bg-orange-100 text-orange-800',
      'social': 'bg-pink-100 text-pink-800',
      'security': 'bg-red-100 text-red-800',
      'benefits': 'bg-indigo-100 text-indigo-800',
      'followup': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading onboarding process...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !process) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hr/onboarding">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Onboarding
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Process not found</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/hr/onboarding">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Onboarding
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Onboarding Progress</h2>
          <p className="text-muted-foreground">
            {process.employeeName} • {process.position} • {process.department.toUpperCase()}
          </p>
        </div>
        <Badge variant="outline" className={getStatusColor(process.status)}>
          {process.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <User className="h-8 w-8 text-muted-foreground mr-4" />
            <div>
              <p className="text-sm font-medium">Employee</p>
              <p className="text-sm text-muted-foreground">{process.employeeName}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-muted-foreground mr-4" />
            <div>
              <p className="text-sm font-medium">Start Date</p>
              <p className="text-sm text-muted-foreground">
                {new Date(process.startDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-muted-foreground mr-4" />
            <div>
              <p className="text-sm font-medium">Expected Completion</p>
              <p className="text-sm text-muted-foreground">
                {new Date(process.expectedCompletionDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground mr-4" />
            <div>
              <p className="text-sm font-medium">Progress</p>
              <p className="text-sm text-muted-foreground">{process.completionPercentage}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion</span>
              <span className="text-sm text-muted-foreground">{process.completionPercentage}%</span>
            </div>
            <Progress value={process.completionPercentage} className="h-3" />
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">
                  {process.steps.filter(s => s.status === 'pending').length}
                </div>
                <div className="text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {process.steps.filter(s => s.status === 'in_progress').length}
                </div>
                <div className="text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {process.steps.filter(s => s.status === 'completed').length}
                </div>
                <div className="text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-600">
                  {process.steps.filter(s => s.status === 'skipped').length}
                </div>
                <div className="text-muted-foreground">Skipped</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Steps</CardTitle>
          <CardDescription>
            Track and manage individual onboarding tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {process.steps.map((step, index) => (
              <div key={step.stepId} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                        {step.order}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{step.stepName}</h4>
                          {step.isRequired && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                          <Badge variant="outline" className={`text-xs ${getCategoryColor(step.category)}`}>
                            {step.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Est. Duration: {step.estimatedDuration} minutes</span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(step.status)}
                            <span className="capitalize">{step.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {step.progressNotes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-md">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm text-muted-foreground">{step.progressNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {step.completedAt && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Completed on {new Date(step.completedAt).toLocaleDateString()} at {new Date(step.completedAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {step.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateStepStatus(step.stepId, 'in_progress')}
                          disabled={updating === step.stepId}
                        >
                          {updating === step.stepId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Start
                            </>
                          )}
                        </Button>
                        {!step.isRequired && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStepStatus(step.stepId, 'skipped')}
                            disabled={updating === step.stepId}
                          >
                            Skip
                          </Button>
                        )}
                      </>
                    )}

                    {step.status === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => updateStepStatus(step.stepId, 'completed')}
                        disabled={updating === step.stepId}
                      >
                        {updating === step.stepId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Complete
                          </>
                        )}
                      </Button>
                    )}

                    {step.status === 'completed' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    )}

                    {step.status === 'skipped' && (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        <X className="mr-1 h-3 w-3" />
                        Skipped
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Process Notes */}
      {process.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Process Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{process.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/15 text-destructive border border-destructive/20 rounded-md p-4">
          {error}
        </div>
      )}
    </div>
  );
}