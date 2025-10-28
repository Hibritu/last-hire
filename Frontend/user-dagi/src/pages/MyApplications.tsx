import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, MapPin, Building, Search, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { applicationService } from "@/services/apiServices";

const MyApplications = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  // Fetch real applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await applicationService.getMyApplications();
        setApplications(data || []);
        setLoading(false);
        setNeedsAuth(false);
      } catch (err: any) {
        console.error('Failed to load applications:', err);
        
        // Check if it's an authentication error
        if (err?.response?.status === 401 || err?.message?.includes('401')) {
          setNeedsAuth(true);
          setError('Please log in to view your applications');
        } else {
          setError('Failed to load applications');
        }
        
        setApplications([]);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const statusConfig = {
    submitted: { 
      label: "Submitted", 
      icon: Clock, 
      color: "bg-blue-500", 
      bgColor: "bg-blue-50 text-blue-700 border-blue-200" 
    },
    shortlisted: { 
      label: "Shortlisted", 
      icon: AlertCircle, 
      color: "bg-yellow-500", 
      bgColor: "bg-yellow-50 text-yellow-700 border-yellow-200" 
    },
    accepted: { 
      label: "Accepted", 
      icon: CheckCircle, 
      color: "bg-green-500", 
      bgColor: "bg-green-50 text-green-700 border-green-200" 
    },
    rejected: { 
      label: "Rejected", 
      icon: XCircle, 
      color: "bg-red-500", 
      bgColor: "bg-red-50 text-red-700 border-red-200" 
    }
  };

  const filteredApplications = useMemo(() => {
    let filtered = applications.filter((app: any) => {
      const jobTitle = app.jobTitle || app.job_title || '';
      const company = app.company || app.employer_name || '';
      
      const matchesSearch = searchValue === "" || 
        jobTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
        company.toLowerCase().includes(searchValue.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort applications
    switch (sortBy) {
      case "date_desc":
        filtered.sort((a: any, b: any) => {
          const dateA = new Date(a.appliedAt || a.applied_at || a.created_at || 0).getTime();
          const dateB = new Date(b.appliedAt || b.applied_at || b.created_at || 0).getTime();
          return dateB - dateA;
        });
        break;
      case "date_asc":
        filtered.sort((a: any, b: any) => {
          const dateA = new Date(a.appliedAt || a.applied_at || a.created_at || 0).getTime();
          const dateB = new Date(b.appliedAt || b.applied_at || b.created_at || 0).getTime();
          return dateA - dateB;
        });
        break;
      case "company":
        filtered.sort((a: any, b: any) => {
          const companyA = a.company || a.employer_name || '';
          const companyB = b.company || b.employer_name || '';
          return companyA.localeCompare(companyB);
        });
        break;
      case "status":
        filtered.sort((a: any, b: any) => (a.status || '').localeCompare(b.status || ''));
        break;
      default:
        break;
    }

    return filtered;
  }, [applications, searchValue, statusFilter, sortBy]);

  const handleWithdraw = (applicationId: string, jobTitle: string) => {
    toast({
      title: "Application Withdrawn",
      description: `Your application for ${jobTitle} has been withdrawn.`,
    });
    // In real app, make API call to withdraw application
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to normalize application data from backend
  const normalizeApp = (app: any) => ({
    id: app.id,
    jobTitle: app.jobTitle || app.job_title || 'N/A',
    company: app.company || app.employer_name || 'Unknown Company',
    location: app.location || 'Not specified',
    appliedAt: app.appliedAt || app.applied_at || app.created_at || new Date().toISOString(),
    status: app.status || 'submitted',
    salary: app.salary || app.salary_range || null,
    employment_type: app.employment_type || app.employmentType || 'full_time',
    notes: app.notes || null
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">My Applications</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Track your job applications and their progress
          </p>
        </div>

        {/* Auth Required Message */}
        {needsAuth && (
          <Dialog open={needsAuth} onOpenChange={() => setNeedsAuth(false)}>
            <DialogContent>
              <DialogTitle>Authentication Required</DialogTitle>
              <DialogDescription>
                Please log in to view your job applications
              </DialogDescription>
              <Card className="border-0 shadow-none">
                <CardContent className="p-4 text-center">
                  <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Login to Continue</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to be logged in to view your applications
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={() => window.location.href = 'http://localhost:3002/login?from=job-seeker'}
                      className="bg-primary"
                    >
                      Go to Login
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/'}
                    >
                      Browse Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        )}

        {/* Stats Summary */}
        {!needsAuth && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{applications.length}</div>
                  <div className="text-sm text-muted-foreground">Total Applications</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {applications.filter(app => app.status === 'submitted').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Submitted</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {applications.filter(app => app.status === 'shortlisted').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Shortlisted</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {applications.filter(app => app.status === 'accepted').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Accepted</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search applications by job title or company..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Latest First</SelectItem>
                  <SelectItem value="date_asc">Oldest First</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchValue || statusFilter !== "All" 
                ? "No applications match your current search criteria. Try adjusting your filters."
                : "You haven't submitted any job applications yet. Start browsing jobs to find opportunities!"
              }
            </p>
            <Button onClick={() => {
              setSearchValue("");
              setStatusFilter("All");
            }}>
              {searchValue || statusFilter !== "All" ? "Clear Filters" : "Browse Jobs"}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const application = normalizeApp(app);
              const status = application.status as keyof typeof statusConfig;
              
              return (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{application.jobTitle}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 text-base">
                          <Building className="w-4 h-4" />
                          <span>{application.company}</span>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={statusConfig[status]?.bgColor || "bg-gray-50 text-gray-700"}>
                          {statusConfig[status]?.label || status}
                        </Badge>
                        {application.status === 'submitted' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleWithdraw(application.id, application.jobTitle)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{application.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Applied on {formatDate(application.appliedAt)}</span>
                      </div>
                    </div>

                    {application.salary && (
                      <div className="text-lg font-semibold text-primary">
                        {application.salary}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="outline">{application.employment_type.replace('_', '-')}</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {application.status === 'accepted' && (
                          <Button size="sm">
                            Accept Offer
                          </Button>
                        )}
                      </div>
                    </div>

                    {application.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-1">Update from employer:</p>
                        <p className="text-sm text-muted-foreground">{application.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyApplications;