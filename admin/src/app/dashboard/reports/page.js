"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Building2,
  FileText,
  Calendar,
  Download,
  Shield,
  Ban,
  MessageSquare
} from "lucide-react";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const reports = [
    {
      id: 1,
      type: "Suspicious Job Posting",
      description: "Job posting with suspicious contact information and unrealistic salary",
      reportedBy: "user@example.com",
      reportedUser: "Tech Solutions Ethiopia",
      userType: "employer",
      status: "Under Review",
      priority: "High",
      reportedDate: "2024-01-20",
      evidence: ["Screenshot of job posting", "Email communication"],
      category: "Fraud",
      location: "Addis Ababa"
    },
    {
      id: 2,
      type: "Fake Employer Account",
      description: "Employer account with fake business license and suspicious activity",
      reportedBy: "moderator@hirehub.et",
      reportedUser: "Digital Marketing Pro",
      userType: "employer",
      status: "Pending Action",
      priority: "Critical",
      reportedDate: "2024-01-22",
      evidence: ["Business license verification failed", "Multiple complaints"],
      category: "Identity Fraud",
      location: "Bahir Dar"
    },
    {
      id: 3,
      type: "Inappropriate Content",
      description: "Job description contains inappropriate language and discriminatory requirements",
      reportedBy: "user@example.com",
      reportedUser: "Construction Plus Ltd",
      userType: "employer",
      status: "Resolved",
      priority: "Medium",
      reportedDate: "2024-01-18",
      evidence: ["Job posting screenshot", "User complaint"],
      category: "Policy Violation",
      location: "Mekelle"
    },
    {
      id: 4,
      type: "Spam Job Applications",
      description: "User sending multiple irrelevant applications to all job postings",
      reportedBy: "employer@company.et",
      reportedUser: "Abebe Kebede",
      userType: "jobseeker",
      status: "Under Review",
      priority: "Medium",
      reportedDate: "2024-01-21",
      evidence: ["Application logs", "Employer complaints"],
      category: "Spam",
      location: "Hawassa"
    },
    {
      id: 5,
      type: "Fake Job Seeker Profile",
      description: "Job seeker profile with fake qualifications and experience",
      reportedBy: "employer@company.et",
      reportedUser: "Tigist Haile",
      userType: "jobseeker",
      status: "Pending Action",
      priority: "High",
      reportedDate: "2024-01-19",
      evidence: ["Profile verification failed", "Document mismatch"],
      category: "Identity Fraud",
      location: "Gondar"
    }
  ];

  const filteredReports = reports.filter(report =>
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Under Review":
        return <Badge variant="secondary">Under Review</Badge>;
      case "Pending Action":
        return <Badge variant="default">Pending Action</Badge>;
      case "Resolved":
        return <Badge variant="outline">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "High":
        return <Badge variant="default">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "Low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case "Fraud":
        return <Badge variant="destructive">Fraud</Badge>;
      case "Identity Fraud":
        return <Badge variant="destructive">Identity Fraud</Badge>;
      case "Policy Violation":
        return <Badge variant="default">Policy Violation</Badge>;
      case "Spam":
        return <Badge variant="secondary">Spam</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const handleReportAction = (action, reportId) => {
    console.log(`${action} report ${reportId}`);
    // Implement actual actions here
  };

  const getReportsByStatus = (status) => {
    if (status === "all") return filteredReports;
    return filteredReports.filter(report => report.status === status);
  };

  const pendingReports = reports.filter(r => r.status === "Pending Action").length;
  const underReviewReports = reports.filter(r => r.status === "Under Review").length;
  const resolvedReports = reports.filter(r => r.status === "Resolved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Moderation</h1>
          <p className="text-gray-600">Review and manage suspicious activity reports</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Action</p>
                <p className="text-2xl font-bold text-gray-900">{pendingReports}</p>
              </div>
              <div className="p-3 rounded-full bg-red-500">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Badge variant="destructive" className="text-xs">
                Requires immediate attention
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{underReviewReports}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Badge variant="secondary" className="text-xs">
                Being investigated
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{resolvedReports}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Badge variant="outline" className="text-xs">
                Successfully handled
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reports by type, description, or reported user..."
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

      {/* Reports Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({filteredReports.length})
          </TabsTrigger>
          <TabsTrigger value="Pending Action">
            Pending ({getReportsByStatus("Pending Action").length})
          </TabsTrigger>
          <TabsTrigger value="Under Review">
            Under Review ({getReportsByStatus("Under Review").length})
          </TabsTrigger>
          <TabsTrigger value="Resolved">
            Resolved ({getReportsByStatus("Resolved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>All suspicious activity and policy violation reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reported User</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getReportsByStatus(activeTab).map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <div className="font-medium">{report.type}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {report.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(report.category)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/avatars/${report.userType}.jpg`} alt={report.reportedUser} />
                            <AvatarFallback>
                              {report.userType === "employer" ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{report.reportedUser}</div>
                            <div className="text-sm text-gray-500 capitalize">{report.userType}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(report.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(report.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {report.reportedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          {report.status === "Pending Action" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleReportAction('resolve', report.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReportAction('ban', report.id)}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Ban User
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

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Complete information about the selected report</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedReport.type}</h3>
                  <p className="text-gray-600">Reported by {selectedReport.reportedBy}</p>
                  {getPriorityBadge(selectedReport.priority)}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Report Description</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedReport.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Report Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <div className="mt-1">{getCategoryBadge(selectedReport.category)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reported Date</label>
                      <p className="text-sm">{selectedReport.reportedDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-sm">{selectedReport.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Reported User</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm">{selectedReport.reportedUser}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-sm capitalize">{selectedReport.userType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reporter</label>
                      <p className="text-sm">{selectedReport.reportedBy}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Evidence & Documentation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReport.evidence.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">{item}</span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                {selectedReport.status === "Pending Action" && (
                  <Button variant="default" onClick={() => handleReportAction('resolve', selectedReport.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </Button>
                )}
                <Button variant="outline" onClick={() => handleReportAction('investigate', selectedReport.id)}>
                  <Shield className="h-4 w-4 mr-2" />
                  Start Investigation
                </Button>
                <Button variant="outline" onClick={() => handleReportAction('contact', selectedReport.id)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Reporter
                </Button>
                <Button variant="destructive" onClick={() => handleReportAction('ban', selectedReport.id)}>
                  <Ban className="h-4 w-4 mr-2" />
                  Ban User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}