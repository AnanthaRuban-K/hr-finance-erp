"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  RefreshCw, 
  Edit, 
  Trash2, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  TrendingUp,
  Building2,
  ChevronDown,
  Info,
  User,
  Calculator,
  Loader2,
 } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

// Utility function for formatting currency
const formatCurrency = (amount: number | string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(parseFloat(amount.toString()) || 0);
};

// Types
interface Payroll {
  id: string;
  employeeId: string;
  month: string;
  baseSalary: string | number;
  bonus?: string | number;
  deductions?: string | number;
  netPay: string | number;
  isPaid: boolean;
  payDate?: string;
}

interface Employee {
  id: string;
  employeeId: string;
  fullName?: string;
  full_name?: string;
  name?: string;
  department?: string;
  position?: string;
  designation?: string;
  job_title?: string;
  basicSalary?: string | number;
  basic_salary?: string | number;
  salary?: string | number;
  monthlySalary?: string | number;
  monthly_salary?: string | number;
  joinDate?: string;
  join_date?: string;
}

interface PayrollFormData {
  employeeId: string;
  month: string;
  baseSalary: string;
  bonus: string;
  deductions: string;
}

interface SalarySlipData {
  employeeId: string;
  month: string;
  year: string;
  workingDays: number;
  presentDays: number;
  
  // Earnings
  basicSalary: number;
  hra: number;
  allowances: number;
  overtime: number;
  bonus: number;
  
  // Deductions
  providentFund: number;
  tax: number;
  insurance: number;
  loan: number;
  otherDeductions: number;
}

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  description?: string;
  trend?: boolean;
}

interface PayrollCardProps {
  payroll: Payroll;
  employee?: Employee;
  onEdit: (payroll: Payroll) => void;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
}

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

interface PayrollFormProps {
  payroll?: Payroll | null;
  employees: Employee[];
  onSubmit: (data: PayrollFormData) => void;
  onCancel: () => void;
}

// Stats Card Component
const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, description, trend }) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          {trend && <TrendingUp className="h-3 w-3" />}
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

// Enhanced Payroll Card Component
const PayrollCard: React.FC<PayrollCardProps> = ({ payroll, employee, onEdit, onDelete, onMarkPaid }) => (
  <Card className="group hover:shadow-md transition-all duration-200">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            {employee ? (
              <div>
                <div className="font-semibold">{employee.fullName || employee.full_name || employee.name}</div>
                <div className="text-sm text-gray-500 font-normal">ID: {payroll.employeeId}</div>
                {employee.department && (
                  <div className="text-xs text-gray-400 font-normal">{employee.department} • {employee.position || employee.designation || employee.job_title}</div>
                )}
              </div>
            ) : (
              `Employee ${payroll.employeeId}`
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Payroll ID: {payroll.id?.slice(0, 8)}...</p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">
          <Calendar className="h-3 w-3 mr-1" />
          {payroll.month}
        </Badge>
      </div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {/* Financial Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Base Salary</p>
          <p className="text-sm font-semibold">{formatCurrency(payroll.baseSalary)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bonus</p>
          <p className="text-sm font-semibold text-green-600">{formatCurrency(payroll.bonus || 0)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Deductions</p>
          <p className="text-sm font-semibold text-red-600">-{formatCurrency(payroll.deductions || 0)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Net Pay</p>
          <p className="text-lg font-bold text-blue-600">{formatCurrency(payroll.netPay)}</p>
        </div>
      </div>

      <Separator />

      {/* Status and Actions */}
      <div className="flex items-center justify-between">
        <Badge variant={payroll.isPaid ? "default" : "secondary"} className={
          payroll.isPaid 
            ? "bg-green-100 text-green-800 hover:bg-green-200" 
            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        }>
          {payroll.isPaid ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
          {payroll.isPaid ? 'Paid' : 'Pending'}
        </Badge>
        
        {payroll.payDate && (
          <p className="text-xs text-muted-foreground">
            Paid: {new Date(payroll.payDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(payroll)}
          className="flex-1"
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        {!payroll.isPaid && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onMarkPaid(payroll.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Mark Paid
          </Button>
        )}
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(payroll.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Notification Component
const Notification: React.FC<NotificationProps> = ({ message, type }) => (
  <Alert className={`fixed top-4 right-4 w-96 z-50 ${
    type === 'error' 
      ? 'border-red-500 bg-red-50 text-red-900' 
      : 'border-green-500 bg-green-50 text-green-900'
  }`}>
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

// Integrated Salary Slip Form Component
const SalarySlipForm: React.FC<{
  employees: Employee[];
  onSubmit: (data: SalarySlipData) => void;
  onCancel: () => void;
}> = ({ employees, onSubmit, onCancel }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState<SalarySlipData>({
    employeeId: "",
    month: "",
    year: new Date().getFullYear().toString(),
    workingDays: 22,
    presentDays: 22,
    
    // Earnings
    basicSalary: 0,
    hra: 0,
    allowances: 0,
    overtime: 0,
    bonus: 0,
    
    // Deductions
    providentFund: 0,
    tax: 0,
    insurance: 0,
    loan: 0,
    otherDeductions: 0,
  });

  // Get current month and year
  const currentDate = new Date();
const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
const currentYear = currentDate.getFullYear();

console.log(`Current month: ${currentMonth}, Current year: ${currentYear}`);

  // Helper functions to get employee data with fallbacks
  const getEmployeeName = (employee: Employee): string => {
    return employee.fullName || employee.full_name || employee.name || 'Unknown';
  };

  const getEmployeePosition = (employee: Employee): string => {
    return employee.position || employee.job_title || employee.designation || 'Unknown';
  };

  const getEmployeeSalary = (employee: Employee): number => {
    const salary = employee.basicSalary || employee.basic_salary || employee.salary || employee.monthlySalary || employee.monthly_salary;
    if (typeof salary === 'string') {
      return parseFloat(salary) || 0;
    }
    return salary || 0;
  };

  // Auto-calculate HRA, PF, and Tax based on basic salary
  useEffect(() => {
    if (formData.basicSalary > 0) {
      const calculatedHRA = Math.round(formData.basicSalary * 0.4); // 40% of basic
      const calculatedPF = Math.round(formData.basicSalary * 0.12); // 12% of basic
      const calculatedTax = Math.round(formData.basicSalary * 0.1); // 10% of basic
      
      setFormData(prev => ({
        ...prev,
        hra: calculatedHRA,
        providentFund: calculatedPF,
        tax: calculatedTax
      }));
    }
  }, [formData.basicSalary]);

  // Calculate pro-rated salary based on attendance
  const calculateProRatedSalary = (amount: number) => {
    if (formData.workingDays === 0) return amount;
    return Math.round((amount * formData.presentDays) / formData.workingDays);
  };

  // Calculate totals
  const totalEarnings = calculateProRatedSalary(formData.basicSalary) + 
                       calculateProRatedSalary(formData.hra) + 
                       formData.allowances + 
                       formData.overtime + 
                       formData.bonus;

  const totalDeductions = formData.providentFund + 
                         formData.tax + 
                         formData.insurance + 
                         formData.loan + 
                         formData.otherDeductions;

  const netSalary = totalEarnings - totalDeductions;

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData(prev => ({
      ...prev,
      employeeId: employee.employeeId || employee.id,
      basicSalary: getEmployeeSalary(employee)
    }));
    setIsEmployeeDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    const numericFields = [
      'workingDays', 'presentDays', 'basicSalary', 'hra', 'allowances', 
      'overtime', 'bonus', 'providentFund', 'tax', 'insurance', 'loan', 'otherDeductions'
    ];
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");

    try {
      // Validate required fields
      if (!selectedEmployee || !formData.month || !formData.year) {
        throw new Error("Please fill in all required fields");
      }

      await onSubmit(formData);
      setMessage("Salary slip created successfully!");

    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-h-[80vh] overflow-y-auto">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('Error') || message.includes('error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Employee Selection & Basic Info */}
      <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg  font-semibold text-gray-800 mb-4 flex items-center gap-2 ">

          <User size={20} />
          Employee Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Dropdown */}
          <div className="md:col-span-2">
            <Label className="block mb-2 font-medium">
              Select Employee <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <span className={selectedEmployee ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedEmployee ? `${getEmployeeName(selectedEmployee)} (${selectedEmployee.employeeId || selectedEmployee.id})` : 'Select employee'}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`absolute right-3 top-3.5 text-gray-400 transition-transform ${isEmployeeDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {isEmployeeDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {employees.length > 0 ? employees.map((employee) => (
                    <button
                      key={employee.id}
                      type="button"
                      onClick={() => handleEmployeeSelect(employee)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">{getEmployeeName(employee)}</div>
                          <div className="text-sm text-gray-500">{getEmployeePosition(employee)} • {employee.department}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{employee.employeeId || employee.id}</div>
                          <div className="text-sm text-gray-500">USD {getEmployeeSalary(employee).toLocaleString()}</div>
                        </div>
                      </div>
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No employees found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Month/Year */}
          <div>
            <Label className="block mb-2 font-medium">
              Salary Period <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={new Date(0, i).toLocaleString('default', { month: 'long' })}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i} value={currentYear - 2 + i}>
                    {currentYear - 2 + i}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employee Details */}
        {selectedEmployee && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Employee ID:</span>
                <div className="font-medium">{selectedEmployee.employeeId || selectedEmployee.id}</div>
              </div>
              <div>
                <span className="text-gray-500">Department:</span>
                <div className="font-medium">{selectedEmployee.department || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Position:</span>
                <div className="font-medium">{getEmployeePosition(selectedEmployee)}</div>
              </div>
              <div>
                <span className="text-gray-500">Basic Salary:</span>
                <div className="font-medium">USD {getEmployeeSalary(selectedEmployee).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attendance */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Attendance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block mb-2 font-medium">Working Days</Label>
            <Input
              type="number"
              name="workingDays"
              value={formData.workingDays}
              onChange={handleInputChange}
              min="1"
              max="31"
              className="w-full"
            />
          </div>
          <div>
            <Label className="block mb-2 font-medium">Present Days</Label>
            <Input
              type="number"
              name="presentDays"
              value={formData.presentDays}
              onChange={handleInputChange}
              min="0"
              max={formData.workingDays}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Earnings & Deductions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h2 className="text-lg font-semibold text-green-800 mb-4">Earnings</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="block mb-2 font-medium">Basic Salary</Label>
              <Input
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleInputChange}
                step="0.01"
                className="w-full"
                disabled={selectedEmployee !== null}
              />
              {formData.presentDays !== formData.workingDays && (
                <p className="text-xs text-gray-600 mt-1">
                  Pro-rated: USD {calculateProRatedSalary(formData.basicSalary).toLocaleString()}
                </p>
              )}
            </div>
            
            <div>
              <Label className="block mb-2 font-medium">HRA (House Rent Allowance)</Label>
              <Input
                type="number"
                name="hra"
                value={formData.hra}
                onChange={handleInputChange}
                step="0.01"
                className="w-full"
              />
              {formData.presentDays !== formData.workingDays && (
                <p className="text-xs text-gray-600 mt-1">
                  Pro-rated: USD {calculateProRatedSalary(formData.hra).toLocaleString()}
                </p>
              )}
            </div>
            
            <div>
              <Label className="block mb-2 font-medium">Other Allowances</Label>
              <Input
                type="number"
                name="allowances"
                value={formData.allowances}
                onChange={handleInputChange}
                step="0.01"
                className="w-full"
                placeholder="Travel, Medical, etc."
              />
            </div>
            
            <div>
              <Label className="block mb-2 font-medium">Overtime</Label>
              <Input
                type="number"
                name="overtime"
                value={formData.overtime}
                onChange={handleInputChange}
                step="0.01"
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="block mb-2 font-medium">Bonus</Label>
              <Input
                type="number"
                name="bonus"
                value={formData.bonus}
                onChange={handleInputChange}
                step="0.01"
                className="w-full"
              />
            </div>
            
            <div className="pt-4 border-t border-green-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-800">Total Earnings:</span>
                <span className="font-bold text-green-800 text-lg">USD {totalEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-4">Deductions</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="block mb-2 font-medium">Provident Fund (PF)</Label>
              <Input
                type="number"
                name="providentFund"
                value={formData.providentFund}
                onChange={handleInputChange}
                step="0.01"
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="block mb-2 font-medium">Tax Deduction</Label>
              <Input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleInputChange}
                step="0.01"
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="block mb-2 font-medium">Insurance</Label>
              <Input
                type="number"
                name="insurance"
                value={formData.insurance}
                onChange={handleInputChange}
                step="0.01"
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="block mb-2 font-medium">Loan Deduction</Label>
              <Input
                type="number"
                name="loan"
                value={formData.loan}
                onChange={handleInputChange}
                step="0.01"
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="block mb-2 font-medium">Other Deductions</Label>
              <Input
                type="number"
                name="otherDeductions"
                value={formData.otherDeductions}
                onChange={handleInputChange}
                step="0.01"
                className="w-full"
              />
            </div>
            
            <div className="pt-4 border-t border-red-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-red-800">Total Deductions:</span>
                <span className="font-bold text-red-800 text-lg">USD {totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net Salary Summary */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-3 rounded-lg">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">Net Salary</h2>
              <p className="text-blue-700">Total Earnings - Total Deductions</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-900">USD {netSalary.toLocaleString()}</div>
            <div className="text-sm text-blue-700">
              {totalEarnings.toLocaleString()} - {totalDeductions.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !selectedEmployee}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <DollarSign size={16} />
              Create Payroll
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Enhanced Payroll Form Component with Auto-Fetch Salary
const PayrollForm: React.FC<PayrollFormProps> = ({ payroll, employees, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PayrollFormData>({
    employeeId: payroll?.employeeId || '',
    month: payroll?.month || '',
    baseSalary: payroll?.baseSalary?.toString() || '',
    bonus: payroll?.bonus?.toString() || '',
    deductions: payroll?.deductions?.toString() || ''
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salaryFetched, setSalaryFetched] = useState(false);

  // Helper function to extract basic salary from employee data
  const getEmployeeBasicSalary = (employee: Employee): number => {
    // Try different possible field names for salary
    const salaryFields = [
      employee.basicSalary,
      employee.basic_salary,
      employee.salary,
      employee.monthlySalary,
      employee.monthly_salary
    ];

    for (const salary of salaryFields) {
      if (salary !== undefined && salary !== null && salary !== '') {
        const numSalary = parseFloat(salary.toString());
        if (!isNaN(numSalary) && numSalary > 0) {
          return numSalary;
        }
      }
    }

    return 0;
  };

  // Find selected employee when form loads or employeeId changes
  useEffect(() => {
    if (formData.employeeId) {
      const employee = employees.find(emp => emp.employeeId === formData.employeeId);
      setSelectedEmployee(employee || null);
      
      // Auto-populate basic salary if available and not already set (for new payrolls)
      if (employee && !payroll) {
        const basicSalary = getEmployeeBasicSalary(employee);
        if (basicSalary > 0) {
          setFormData(prev => ({
            ...prev,
            baseSalary: basicSalary.toString()
          }));
          setSalaryFetched(true);
        } else {
          setSalaryFetched(false);
        }
      }
    } else {
      setSelectedEmployee(null);
      setSalaryFetched(false);
    }
  }, [formData.employeeId, employees, payroll]);

  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find(emp => emp.employeeId === employeeId);
    setSelectedEmployee(employee || null);
    
    // Auto-populate basic salary when employee is selected (for new payrolls only)
    if (employee && !payroll) {
      const basicSalary = getEmployeeBasicSalary(employee);
      if (basicSalary > 0) {
        setFormData(prev => ({
          ...prev,
          employeeId,
          baseSalary: basicSalary.toString()
        }));
        setSalaryFetched(true);
      } else {
        setFormData(prev => ({
          ...prev,
          employeeId,
          baseSalary: ''
        }));
        setSalaryFetched(false);
      }
    } else {
      setFormData(prev => ({...prev, employeeId}));
    }
  };

  const validateForm = () => {
    if (!formData.employeeId.trim()) {
      alert('Please select an employee');
      return false;
    }
    if (!formData.month.trim()) {
      alert('Please enter the month');
      return false;
    }
    if (!formData.baseSalary.trim() || parseFloat(formData.baseSalary) <= 0) {
      alert('Please enter a valid base salary');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log('Form submit triggered with data:', formData);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate net pay in real-time
  const baseSalary = parseFloat(formData.baseSalary) || 0;
  const bonus = parseFloat(formData.bonus) || 0;
  const deductions = parseFloat(formData.deductions) || 0;
  const netPay = baseSalary + bonus - deductions;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee *</Label>
          <div className="relative">
            <select
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
              required
              disabled={isSubmitting}
            >
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.employeeId}>
                  {employee.employeeId} - {employee.fullName || employee.full_name || employee.name}
                  {employee.department && ` (${employee.department})`}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          {selectedEmployee && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <p><strong>Name:</strong> {selectedEmployee.fullName || selectedEmployee.full_name || selectedEmployee.name}</p>
              <p><strong>Department:</strong> {selectedEmployee.department || 'N/A'}</p>
              <p><strong>Position:</strong> {selectedEmployee.position || selectedEmployee.designation || selectedEmployee.job_title || 'N/A'}</p>
              {getEmployeeBasicSalary(selectedEmployee) > 0 && (
                <p><strong>Basic Salary:</strong> {formatCurrency(getEmployeeBasicSalary(selectedEmployee))}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="month">Month *</Label>
          <Input
            id="month"
            value={formData.month}
            onChange={(e) => setFormData({...formData, month: e.target.value})}
            placeholder="e.g., January 2024"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="baseSalary" className="flex items-center gap-2">
            Base Salary * (USD)
            {salaryFetched && !payroll && (
              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                <Info className="h-3 w-3 mr-1" />
                Auto-filled
              </Badge>
            )}
          </Label>
          <Input
            id="baseSalary"
            type="number"
            step="0.01"
            min="0"
            value={formData.baseSalary}
            onChange={(e) => {
              setFormData({...formData, baseSalary: e.target.value});
              setSalaryFetched(false); // Mark as manually modified
            }}
            placeholder="0.00"
            required
            disabled={isSubmitting}
          />
          {!payroll && selectedEmployee && getEmployeeBasicSalary(selectedEmployee) === 0 && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              No basic salary found in employee record. Please enter manually.
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bonus">Bonus (USD)</Label>
          <Input
            id="bonus"
            type="number"
            step="0.01"
            min="0"
            value={formData.bonus}
            onChange={(e) => setFormData({...formData, bonus: e.target.value})}
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deductions">Deductions (USD)</Label>
          <Input
            id="deductions"
            type="number"
            step="0.01"
            min="0"
            value={formData.deductions}
            onChange={(e) => setFormData({...formData, deductions: e.target.value})}
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label>Net Pay (Auto-calculated)</Label>
          <div className="h-9 px-3 py-1 bg-gray-50 border rounded-md flex items-center text-sm font-semibold text-green-600">
            {formatCurrency(netPay)}
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              {payroll ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            payroll ? 'Update' : 'Create'
          )} Payroll
        </Button>
      </div>
    </div>
  );
};

// Main App Component
export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSalarySlipDialog, setShowSalarySlipDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load employees
  const loadEmployees = async () => {
    try {
      setEmployeesLoading(true);
      console.log('🔍 Loading employees from backend...');
      
      const response = await fetch(`${API_BASE}/employees`);
      const data = await response.json();
      
      console.log('📊 Employee response:', data);
      
      if (response.ok) {
        // Handle the response format: { success: true, data: [...] } or direct array
        const employeeData = data.success ? data.data : (data.data || data);
        
        // Ensure we have an array
        const employeeArray = Array.isArray(employeeData) ? employeeData : [];
        
        console.log(`✅ Loaded ${employeeArray.length} employee records`);
        console.log('Employee data sample:', employeeArray[0]);
        
        setEmployees(employeeArray);
      } else {
        console.error('❌ Employee loading failed:', data);
        showNotification(data.error || 'Failed to load employees', 'error');
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      showNotification('Failed to connect to server to load employees.', 'error');
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Load payrolls
  const loadPayrolls = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading payrolls from backend...');
      
      const response = await fetch(`${API_BASE}/payroll`);
      const data = await response.json();
      
      console.log('📊 Payroll response:', data);
      
      if (response.ok) {
        // Handle the new response format: { success: true, data: [...] }
        const payrollData = data.success ? data.data : data;
        
        // Ensure we have an array
        const payrollArray = Array.isArray(payrollData) ? payrollData : [];
        
        console.log(`✅ Loaded ${payrollArray.length} payroll records`);
        setPayrolls(payrollArray);
      } else {
        console.error('❌ Payroll loading failed:', data);
        showNotification(data.error || 'Failed to load payrolls', 'error');
        setPayrolls([]);
      }
    } catch (error: unknown) {
      console.error('Error loading payrolls:', error);
      showNotification('Failed to connect to server. Please check if the backend is running.', 'error');
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle salary slip creation
  const handleSalarySlipSubmit = async (salaryData: SalarySlipData) => {
    console.log('Salary slip submission started with data:', salaryData);
    
    try {
      // Convert salary slip data to payroll format
      const totalEarnings = Math.round(
        (salaryData.basicSalary * salaryData.presentDays) / salaryData.workingDays +
        (salaryData.hra * salaryData.presentDays) / salaryData.workingDays +
        salaryData.allowances + 
        salaryData.overtime + 
        salaryData.bonus
      );

      const totalDeductions = salaryData.providentFund + 
                             salaryData.tax + 
                             salaryData.insurance + 
                             salaryData.loan + 
                             salaryData.otherDeductions;

      const netPay = totalEarnings - totalDeductions;

      const payload = {
        employeeId: salaryData.employeeId,
        month: `${salaryData.month} ${salaryData.year}`,
        baseSalary: totalEarnings,
        bonus: salaryData.bonus,
        deductions: totalDeductions,
        netPay: netPay,
        isPaid: false
      };

      console.log('Sending payload:', payload);

      const response = await fetch(`${API_BASE}/payroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      let result;
      try {
        result = await response.json();
        console.log('Response data:', result);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned invalid JSON response');
      }

      if (response.ok) {
        showNotification('Salary slip created successfully');
        setShowSalarySlipDialog(false);
        await loadPayrolls();
      } else {
        console.error('Server error:', result);
        showNotification(result.error || result.message || 'Failed to create salary slip', 'error');
      }
    } catch (error: unknown) {
  console.error('Error submitting salary slip:', error);

  if (error instanceof Error) {
    showNotification(`Failed to connect to server: ${error.message}`, 'error');
  } else {
    showNotification('Failed to connect to server: Unknown error', 'error');
  }
}
  };

  // Handle create/update
  const handleFormSubmit = async (formData: PayrollFormData) => {
    console.log('Form submission started with data:', formData);
    
    try {
      const url = editingPayroll 
        ? `${API_BASE}/payroll/${editingPayroll.id}`
        : `${API_BASE}/payroll`;
      const method = editingPayroll ? 'PUT' : 'POST';
      
      // Calculate net pay
      const baseSalary = parseFloat(formData.baseSalary) || 0;
      const bonus = parseFloat(formData.bonus) || 0;
      const deductions = parseFloat(formData.deductions) || 0;
      const netPay = baseSalary + bonus - deductions;
      
      const payload = {
        employeeId: formData.employeeId,
        month: formData.month,
        baseSalary: baseSalary,
        bonus: bonus,
        deductions: deductions,
        netPay: netPay,
        isPaid: false
      };

      console.log('Sending payload:', payload);
      console.log('Request URL:', url);
      console.log('Request method:', method);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      let result;
      try {
        result = await response.json();
        console.log('Response data:', result);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        const textResponse = await response.text();
        console.log('Response as text:', textResponse);
        throw new Error('Server returned invalid JSON response');
      }

      if (response.ok) {
        showNotification(`Payroll ${editingPayroll ? 'updated' : 'created'} successfully`);
        setShowCreateDialog(false);
        setShowEditDialog(false);
        setEditingPayroll(null);
        await loadPayrolls(); // Ensure we wait for reload
      } else {
        console.error('Server error:', result);
        showNotification(result.error || result.message || `Failed to ${editingPayroll ? 'update' : 'create'} payroll`, 'error');
      }
    } catch (error: unknown) {
  console.error('Error submitting form:', error);

  if (error instanceof Error) {
    showNotification(`Failed to connect to server: ${error.message}`, 'error');
  } else {
    showNotification('Failed to connect to server: Unknown error', 'error');
  }
}
  };

  // Handle edit
  const handleEdit = (payroll: Payroll) => {
    setEditingPayroll(payroll);
    setShowEditDialog(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payroll? This action cannot be undone.')) return;

    try {
      const response = await fetch(`${API_BASE}/payroll/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (response.ok) {
        showNotification('Payroll deleted successfully');
        loadPayrolls();
      } else {
        showNotification(data.error || 'Failed to delete payroll', 'error');
      }
    } catch (error) {
      console.error('Error deleting payroll:', error);
      showNotification('Failed to connect to server', 'error');
    }
  };

  // Handle mark as paid
  const handleMarkPaid = async (id: string) => {
    if (!confirm('Mark this payroll as paid?')) return;

    try {
      const response = await fetch(`${API_BASE}/payroll/${id}/pay`, { method: 'PATCH' });
      const data = await response.json();

      if (response.ok) {
        showNotification('Payroll marked as paid successfully');
        loadPayrolls();
      } else {
        showNotification(data.error || 'Failed to mark payroll as paid', 'error');
      }
    } catch (error) {
      console.error('Error marking payroll as paid:', error);
      showNotification('Failed to connect to server', 'error');
    }
  };

  // Calculate stats
  const stats = {
    total: payrolls.length,
    paid: payrolls.filter(p => p.isPaid).length,
    pending: payrolls.filter(p => !p.isPaid).length,
    totalAmount: payrolls.reduce((sum, p) => sum + parseFloat(p.netPay.toString()), 0)
  };

  // Helper function to get employee by employeeId
  const getEmployeeByEmployeeId = (employeeId: string): Employee | undefined => {
    return employees.find(emp => emp.employeeId === employeeId);
  };

  // Load data on mount
  useEffect(() => {
    loadEmployees();
    loadPayrolls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
                <p className="text-gray-600 mt-1">Manage employee payrolls with ease and efficiency</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { loadEmployees(); loadPayrolls(); }} disabled={loading || employeesLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading || employeesLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              {/* Quick Create Payroll Button */}
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={employeesLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Quick Create Payroll</DialogTitle>
                  </DialogHeader>
                  <PayrollForm 
                    employees={employees}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowCreateDialog(false)}
                  />
                </DialogContent>
              </Dialog>
              
              {/* Detailed Salary Slip Button */}
              <Dialog open={showSalarySlipDialog} onOpenChange={setShowSalarySlipDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={employeesLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Payroll
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Create Detailed Salary Slip</DialogTitle>
                  </DialogHeader>
                  <SalarySlipForm 
                    employees={employees}
                    onSubmit={handleSalarySlipSubmit}
                    onCancel={() => setShowSalarySlipDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            icon={Users} 
            title="Total Payrolls" 
            value={stats.total} 
            description="All payroll records"
          />
          <StatsCard 
            icon={CheckCircle} 
            title="Paid Payrolls" 
            value={stats.paid} 
            description="Successfully processed"
          />
          <StatsCard 
            icon={Clock} 
            title="Pending Payrolls" 
            value={stats.pending} 
            description="Awaiting payment"
          />
          <StatsCard 
            icon={DollarSign} 
            title="Total Amount" 
            value={formatCurrency(stats.totalAmount)} 
            description="Combined net pay"
          />
        </div>

        {/* Loading state for employees */}
        {employeesLoading && (
          <Card className="p-4 mb-6">
            <div className="text-center">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-500 mb-2" />
              <p className="text-gray-600">Loading employee data...</p>
            </div>
          </Card>
        )}

        {/* Content */}
        {loading ? (
          <Card className="p-12">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 animate-spin mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading payrolls...</h3>
              <p className="text-gray-500">Please wait while we fetch your data</p>
            </div>
          </Card>
        ) : payrolls.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <DollarSign className="h-24 w-24 mx-auto text-gray-300 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No payrolls found</h3>
              <p className="text-gray-500 mb-6">Create your first payroll to get started</p>
              <div className="flex gap-4 justify-center">
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" disabled={employeesLoading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Quick Create
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Quick Create Payroll</DialogTitle>
                    </DialogHeader>
                    <PayrollForm 
                      employees={employees}
                      onSubmit={handleFormSubmit}
                      onCancel={() => setShowCreateDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showSalarySlipDialog} onOpenChange={setShowSalarySlipDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={employeesLoading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Detailed Payroll
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>Create Detailed Salary Slip</DialogTitle>
                    </DialogHeader>
                    <SalarySlipForm 
                      employees={employees}
                      onSubmit={handleSalarySlipSubmit}
                      onCancel={() => setShowSalarySlipDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {payrolls.map(payroll => (
              <PayrollCard
                key={payroll.id}
                payroll={payroll}
                employee={getEmployeeByEmployeeId(payroll.employeeId)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMarkPaid={handleMarkPaid}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Payroll</DialogTitle>
          </DialogHeader>
          <PayrollForm 
            payroll={editingPayroll}
            employees={employees}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowEditDialog(false);
              setEditingPayroll(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
        />
      )}
    </div>
  );
}