"use client";

import { useState, useEffect } from "react";
import { AdminService } from "@/services/adminService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  FileText,
  Shield,
  AlertTriangle,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink
} from "lucide-react";

export default function EmployerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllEmployers({ limit: 100 });
      // Transform data to match component expectations
      const transformedEmployers = (data.employers || []).map(emp => ({
        id: emp.id,
        companyName: emp.employerProfile?.company_name || 'Unknown Company',
        contactPerson: `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'Unknown',
        email: emp.email,
        phone: emp.phone || 'Not provided',
        location: emp.employerProfile?.location || 'Not specified',
        status: emp.is_verified ? "Approved" : "Pending",
        businessType: emp.employerProfile?.type || 'Not specified',
        licenseNumber: emp.employerProfile?.business_license || 'N/A',
        licenseExpiry: emp.employerProfile?.license_expiry || 'N/A',
        documents: ["Business License", "Tax Certificate"],
        submittedDate: new Date(emp.created_at).toLocaleDateString(),
        avatar: emp.profile_picture || "",
        totalJobs: emp.totalJobs || 0,
        activeJobs: emp.activeJobs || 0
      }));
      setEmployers(transformedEmployers);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch employers:', error);
      setLoading(false);
    }
  };

  const handleEmployerAction = async (action, employerId) => {
    try {
      setActionLoading(true);
      let status = action;
      
      if (action === 'approve') status = 'approved';
      if (action === 'reject') status = 'rejected';
      if (action === 'suspend') status = 'suspended';
      if (action === 'reactivate') status = 'approved';

      await AdminService.verifyEmployer(employerId, status);
      
      // Refresh employers list
      await fetchEmployers();
      setActionLoading(false);
      alert(`Employer ${action}ed successfully`);
    } catch (error) {
      console.error(`Failed to ${action} employer:`, error);
      setActionLoading(false);
      alert(`Failed to ${action} employer`);
    }
  };

  // Keep original mock data as fallback for demonstration
  const mockEmployers = [
    {
      id: 1,
      companyName: "Tech Solutions Ethiopia",
      contactPerson: "Alemayehu Tadesse",
      email: "alemayehu@techsolutions.et",
      phone: "+251 911 123 456",
      location: "Addis Ababa",
      status: "Pending",
      businessType: "Technology",
      licenseNumber: "ET-BUS-2024-001",
      licenseExpiry: "2025-12-31",
      documents: ["Business License", "Tax Certificate", "National ID"],
      submittedDate: "2024-01-20",
      avatar: "/avatars/company1.jpg"
    },
    {
      id: 2,
      companyName: "Green Agriculture Co.",
      contactPerson: "Martha Haile",
      email: "martha@greenag.et",
      phone: "+251 922 234 567",
      location: "Bahir Dar",
      status: "Approved",
      businessType: "Agriculture",
      licenseNumber: "ET-BUS-2024-002",
      licenseExpiry: "2026-03-15",
      documents: ["Business License", "Tax Certificate", "National ID"],
      submittedDate: "2024-01-18",
      avatar: "/avatars/company2.jpg"
    },
    {
      id: 3,
      companyName: "Construction Plus Ltd",
      contactPerson: "Dereje Mengistu",
      email: "dereje@constructionplus.et",
      phone: "+251 933 345 678",
      location: "Mekelle",
      status: "Rejected",
      businessType: "Construction",
      licenseNumber: "ET-BUS-2024-003",
      licenseExpiry: "2024-11-30",
      documents: ["Business License", "Tax Certificate"],
      submittedDate: "2024-01-15",
      avatar: "/avatars/company3.jpg"
    },
    {
      id: 4,
      companyName: "Digital Marketing Agency",
      contactPerson: "Bethel Alemu",
      email: "bethel@digitalmarketing.et",
      phone: "+251 944 456 789",
      location: "Hawassa",
      status: "Pending",
      businessType: "Marketing",
      licenseNumber: "ET-BUS-2024-004",
      licenseExpiry: "2025-08-20",
      documents: ["Business License", "National ID"],
      submittedDate: "2024-01-22",
      avatar: "/avatars/company4.jpg"
    },
    {
      id: 5,
      companyName: "Healthcare Services",
      contactPerson: "Dr. Yohannes Kebede",
      email: "yohannes@healthcare.et",
      phone: "+251 955 567 890",
      location: "Gondar",
      status: "Suspended",
      businessType: "Healthcare",
      licenseNumber: "ET-BUS-2024-005",
      licenseExpiry: "2025-06-10",
      documents: ["Business License", "Medical License", "Tax Certificate"],
      submittedDate: "2024-01-10",
      avatar: "/avatars/company5.jpg"
    }
  ];

  const filteredEmployers = employers.filter(employer =>
    employer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge variant="default">Approved</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "Suspended":
        return <Badge variant="outline">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEmployersByStatus = (status) => {
    return filteredEmployers.filter(employer => employer.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employer Management</h1>
          <p className="text-gray-600">Verify and manage employer accounts and business licenses</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search employers by company name, contact person, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({getEmployersByStatus("Pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({getEmployersByStatus("Approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({getEmployersByStatus("Rejected").length})
          </TabsTrigger>
          <TabsTrigger value="suspended">
            Suspended ({getEmployersByStatus("Suspended").length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification</CardTitle>
              <CardDescription>Employers awaiting document verification and approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getEmployersByStatus("Pending").map((employer) => (
                    <TableRow key={employer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={employer.avatar} alt={employer.companyName} />
                            <AvatarFallback>{employer.companyName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employer.companyName}</div>
                            <div className="text-sm text-gray-500">{employer.contactPerson}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {employer.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {employer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{employer.businessType}</div>
                          <div className="text-gray-500">{employer.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{employer.documents.length} documents</div>
                          <div className="text-gray-500">{employer.documents.join(", ")}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {employer.submittedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEmployer(employer)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleEmployerAction('approve', employer.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleEmployerAction('reject', employer.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approved Tab */}
        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Employers</CardTitle>
              <CardDescription>Verified and approved employer accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>License Info</TableHead>
                    <TableHead>Approval Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getEmployersByStatus("Approved").map((employer) => (
                    <TableRow key={employer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={employer.avatar} alt={employer.companyName} />
                            <AvatarFallback>{employer.companyName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employer.companyName}</div>
                            <div className="text-sm text-gray-500">{employer.contactPerson}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{employer.email}</div>
                          <div className="text-sm text-gray-500">{employer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{employer.licenseNumber}</div>
                          <div className="text-gray-500">Expires: {employer.licenseExpiry}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {employer.submittedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEmployer(employer)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleEmployerAction('suspend', employer.id)}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Suspend
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rejected Tab */}
        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Applications</CardTitle>
              <CardDescription>Employer applications that were rejected during verification</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Rejection Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getEmployersByStatus("Rejected").map((employer) => (
                    <TableRow key={employer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={employer.avatar} alt={employer.companyName} />
                            <AvatarFallback>{employer.companyName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employer.companyName}</div>
                            <div className="text-sm text-gray-500">{employer.contactPerson}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{employer.email}</div>
                          <div className="text-sm text-gray-500">{employer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-red-600">
                          Incomplete documentation
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {employer.submittedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEmployer(employer)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleEmployerAction('reconsider', employer.id)}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Reconsider
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suspended Tab */}
        <TabsContent value="suspended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suspended Accounts</CardTitle>
              <CardDescription>Employer accounts that have been temporarily suspended</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Suspension Reason</TableHead>
                    <TableHead>Suspension Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getEmployersByStatus("Suspended").map((employer) => (
                    <TableRow key={employer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={employer.avatar} alt={employer.companyName} />
                            <AvatarFallback>{employer.companyName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employer.companyName}</div>
                            <div className="text-sm text-gray-500">{employer.contactPerson}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{employer.email}</div>
                          <div className="text-sm text-gray-500">{employer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-red-600">
                          Policy violation
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {employer.submittedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEmployer(employer)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleEmployerAction('reactivate', employer.id)}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Reactivate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employer Detail Dialog */}
      <Dialog open={!!selectedEmployer} onOpenChange={() => setSelectedEmployer(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Employer Details</DialogTitle>
            <DialogDescription>Complete information and documents for verification</DialogDescription>
          </DialogHeader>
          {selectedEmployer && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedEmployer.avatar} alt={selectedEmployer.companyName} />
                  <AvatarFallback className="text-2xl">
                    {selectedEmployer.companyName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedEmployer.companyName}</h3>
                  <p className="text-gray-600">{selectedEmployer.contactPerson}</p>
                  {getStatusBadge(selectedEmployer.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Company Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Type</label>
                      <p className="text-sm">{selectedEmployer.businessType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-sm">{selectedEmployer.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">License Number</label>
                      <p className="text-sm">{selectedEmployer.licenseNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">License Expiry</label>
                      <p className="text-sm">{selectedEmployer.licenseExpiry}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm">{selectedEmployer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm">{selectedEmployer.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted Date</label>
                      <p className="text-sm">{selectedEmployer.submittedDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Documents Submitted</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedEmployer.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">{doc}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                {selectedEmployer.status === "Pending" && (
                  <>
                    <Button variant="default" onClick={() => handleEmployerAction('approve', selectedEmployer.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Account
                    </Button>
                    <Button variant="destructive" onClick={() => handleEmployerAction('reject', selectedEmployer.id)}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </>
                )}
                {selectedEmployer.status === "Approved" && (
                  <Button variant="destructive" onClick={() => handleEmployerAction('suspend', selectedEmployer.id)}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Suspend Account
                  </Button>
                )}
                {selectedEmployer.status === "Suspended" && (
                  <Button variant="default" onClick={() => handleEmployerAction('reactivate', selectedEmployer.id)}>
                    <Shield className="h-4 w-4 mr-2" />
                    Reactivate Account
                  </Button>
                )}
                <Button variant="outline" onClick={() => handleEmployerAction('contact', selectedEmployer.id)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}