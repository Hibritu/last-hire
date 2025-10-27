import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  Calendar, 
  Search, 
  Download, 
  ExternalLink,
  Plus,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock payment data
const mockPayments = [
  {
    id: '1',
    jobTitle: 'Senior Software Developer',
    amount: 100,
    currency: 'ETB',
    status: 'completed',
    paymentMethod: 'Chapa',
    transactionId: 'TXN_001',
    date: '2024-11-01T10:30:00',
    receipt: 'receipt_001.pdf'
  },
  {
    id: '2',
    jobTitle: 'Marketing Manager',
    amount: 100,
    currency: 'ETB',
    status: 'completed',
    paymentMethod: 'Chapa',
    transactionId: 'TXN_002',
    date: '2024-10-28T14:15:00',
    receipt: 'receipt_002.pdf'
  },
  {
    id: '3',
    jobTitle: 'UI/UX Designer',
    amount: 100,
    currency: 'ETB',
    status: 'pending',
    paymentMethod: 'Chapa',
    transactionId: 'TXN_003',
    date: '2024-11-06T09:00:00',
    receipt: null
  }
];

interface PaymentsPageProps {
  onTabChange?: (tab: string) => void;
}

export function PaymentsPage({ onTabChange }: PaymentsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = mockPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleDownloadReceipt = (paymentId: string) => {
    toast({
      title: "Downloading Receipt",
      description: "Your payment receipt is being downloaded.",
    });
    // In a real app, this would trigger a file download
  };

  const handleRetryPayment = (paymentId: string) => {
    toast({
      title: "Redirecting to Payment",
      description: "You'll be redirected to complete the payment.",
    });
    // In a real app, this would redirect to payment gateway
  };

  const handlePostNewJob = () => {
    if (onTabChange) {
      onTabChange('post-job');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Track your job listing payments and transactions
          </p>
        </div>
        <Button onClick={handlePostNewJob}>
          <Plus className="mr-2 h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {/* Payment Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <div className="p-2 rounded-full bg-success/10">
              <CreditCard className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmount} ETB</div>
            <p className="text-xs text-muted-foreground">
              Completed payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="p-2 rounded-full bg-warning/10">
              <Clock className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAmount} ETB</div>
            <p className="text-xs text-muted-foreground">
              Pending payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <div className="p-2 rounded-full bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmount} ETB</div>
            <p className="text-xs text-muted-foreground">
              Current month spending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{payment.jobTitle}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(payment.date).toLocaleDateString()}
                    </span>
                    <span>ID: {payment.transactionId}</span>
                    <span>via {payment.paymentMethod}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {payment.amount} {payment.currency}
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    {payment.status === 'completed' && payment.receipt && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReceipt(payment.id)}
                      >
                        <Download className="mr-2 h-3 w-3" />
                        Receipt
                      </Button>
                    )}
                    
                    {payment.status === 'pending' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleRetryPayment(payment.id)}
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Complete Payment
                      </Button>
                    )}
                    
                    {payment.status === 'failed' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRetryPayment(payment.id)}
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Retry Payment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No payments found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all'
                    ? "Try adjusting your filters to see more results."
                    : "You haven't made any payments yet. Post a job to get started!"
                  }
                </p>
              </div>
              <Button onClick={handlePostNewJob}>
                <Plus className="mr-2 h-4 w-4" />
                Post Your First Job
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            Important information about job listing payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Premium Job Listing</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Enhanced visibility in search results</li>
                <li>• Featured placement on job board</li>
                <li>• 2-week listing duration</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Payment Methods</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Chapa payment gateway</li>
                <li>• Secure payment processing</li>
                <li>• Multiple payment options</li>
                <li>• Instant payment confirmation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}