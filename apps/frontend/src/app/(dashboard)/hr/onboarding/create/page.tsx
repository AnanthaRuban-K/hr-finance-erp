"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Calendar, User } from "lucide-react";
import Link from 'next/link';

interface Employee {
  id: string;
  fullName: string;
  employeeId: string;
  department: string;
  position: string;
  email: string;
}

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.sbrosenterpriseerp.com/';
};

export default function CreateOnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedEmployeeId = searchParams.get('employeeId');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    employeeId: preSelectedEmployeeId || '',
    startDate: '',
    expectedCompletionDate: '',
    assignedBuddy: '',
    hrContact: '',
    notes: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = getApiUrl();
      const response = await fetch(`${API_BASE_URL}/employees?status=active&limit=100`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setEmployees(result.data.map((emp: any) => ({
          id: emp.id,
          fullName: emp.fullName,
          employeeId: emp.employeeId,
          department: emp.department,
          position: emp.position,
          email: emp.email,
        })));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.startDate || !formData.expectedCompletionDate || !formData.hrContact) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const API_BASE_URL = getApiUrl();
      const response = await fetch(`${API_BASE_URL}/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create onboarding process');
      }

      const result = await response.json();

      if (result.success) {
        router.push(`/hr/onboarding/${result.data.id}`);
      } else {
        setError(result.error || 'Failed to create onboarding process');
      }
    } catch (error) {
      console.error('Error creating onboarding process:', error);
      setError('Failed to create onboarding process');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculate expected completion date (2 weeks from start date)
  const calculateExpectedCompletion = (startDate: string) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const expected = new Date(start);
    expected.setDate(start.getDate() + 14); // 2 weeks
    return expected.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;
    setFormData(prev => ({
      ...prev,
      startDate,
      expectedCompletionDate: calculateExpectedCompletion(startDate),
    }));
  };

  const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);

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

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Start Employee Onboarding</h2>
        <p className="text-muted-foreground">
          Create a new onboarding process for an employee
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Onboarding Details</CardTitle>
          <CardDescription>
            Fill in the information to start the onboarding process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Selection */}
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee *</Label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                disabled={loading}
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName} ({employee.employeeId}) - {employee.position}
                  </option>
                ))}
              </select>
              {loading && (
                <p className="text-sm text-muted-foreground flex items-center">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Loading employees...
                </p>
              )}
            </div>

            {/* Selected Employee Info */}
            {selectedEmployee && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Selected Employee</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span> {selectedEmployee.fullName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span> {selectedEmployee.employeeId}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Department:</span> {selectedEmployee.department}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Position:</span> {selectedEmployee.position}
                  </div>
                </div>
              </div>
            )}

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleStartDateChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Expected Completion Date */}
            <div className="space-y-2">
              <Label htmlFor="expectedCompletionDate">Expected Completion Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="expectedCompletionDate"
                  name="expectedCompletionDate"
                  type="date"
                  value={formData.expectedCompletionDate}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Assigned Buddy */}
            <div className="space-y-2">
              <Label htmlFor="assignedBuddy">Assigned Buddy</Label>
              <select
                id="assignedBuddy"
                name="assignedBuddy"
                value={formData.assignedBuddy}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a buddy (optional)</option>
                {employees
                  .filter(emp => emp.id !== formData.employeeId)
                  .map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullName} - {employee.position}
                    </option>
                  ))}
              </select>
            </div>

            {/* HR Contact */}
            <div className="space-y-2">
              <Label htmlFor="hrContact">HR Contact *</Label>
              <select
                id="hrContact"
                name="hrContact"
                value={formData.hrContact}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select HR contact</option>
                {employees
                  .filter(emp => emp.department === 'hr')
                  .map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullName} - {employee.position}
                    </option>
                  ))}
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes or special instructions..."
                rows={3}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/15 text-destructive border border-destructive/20 rounded-md p-3">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/hr/onboarding">Cancel</Link>
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Start Onboarding'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}