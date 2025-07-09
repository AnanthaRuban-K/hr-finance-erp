"use client";

import EmployeeForm from '@/components/EmployeeForm';
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { Eye, Pencil, Trash2, RefreshCw, Download, Plus, X, Loader2, AlertTriangle, Search, Filter, ChevronDown } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Enhanced API response interfaces
interface EmployeeAPIResponse {
  id: string;
  fullName: string;
  nricFinPassport: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  nationality: "singapore" | "malaysia" | "china" | "india" | "others";
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  residentialStatus: "citizen" | "pr" | "workpass" | "dependent";
  race?: string;
  religion?: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  emergencyContact: string;
  emergencyPhone: string;
  employeeId: string;
  department: "hr" | "it" | "finance" | "marketing" | "operations" | "sales";
  position: string;
  joinDate: string;
  employmentType: "fulltime" | "parttime" | "contract" | "intern";
  reportingManager?: string;
  basicSalary: number;
  paymentMode: "bank" | "cash" | "cheque";
  bankName?: string;
  accountNumber?: string;
  cpfNumber?: string;
  taxNumber?: string;
  skills?: string;
  certifications?: string;
  notes?: string;
  status: "active" | "inactive" | "terminated" | "resigned";
  isActive: boolean;
  terminationDate?: string;
  terminationReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface APIResponse {
  success: boolean;
  data: EmployeeAPIResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

interface EmployeeTableData {
  id: string;
  name: string;
  designation: string;
  department: string;
  joinDate: string;
  email: string;
  phone: string;
  status: string;
  rawData: EmployeeAPIResponse;
}

interface FilterOptions {
  search: string;
  department: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState("active");
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeTableData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeTableData | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeAPIResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    department: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // API Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  // Transform API response to form data format
  const transformToFormData = (apiData: EmployeeAPIResponse | null) => {
    if (!apiData) return undefined;
    
    return {
      id: apiData.id,
      fullName: apiData.fullName,
      nricFinPassport: apiData.nricFinPassport,
      dateOfBirth: apiData.dateOfBirth,
      gender: apiData.gender,
      nationality: apiData.nationality,
      maritalStatus: apiData.maritalStatus,
      residentialStatus: apiData.residentialStatus,
      race: apiData.race || "",
      religion: apiData.religion || "",
      email: apiData.email,
      phone: apiData.phone,
      address: apiData.address,
      city: apiData.city || "",
      postalCode: apiData.postalCode || "",
      emergencyContact: apiData.emergencyContact,
      emergencyPhone: apiData.emergencyPhone,
      employeeId: apiData.employeeId,
      department: apiData.department,
      position: apiData.position,
      joinDate: apiData.joinDate,
      employmentType: apiData.employmentType,
      reportingManager: apiData.reportingManager || "",
      basicSalary: apiData.basicSalary.toString(),
      paymentMode: apiData.paymentMode,
      bankName: apiData.bankName || "",
      accountNumber: apiData.accountNumber || "",
      cpfNumber: apiData.cpfNumber || "",
      taxNumber: apiData.taxNumber || "",
      skills: apiData.skills || "",
      certifications: apiData.certifications || "",
      notes: apiData.notes || "",
    };
  };

  // Build query parameters
  const buildQueryParams = useCallback((customFilters?: Partial<FilterOptions>, customPage?: number) => {
    const currentFilters = { ...filters, ...customFilters };
    const params = new URLSearchParams();
    
    params.append('page', (customPage || pagination.page).toString());
    params.append('limit', pagination.limit.toString());
    
    if (currentFilters.search) params.append('search', currentFilters.search);
    if (currentFilters.department) params.append('department', currentFilters.department);
    if (currentFilters.status) params.append('status', currentFilters.status);
    if (currentFilters.sortBy) params.append('sortBy', currentFilters.sortBy);
    if (currentFilters.sortOrder) params.append('sortOrder', currentFilters.sortOrder);
    
    return params.toString();
  }, [filters, pagination.page, pagination.limit]);

  // Fetch employees from API
  const fetchEmployees = useCallback(async (customFilters?: Partial<FilterOptions>, customPage?: number) => {
    try {
      setLoading(true);
      setError("");
      
      const queryParams = buildQueryParams(customFilters, customPage);
      const response = await fetch(`${API_BASE_URL}/employees?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse = await response.json();
      
      if (result.success) {
        const transformedData: EmployeeTableData[] = result.data.map((employee: EmployeeAPIResponse) => ({
          id: employee.id,
          name: employee.fullName,
          designation: employee.position,
          department: employee.department,
          joinDate: new Date(employee.joinDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric'
          }),
          email: employee.email,
          phone: employee.phone,
          status: employee.status,
          rawData: employee
        }));
        
        setEmployeeData(transformedData);
        
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        setError(result.error || 'Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, buildQueryParams]);

  // Delete employee
  const handleDelete = async (employeeId: string) => {
    try {
      setDeleting(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setShowDeleteConfirm(false);
        setSelectedEmployee(null);
        // Refresh the current page
        fetchEmployees();
      } else {
        setError(result.error || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Failed to delete employee. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchEmployees(newFilters, 1);
  };

  // Handle search with debounce
  const handleSearch = useCallback(
    React.useMemo(
      () => {
        let timeoutId: NodeJS.Timeout;
        return (searchTerm: string) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            handleFilterChange('search', searchTerm);
          }, 500);
        };
      },
      [filters]
    ),
    []
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchEmployees(undefined, newPage);
  };

  // Handle view employee
  const handleView = (employee: EmployeeTableData) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  // Handle edit employee
  const handleEdit = (employee: EmployeeTableData) => {
    setEditingEmployee(employee.rawData);
    setIsEditMode(true);
    setShowForm(true);
  };

  // Handle create new employee
  const handleCreate = () => {
    setEditingEmployee(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (employee: EmployeeTableData) => {
    setSelectedEmployee(employee);
    setShowDeleteConfirm(true);
  };

  // Handle form close and refresh data
  const handleFormClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
    setIsEditMode(false);
    fetchEmployees();
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchEmployees();
  };

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees by tab
  const filteredEmployees = employeeData.filter(emp => {
    if (activeTab === "active") {
      return emp.status === "active";
    } else {
      return emp.status !== "active";
    }
  });

  const activeCount = employeeData.filter(emp => emp.status === "active").length;
  const inactiveCount = employeeData.filter(emp => emp.status !== "active").length;

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreate}
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Name, email, employee ID..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <div className="relative">
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
                >
                  <option value="">All Departments</option>
                  <option value="hr">Human Resources</option>
                  <option value="it">Information Technology</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                  <option value="sales">Sales</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                  <option value="resigned">Resigned</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="flex-1 h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="fullName">Name</option>
                  <option value="joinDate">Join Date</option>
                  <option value="department">Department</option>
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                  className="w-20 h-9 rounded-md border border-input bg-white px-2 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
                >
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-3 rounded-l-md text-sm font-medium ${
              activeTab === "active" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`px-6 py-3 rounded-r-md text-sm font-medium ${
              activeTab === "inactive" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Inactive ({inactiveCount})
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {filteredEmployees.length} of {pagination.total} employees
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Employee</TableHead>
              <TableHead className="font-semibold">Position</TableHead>
              <TableHead className="font-semibold">Department</TableHead>
              <TableHead className="font-semibold">Join Date</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <span className="text-gray-600">Loading employees...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.rawData.employeeId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>
                    <span className="capitalize">{employee.department}</span>
                  </TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{employee.email}</div>
                      <div className="text-sm text-gray-500">{employee.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      employee.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : employee.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <button 
                        className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded"
                        onClick={() => handleView(employee)}
                        title="View Employee"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-500 hover:text-green-600 transition-colors p-1 rounded"
                        onClick={() => handleEdit(employee)}
                        title="Edit Employee"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded"
                        onClick={() => handleDeleteClick(employee)}
                        title="Delete Employee"
                        disabled={employee.status !== 'active'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages} • {pagination.total} total items
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, pagination.page - 2) + i;
              if (pageNum > pagination.totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className={pageNum === pagination.page ? "bg-blue-600 text-white" : ""}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modal for Employee Form (Create/Edit) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-semibold">
                {isEditMode ? 'Edit Employee' : 'Create New Employee'}
              </h2>
              <button 
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <EmployeeForm 
                onClose={handleFormClose}
                initialData={transformToFormData(editingEmployee)}
                isEdit={isEditMode}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-semibold">Employee Details</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedEmployee.rawData && Object.entries(selectedEmployee.rawData).map(([key, value]) => {
                  if (value === null || value === undefined || value === '') return null;
                  
                  const formatKey = (key: string) => {
                    return key
                      .replace(/_/g, ' ')
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                      .trim();
                  };

                  const formatValue = (key: string, value: any) => {
                    if (value === null || value === undefined) return 'N/A';
                    
                    if (key.toLowerCase().includes('date')) {
                      try {
                        return new Date(value).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
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

                  return (
                    <div key={key} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-600">
                        {formatKey(key)}
                      </label>
                      <div className="text-gray-900 bg-gray-50 p-3 rounded border min-h-[2.5rem] flex items-center">
                        {key.toLowerCase().includes('email') ? (
                          <a 
                            href={`mailto:${value}`} 
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {formatValue(key, value)}
                          </a>
                        ) : key.toLowerCase().includes('phone') ? (
                          <a 
                            href={`tel:${value}`} 
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {formatValue(key, value)}
                          </a>
                        ) : (
                          <span>{formatValue(key, value)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedEmployee);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Edit Employee
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Employee</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{selectedEmployee.name}</strong>? 
                This will permanently remove the employee record from your database.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(selectedEmployee.id)}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Employee'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}