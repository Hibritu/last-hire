import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Edit, 
  Eye, 
  MoreHorizontal,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JobService } from "@/services/jobService";
import { useToast } from "@/hooks/use-toast";

export function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch real jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsData = await JobService.getEmployerJobs();
        setJobs(jobsData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setError('Failed to load jobs');
        setJobs([]);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleJobAction = (action: string, jobId: string) => {
    toast({
      title: `Job ${action}`,
      description: `Job has been ${action.toLowerCase()} successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'expired':
        return 'bg-destructive text-destructive-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <p className="text-muted-foreground">
            Manage your job postings and track applications
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
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
                <SelectItem value="all">All Jobs</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleJobAction('View', job.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleJobAction('Edit', job.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleJobAction('Close', job.id)}
                      className="text-destructive"
                    >
                      Close Job
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {job.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Category: {job.category}
                    </span>
                    {job.salary && (
                      <span className="text-sm font-medium">
                        {job.salary}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {job.applicationsCount} applications
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires: {new Date(job.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleJobAction('View Applications', job.id)}
                  >
                    <Users className="mr-2 h-3 w-3" />
                    View Applications ({job.applicationsCount})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleJobAction('Edit', job.id)}
                  >
                    <Edit className="mr-2 h-3 w-3" />
                    Edit Job
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No jobs found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Try adjusting your filters to see more results."
                    : "You haven't posted any jobs yet. Create your first job posting!"
                  }
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Post Your First Job
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}