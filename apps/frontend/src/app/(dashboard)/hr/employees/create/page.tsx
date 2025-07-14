"use client";

import EmployeeForm from '@/components/EmployeeForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateEmployeePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/hr/employees');
  };

  const handleClose = () => {
    router.push('/hr/employees');
  };

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

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New Employee</h2>
        <p className="text-muted-foreground">
          Fill in the employee information to create a new employee record
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <EmployeeForm 
            onClose={handleClose}
            onSuccess={handleSuccess}
            isEdit={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}