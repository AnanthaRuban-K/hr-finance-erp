"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Building, 
  CreditCard,
  FileText,
  Clock,
  Award,
  Loader2
} from "lucide-react";
import Link from 'next/link';

interface EmployeeDetails {
  id: string;
  fullName: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: string;
  joinDate: string;
  [key: string]: any;
}

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.sbrosenterpriseerp.com/';
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const employeeId = params.id as string;

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = getApiUrl();
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`);
      
      if (!response.ok) {
        throw new Error('Employee not found');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setEmployee(result.employee);
      } else {
        setError(result.error || 'Failed to fetch employee');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      setError('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    
    if (key.toLowerCase().includes('date')) {
      try {
        return new Date(value).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch (e) {
        return String(value);
      }
    }
    
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading employee details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hr/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Employees
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Employee not found</h3>
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
          <Link href="/hr/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{employee.fullName}</h2>
          <p className="text-muted-foreground">
            {employee.position} • {employee.department.toUpperCase()} • {employee.employeeId}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={
            employee.status === 'active' ? 'default' :
            employee.status === 'inactive' ? 'secondary' : 'destructive'
          }>
            {employee.status.toUpperCase()}
          </Badge>
          <Button asChild>
            <Link href={`/hr/employees/${employee.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Mail className="h-8 w-8 text-muted-foreground mr-4" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{employee.email}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Phone className="h-8 w-8 text-muted-foreground mr-4" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{employee.phone}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Building className="h-8 w-8 text-muted-foreground mr-4" />
            <div>
              <p className="text-sm font-medium">Department</p>
              <p className="text-sm text-muted-foreground capitalize">{employee.department}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-muted-foreground mr-4" />
            <div>
              <p className="text-sm font-medium">Join Date</p>
              <p className="text-sm text-muted-foreground">{formatValue('joinDate', employee.joinDate)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'fullName', 'nricFinPassport', 'dateOfBirth', 'gender', 'nationality',
                  'maritalStatus', 'residentialStatus', 'race', 'religion'
                ].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-sm">{formatValue(field, employee[field])}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'email', 'phone', 'address', 'city', 'postalCode',
                  'emergencyContact', 'emergencyPhone'
                ].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-sm">
                      {field.includes('email') ? (
                        <a href={`mailto:${employee[field]}`} className="text-blue-600 hover:underline">
                          {formatValue(field, employee[field])}
                        </a>
                      ) : field.includes('phone') ? (
                        <a href={`tel:${employee[field]}`} className="text-blue-600 hover:underline">
                          {formatValue(field, employee[field])}
                        </a>
                      ) : (
                        formatValue(field, employee[field])
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'employeeId', 'department', 'position', 'joinDate',
                  'employmentType', 'reportingManager', 'status'
                ].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-sm capitalize">{formatValue(field, employee[field])}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {employee.skills || employee.certifications ? (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.skills && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Skills</label>
                    <p className="text-sm">{employee.skills}</p>
                  </div>
                )}
                {employee.certifications && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Certifications</label>
                    <p className="text-sm">{employee.certifications}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'basicSalary', 'paymentMode', 'bankName', 'accountNumber',
                  'cpfNumber', 'taxNumber'
                ].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-sm">
                      {field === 'basicSalary' ? `${formatValue(field, employee[field])}` : formatValue(field, employee[field])}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Employee documents and attachments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet</p>
                <p className="text-sm">Documents will appear here once uploaded</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" asChild>
          <Link href={`/hr/onboarding/create?employeeId=${employee.id}`}>
            <User className="mr-2 h-4 w-4" />
            Start Onboarding
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/hr/performance/create?employeeId=${employee.id}`}>
            <Award className="mr-2 h-4 w-4" />
            Performance Review
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/hr/leave/create?employeeId=${employee.id}`}>
            <Calendar className="mr-2 h-4 w-4" />
            Leave Request
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/hr/attendance?employeeId=${employee.id}`}>
            <Clock className="mr-2 h-4 w-4" />
            View Attendance
          </Link>
        </Button>
      </div>
    </div>
  );
}