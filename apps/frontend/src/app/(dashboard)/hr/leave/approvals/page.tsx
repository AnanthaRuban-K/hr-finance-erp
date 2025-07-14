"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  User,
  FileText,
  MessageSquare,
  Filter,
  Search,
  RefreshCw,
  Download,
  AlertTriangle,
  Info,
  ArrowLeft,
  Mail,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/layout/page-header";
import { RoleGuard } from "@/components/auth/role-guard";
import { UserRole } from "@/types/auth";
import { toast } from "sonner";

// Sample pending leave applications
const pendingApplications = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "John Smith",
    department: "Engineering",
    designation: "Senior Developer",
    leaveType: "Annual Leave",
    startDate: "2024-02-15",
    endDate: "2024-02-19",
    days: 5,
    appliedDate: "2024-01-30",
    reason: "Family vacation to celebrate my parents' anniversary. This is a pre-planned trip that has been in the works for several months.",
    contactInfo: "+65 9123 4567",
    emergencyContact: "Mary Smith (Spouse) - +65 9876 5432",
    handoverRequired: true,
    handoverPerson: "Alice Brown",
    handoverNotes: "Will complete current sprint tasks and hand over ongoing projects to Alice. All documentation is up to date.",
    avatar: null,
    manager: "Sarah Johnson",
    leaveBalance: 12,
    previousLeaves: 8,
    documents: ["medical_cert.pdf"]
  },
  {
    id: 2,
    employeeId: "EMP005",
    employeeName: "David Lee",
    department: "Finance",
    designation: "Financial Analyst",
    leaveType: "Annual Leave",
    startDate: "2024-02-20",
    endDate: "2024-02-23",
    days: 4,
    appliedDate: "2024-02-01",
    reason: "Personal time off for mental health and relaxation",
    contactInfo: "+65 8234 5678",
    emergencyContact: "Linda Lee (Mother) - +65 9123 7890",
    handoverRequired: false,
    handoverPerson: "",
    handoverNotes: "",
    avatar: null,
    manager: "Emma Thompson",
    leaveBalance: 15,
    previousLeaves: 5,
    documents: []
  },
  {
    id: 3,
    employeeId: "EMP006",
    employeeName: "Sarah Wilson",
    department: "Marketing",
    designation: "Marketing Specialist",
    leaveType: "Medical Leave",
    startDate: "2024-02-12",
    endDate: "2024-02-14",
    days: 3,
    appliedDate: "2024-02-09",
    reason: "Medical procedure requiring recovery time as advised by doctor",
    contactInfo: "+65 9345 6789",
    emergencyContact: "Tom Wilson (Husband) - +65 8765 4321",
    handoverRequired: true,
    handoverPerson: "Mike Chen",
    handoverNotes: "Marketing campaign materials are ready. Mike will handle client calls and social media updates.",
    avatar: null,
    manager: "Lisa Zhang",
    leaveBalance: 10,
    previousLeaves: 4,
    documents: ["medical_certificate.pdf", "doctor_note.pdf"]
  },
  {
    id: 4,
    employeeId: "EMP007",
    employeeName: "Michael Brown",
    department: "Sales",
    designation: "Sales Executive",
    leaveType: "Emergency Leave",
    startDate: "2024-02-10",
    endDate: "2024-02-10",
    days: 1,
    appliedDate: "2024-02-09",
    reason: "Family emergency - need to attend to sick family member",
    contactInfo: "+65 8456 7890",
    emergencyContact: "Jessica Brown (Wife) - +65 9234 5678",
    handoverRequired: false,
    handoverPerson: "",
    handoverNotes: "",
    avatar: null,
    manager: "Robert Kim",
    leaveBalance: 3,
    previousLeaves: 2,
    documents: []
  }
];

export default function LeaveApprovals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<typeof pendingApplications[0] | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [comments, setComments] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return pendingApplications.filter(app => 
      searchTerm === '' || 
      app.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getLeaveTypeColor = (leaveType: string) => {
    const colorMap: Record<string, string> = {
      'Annual Leave': 'bg-blue-100 text-blue-800',
      'Medical Leave': 'bg-red-100 text-red-800',
      'Maternity Leave': 'bg-pink-100 text-pink-800',
      'Paternity Leave': 'bg-green-100 text-green-800',
      'Emergency Leave': 'bg-orange-100 text-orange-800',
      'Childcare Leave': 'bg-purple-100 text-purple-800'
    };
    return colorMap[leaveType] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyLevel = (leaveType: string, daysUntilStart: number) => {
    if (leaveType === 'Emergency Leave' || daysUntilStart <= 1) {
      return { level: 'high', color: 'text-red-600', label: 'Urgent' };
    } else if (daysUntilStart <= 7) {
      return { level: 'medium', color: 'text-yellow-600', label: 'Soon' };
    }
    return { level: 'low', color: 'text-green-600', label: 'Normal' };
  };

  const calculateDaysUntilStart = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = start.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;
    
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Leave Approved", {
        description: `${selectedApplication.employeeName}'s leave application has been approved.`
      });
      
      setApprovalDialogOpen(false);
      setComments("");
    } catch (error) {
      toast.error("Error", {
        description: "Failed to approve leave application."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !comments.trim()) {
      toast.error("Comments required", {
        description: "Please provide a reason for rejection."
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Leave Rejected", {
        description: `${selectedApplication.employeeName}'s leave application has been rejected.`
      });
      
      setRejectionDialogOpen(false);
      setComments("");
    } catch (error) {
      toast.error("Error", {
        description: "Failed to reject leave application."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <RoleGuard allowedRoles={[UserRole.HR_MANAGER, UserRole.SUPERVISOR, UserRole.ADMIN]}>
      <div className="space-y-6">
        <PageHeader
          title="Leave Approvals"
          description="Review and approve pending leave applications from your team"
        >
          <div className="flex gap-2">
            <Link href="/hr/leave">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leave Management
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </PageHeader>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications.length}</div>
              <p className="text-xs text-muted-foreground">
                Requiring your attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Requests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingApplications.filter(app => 
                  getUrgencyLevel(app.leaveType, calculateDaysUntilStart(app.startDate)).level === 'high'
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Emergency or starting soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Leave</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingApplications.filter(app => app.leaveType === 'Medical Leave').length}
              </div>
              <p className="text-xs text-muted-foreground">
                With medical certificates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2 days</div>
              <p className="text-xs text-muted-foreground">
                Your approval time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Leave Applications</CardTitle>
                <CardDescription>
                  Review leave requests and make approval decisions
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Pending Applications</h3>
                <p className="text-muted-foreground">All leave applications have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => {
                  const daysUntilStart = calculateDaysUntilStart(application.startDate);
                  const urgency = getUrgencyLevel(application.leaveType, daysUntilStart);
                  
                  return (
                    <Card key={application.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={application.avatar || undefined} />
                              <AvatarFallback>{getInitials(application.employeeName)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold">{application.employeeName}</h3>
                                <Badge variant="outline">{application.employeeId}</Badge>
                                <Badge 
                                  variant="outline"
                                  className={getLeaveTypeColor(application.leaveType)}
                                >
                                  {application.leaveType}
                                </Badge>
                                <Badge variant="outline" className={urgency.color}>
                                  {urgency.label}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground">
                                {application.designation} • {application.department}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                  {formatDate(application.startDate)} - {formatDate(application.endDate)}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                  {application.days} days
                                </div>
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-1 text-muted-foreground" />
                                  Applied {formatDate(application.appliedDate)}
                                </div>
                              </div>
                              
                              <p className="text-sm mt-2 max-w-2xl">{application.reason}</p>
                              
                              {application.handoverRequired && (
                                <div className="mt-2">
                                  <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                      <strong>Handover to:</strong> {application.handoverPerson}<br />
                                      {application.handoverNotes}
                                    </AlertDescription>
                                  </Alert>
                                </div>
                              )}
                              
                              {application.documents.length > 0 && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {application.documents.length} document(s) attached
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Leave Application Details</DialogTitle>
                                  <DialogDescription>
                                    Complete information for {application.employeeName}'s leave request
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Employee Information</Label>
                                      <div className="space-y-2 mt-1">
                                        <p className="text-sm">Name: {application.employeeName}</p>
                                        <p className="text-sm">ID: {application.employeeId}</p>
                                        <p className="text-sm">Department: {application.department}</p>
                                        <p className="text-sm">Designation: {application.designation}</p>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label className="text-sm font-medium">Leave Balance</Label>
                                      <div className="space-y-2 mt-1">
                                        <p className="text-sm">Available: {application.leaveBalance} days</p>
                                        <p className="text-sm">Used this year: {application.previousLeaves} days</p>
                                        <p className="text-sm">After this leave: {application.leaveBalance - application.days} days</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-sm font-medium">Contact Information</Label>
                                    <div className="space-y-1 mt-1">
                                      <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">{application.contactInfo}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Emergency: {application.emergencyContact}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {application.documents.length > 0 && (
                                    <div>
                                      <Label className="text-sm font-medium">Supporting Documents</Label>
                                      <div className="space-y-1 mt-1">
                                        {application.documents.map((doc, index) => (
                                          <div key={index} className="flex items-center">
                                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span className="text-sm">{doc}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm"
                                  onClick={() => setSelectedApplication(application)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Approve Leave Application</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to approve this leave application?
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div className="bg-muted p-4 rounded-lg">
                                    <h4 className="font-medium">{selectedApplication?.employeeName}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedApplication?.leaveType} • {selectedApplication?.days} days
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedApplication?.startDate && formatDate(selectedApplication.startDate)} - 
                                      {selectedApplication?.endDate && formatDate(selectedApplication.endDate)}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="approval-comments">Comments (Optional)</Label>
                                    <Textarea
                                      id="approval-comments"
                                      value={comments}
                                      onChange={(e) => setComments(e.target.value)}
                                      placeholder="Add any comments for the employee..."
                                      rows={3}
                                    />
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setApprovalDialogOpen(false)}
                                    disabled={isProcessing}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleApprove}
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? "Approving..." : "Approve Leave"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => setSelectedApplication(application)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Leave Application</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for rejecting this leave application.
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div className="bg-muted p-4 rounded-lg">
                                    <h4 className="font-medium">{selectedApplication?.employeeName}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedApplication?.leaveType} • {selectedApplication?.days} days
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedApplication?.startDate && formatDate(selectedApplication.startDate)} - 
                                      {selectedApplication?.endDate && formatDate(selectedApplication.endDate)}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="rejection-comments">Reason for Rejection *</Label>
                                    <Textarea
                                      id="rejection-comments"
                                      value={comments}
                                      onChange={(e) => setComments(e.target.value)}
                                      placeholder="Please explain why this leave application is being rejected..."
                                      rows={4}
                                      required
                                    />
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setRejectionDialogOpen(false)}
                                    disabled={isProcessing}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={handleReject}
                                    disabled={isProcessing || !comments.trim()}
                                  >
                                    {isProcessing ? "Rejecting..." : "Reject Leave"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}