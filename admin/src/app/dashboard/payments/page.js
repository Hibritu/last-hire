"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Download,
  Mail,
  Calendar,
  Building2,
  User,
  Receipt
} from "lucide-react";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const payments = [
    {
      id: 1,
      employer: "Tech Solutions Ethiopia",
      employerEmail: "alemayehu@techsolutions.et",
      jobTitle: "Senior Software Engineer",
      amount: 299.99,
      currency: "USD",
      status: "Completed",
      paymentMethod: "Credit Card",
      transactionId: "TXN-2024-001",
      date: "2024-01-20",
      type: "Premium Job Posting",
      duration: "30 days",
      invoiceNumber: "INV-2024-001"
    },
    {
      id: 2,
      employer: "Green Agriculture Co.",
      employerEmail: "martha@greenag.et",
      jobTitle: "Agricultural Specialist",
      amount: 199.99,
      currency: "USD",
      status: "Completed",
      paymentMethod: "PayPal",
      transactionId: "TXN-2024-002",
      date: "2024-01-18",
      type: "Premium Job Posting",
      duration: "30 days",
      invoiceNumber: "INV-2024-002"
    },
    {
      id: 3,
      employer: "Construction Plus Ltd",
      employerEmail: "dereje@constructionplus.et",
      jobTitle: "Project Manager",
      amount: 399.99,
      currency: "USD",
      status: "Pending",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN-2024-003",
      date: "2024-01-22",
      type: "Premium Job Posting",
      duration: "60 days",
      invoiceNumber: "INV-2024-003"
    },
    {
      id: 4,
      employer: "Digital Marketing Agency",
      employerEmail: "bethel@digitalmarketing.et",
      jobTitle: "Marketing Manager",
      amount: 149.99,
      currency: "USD",
      status: "Failed",
      paymentMethod: "Credit Card",
      transactionId: "TXN-2024-004",
      date: "2024-01-21",
      type: "Premium Job Posting",
      duration: "30 days",
      invoiceNumber: "INV-2024-004"
    },
    {
      id: 5,
      employer: "Healthcare Services",
      employerEmail: "yohannes@healthcare.et",
      jobTitle: "Medical Doctor",
      amount: 249.99,
      currency: "USD",
      status: "Refunded",
      paymentMethod: "Credit Card",
      transactionId: "TXN-2024-005",
      date: "2024-01-19",
      type: "Premium Job Posting",
      duration: "30 days",
      invoiceNumber: "INV-2024-005"
    }
  ];

  const filteredPayments = payments.filter(payment =>
    payment.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default">Completed</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "Refunded":
        return <Badge variant="outline">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePaymentAction = (action, paymentId) => {
    console.log(`${action} payment ${paymentId}`);
    // Implement actual actions here
  };

  const getPaymentsByStatus = (status) => {
    if (status === "all") return filteredPayments;
    return filteredPayments.filter(payment => payment.status === status);
  };

  const totalRevenue = payments
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedAmount = payments
    .filter(p => p.status === "Refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-gray-600">Track premium job payments and manage billing</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Badge variant="default" className="text-xs">
                +12%
              </Badge>
              <span className="ml-2 text-xs text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">${pendingAmount.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Badge variant="secondary" className="text-xs">
                {payments.filter(p => p.status === "Pending").length} payments
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refunded Amount</p>
                <p className="text-2xl font-bold text-gray-900">${refundedAmount.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-red-500">
                <XCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Badge variant="outline" className="text-xs">
                {payments.filter(p => p.status === "Refunded").length} refunds
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
                  placeholder="Search payments by employer, job title, or transaction ID..."
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

      {/* Payment Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({filteredPayments.length})
          </TabsTrigger>
          <TabsTrigger value="Completed">
            Completed ({getPaymentsByStatus("Completed").length})
          </TabsTrigger>
          <TabsTrigger value="Pending">
            Pending ({getPaymentsByStatus("Pending").length})
          </TabsTrigger>
          <TabsTrigger value="Failed">
            Failed ({getPaymentsByStatus("Failed").length})
          </TabsTrigger>
          <TabsTrigger value="Refunded">
            Refunded ({getPaymentsByStatus("Refunded").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>All payment transactions for premium job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employer</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPaymentsByStatus(activeTab).map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{payment.employer}</div>
                            <div className="text-sm text-gray-500">{payment.employerEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{payment.jobTitle}</div>
                          <div className="text-gray-500">{payment.type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{payment.currency} {payment.amount}</div>
                          <div className="text-gray-500">{payment.duration}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{payment.paymentMethod}</div>
                          <div className="text-gray-500">{payment.transactionId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {payment.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePaymentAction('refund', payment.id)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Process Refund
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePaymentAction('invoice', payment.id)}>
                              <Receipt className="h-4 w-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePaymentAction('contact', payment.id)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Contact Employer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Complete payment transaction information</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedPayment.employer}</h3>
                  <p className="text-gray-600">{selectedPayment.employerEmail}</p>
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Job Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Job Title</label>
                      <p className="text-sm">{selectedPayment.jobTitle}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-sm">{selectedPayment.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-sm">{selectedPayment.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Payment Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Amount</label>
                      <p className="text-sm font-bold">{selectedPayment.currency} {selectedPayment.amount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Method</label>
                      <p className="text-sm">{selectedPayment.paymentMethod}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                      <p className="text-sm font-mono">{selectedPayment.transactionId}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Additional Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-sm">{selectedPayment.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Invoice Number</label>
                    <p className="text-sm font-mono">{selectedPayment.invoiceNumber}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                {selectedPayment.status === "Completed" && (
                  <Button variant="outline" onClick={() => handlePaymentAction('refund', selectedPayment.id)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Process Refund
                  </Button>
                )}
                <Button variant="outline" onClick={() => handlePaymentAction('invoice', selectedPayment.id)}>
                  <Receipt className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" onClick={() => handlePaymentAction('contact', selectedPayment.id)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Employer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}