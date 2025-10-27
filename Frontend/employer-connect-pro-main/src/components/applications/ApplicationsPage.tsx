import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Search, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Check, 
  X, 
  Eye,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from "lucide-react";
import { JobService } from "@/services/jobService";
import { useToast } from "@/hooks/use-toast";

interface ApplicationsPageProps {
  onTabChange?: (tab: string) => void;
}

export function ApplicationsPage({ onTabChange }: ApplicationsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  // Fetch real applications and jobs from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [applicationsData, jobsData] = await Promise.all([
          JobService.getAllApplications(),
          JobService.getEmployerJobs()
        ]);
        setApplications(applicationsData);
        setJobs(jobsData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load applications:', err);
        setError('Failed to load applications');
        setApplications([]);
        setJobs([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredApplications = applications.filter((application: any) => {
    const candidateName = application.candidateName || application.applicant_name || '';
    const candidateEmail = application.candidateEmail || application.email || '';
    const matchesSearch = candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidateEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    const matchesJob = jobFilter === 'all' || application.jobId === jobFilter || application.job_id === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const handleViewProfile = (application: any) => {
    console.log('👤 [APPLICATIONS] Opening profile for:', application);
    setSelectedApplication(application);
    setViewProfileOpen(true);
  };

  const handleDownloadResume = (application: any) => {
    if (application.resume) {
      // If resume is a URL, open it in a new tab
      if (application.resume.startsWith('http')) {
        window.open(application.resume, '_blank');
      } else {
        // If it's a file path, try to download it
        window.open(`http://localhost:4000/uploads/resumes/${application.resume}`, '_blank');
      }
      toast({
        title: "Resume",
        description: `Opening ${application.candidateName}'s resume.`,
      });
    } else {
      toast({
        title: "No Resume",
        description: "This applicant hasn't uploaded a resume.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = (application: any) => {
    if (onTabChange) {
      onTabChange('chat');
      toast({
        title: "Message",
        description: `Opening chat with ${application.candidateName}.`,
      });
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      console.log('🔄 [APPLICATIONS] Updating status:', applicationId, 'to', newStatus);
      
      // Call backend API to update status
      const response = await fetch(`http://localhost:4000/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hirehub_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setApplications(prev => prev.map((app: any) => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));

      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}.`,
      });
      
      console.log('✅ [APPLICATIONS] Status updated successfully');
    } catch (error) {
      console.error('❌ [APPLICATIONS] Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'shortlisted':
        return 'bg-warning text-warning-foreground';
      case 'pending':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find((j: any) => j.id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">
            Review and manage job applications from candidates
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map((job: any) => (
                  <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {(application.candidateName || 'U').split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{application.candidateName}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div>{application.candidateEmail}</div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                        <span className="font-medium">
                          {getJobTitle(application.jobId)}
                        </span>
                      </div>
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(application)}>
                    <Eye className="mr-2 h-3 w-3" />
                    View Profile & Cover Letter
                  </Button>
                  {application.resume && (
                    <Button variant="outline" size="sm" onClick={() => handleDownloadResume(application)}>
                      <Download className="mr-2 h-3 w-3" />
                      Download Resume
                    </Button>
                  )}
                  {(application.status === 'shortlisted' || application.status === 'accepted') && (
                    <Button variant="outline" size="sm" onClick={() => handleSendMessage(application)}>
                      <MessageSquare className="mr-2 h-3 w-3" />
                      Send Message
                    </Button>
                  )}
                </div>

                {/* Status Change Actions */}
                {application.status === 'submitted' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(application.id, 'shortlisted')}
                      disabled={updatingStatus}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Shortlist
                    </Button>
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={() => handleStatusChange(application.id, 'accepted')}
                      disabled={updatingStatus}
                    >
                      <Check className="mr-2 h-3 w-3" />
                      Accept
                    </Button>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusChange(application.id, 'rejected')}
                      disabled={updatingStatus}
                    >
                      <X className="mr-2 h-3 w-3" />
                      Reject
                    </Button>
                  </div>
                )}

                {application.status === 'shortlisted' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={() => handleStatusChange(application.id, 'accepted')}
                      disabled={updatingStatus}
                    >
                      <Check className="mr-2 h-3 w-3" />
                      Accept
                    </Button>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusChange(application.id, 'rejected')}
                      disabled={updatingStatus}
                    >
                      <X className="mr-2 h-3 w-3" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No applications found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || jobFilter !== 'all'
                    ? "Try adjusting your filters to see more results."
                    : "You don't have any applications yet. Post a job to start receiving applications!"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile View Dialog */}
      <Dialog open={viewProfileOpen} onOpenChange={setViewProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Application Details</DialogTitle>
            <DialogDescription>
              Full application profile and cover letter
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">
                      {(selectedApplication.candidateName || 'U').split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-2xl font-semibold">{selectedApplication.candidateName}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${selectedApplication.candidateEmail}`} className="hover:underline">
                          {selectedApplication.candidateEmail}
                        </a>
                      </div>
                      {selectedApplication.applicant_phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{selectedApplication.applicant_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedApplication.status)} variant="outline">
                    {selectedApplication.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Applied For</p>
                    <p className="font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {selectedApplication.jobTitle || getJobTitle(selectedApplication.jobId)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedApplication.job_location || 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Applied Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Employment Type</p>
                    <p className="font-medium">
                      {selectedApplication.employment_type || 'Full-time'}
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Cover Letter Tab */}
              <TabsContent value="cover-letter" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Cover Letter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedApplication.coverLetter ? (
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {selectedApplication.coverLetter}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No cover letter provided with this application.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Attached Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedApplication.resume ? (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">Resume</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded on {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownloadResume(selectedApplication)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          View Resume
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic p-4">
                        No resume uploaded with this application.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setViewProfileOpen(false)}>
              Close
            </Button>
            {selectedApplication && selectedApplication.status === 'submitted' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleStatusChange(selectedApplication.id, 'shortlisted');
                    setViewProfileOpen(false);
                  }}
                  disabled={updatingStatus}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Shortlist
                </Button>
                <Button 
                  onClick={() => {
                    handleStatusChange(selectedApplication.id, 'accepted');
                    setViewProfileOpen(false);
                  }}
                  disabled={updatingStatus}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Accept Application
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}