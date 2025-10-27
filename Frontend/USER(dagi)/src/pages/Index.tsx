import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModernSearch } from "@/components/ModernSearch";
import { ModernFilters } from "@/components/ModernFilters";
import { ModernJobCard } from "@/components/ModernJobCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, TrendingUp, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as apiServices from '@/services/apiServices';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Jobs");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const categories = ["All Jobs", "Frontend", "Backend", "Full Stack", "Design", "DevOps"];

  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [regularJobs, setRegularJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Active Jobs", value: "...", icon: Briefcase, color: "text-primary" },
    { label: "New This Week", value: "...", icon: TrendingUp, color: "text-success" },
    { label: "Remote Jobs", value: "...", icon: Zap, color: "text-accent" },
  ]);

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if backend is available
        const isBackendAvailable = await apiServices.mockService.checkBackendAvailability();
        
      if (isBackendAvailable) {
        // Fetch real data
        const [featuredResponse, allJobsResponse, categoriesResponse] = await Promise.all([
          apiServices.jobService.getFeaturedJobs(6),
          apiServices.jobService.searchJobs({ location: '', limit: 100 }), // Get all jobs with high limit
          apiServices.jobService.getJobCategories()
        ]);
          
          // apiWrapper already extracts the data, so response is the array directly
          console.log('Featured jobs loaded:', featuredResponse);
          console.log('All jobs loaded:', allJobsResponse);
          const featuredArray = Array.isArray(featuredResponse) ? featuredResponse : [];
          const allJobsArray = Array.isArray(allJobsResponse) ? allJobsResponse : [];
          
          // Set featured jobs
          setFeaturedJobs(featuredArray);
          
          // Set regular jobs from all jobs (excluding featured ones)
          const regularJobsArray = allJobsArray.filter((job: any) => 
            !featuredArray.some((fj: any) => fj.id === job.id)
          ).slice(0, 6);
          setRegularJobs(regularJobsArray);
          
          // Update stats with real data
          setStats([
            { label: "Active Jobs", value: allJobsArray.length.toString(), icon: Briefcase, color: "text-primary" },
            { label: "New This Week", value: allJobsArray.filter((j: any) => {
              const createdAt = new Date(j.created_at || j.createdAt);
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              return createdAt > weekAgo;
            }).length.toString(), icon: TrendingUp, color: "text-success" },
            { label: "Remote Jobs", value: allJobsArray.filter((j: any) => 
              (j.location || '').toLowerCase().includes('remote')
            ).length.toString(), icon: Zap, color: "text-accent" },
          ]);
        } else {
          // Use mock data as fallback
          const mockData = await apiServices.mockService.getMockData();
          setFeaturedJobs(mockData.jobs.slice(0, 3));
          setRegularJobs(mockData.jobs.slice(3, 9));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Use mock data as fallback
        const mockData = await apiServices.mockService.getMockData();
        setFeaturedJobs(mockData.jobs.slice(0, 3));
        setRegularJobs(mockData.jobs.slice(3, 9));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFeaturedJobs = useMemo(() => {
    if (!searchValue) return featuredJobs;
    return featuredJobs.filter(job => 
      job.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      job.company.toLowerCase().includes(searchValue.toLowerCase()) ||
      (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchValue.toLowerCase())))
    );
  }, [searchValue, featuredJobs]);

  const filteredRegularJobs = useMemo(() => {
    if (!searchValue) return regularJobs;
    return regularJobs.filter(job => 
      job.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      job.company.toLowerCase().includes(searchValue.toLowerCase()) ||
      (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchValue.toLowerCase())))
    );
  }, [searchValue, regularJobs]);

  const handleSave = (jobId: string) => {
    setSavedJobs(prev => {
      const isAlreadySaved = prev.includes(jobId);
      const newSavedJobs = isAlreadySaved 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId];
      
      toast({
        title: isAlreadySaved ? "Job Unsaved" : "Job Saved!",
        description: isAlreadySaved 
          ? "Job removed from your saved jobs." 
          : "Job added to your saved jobs.",
      });
      
      return newSavedJobs;
    });
  };

  const handleApply = (jobId: string) => {
    // Redirect to job details page where they'll need to write a cover letter
    navigate(`/job/${jobId}`);
    toast({
      title: "Redirecting to Job Details",
      description: "Please review the job details and write a cover letter to apply.",
    });
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  // Normalize backend job data to ModernJobCard props
  const normalizeJob = (job: any) => ({
    id: job.id,
    title: job.title,
    company: job.employer?.company_name || job.company || 'Unknown Company',
    location: job.location || 'Not specified',
    salary: job.salary ? `ETB ${job.salary}` : 'Salary not specified',
    remote: (job.location || '').toLowerCase().includes('remote'),
    featured: job.featured || false,
    rating: job.rating,
    skills: job.skills || [],
    logo: job.logo || job.employer?.logo || '',
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-accent/20 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10">

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-fade-in">
              Find Your Dream Job
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
              Discover amazing opportunities from top companies worldwide. Your next career move is just a search away.
            </p>
            
            <div className="max-w-2xl mx-auto animate-slide-up">
              <ModernSearch
                value={searchValue}
                onChange={setSearchValue}
                onFilter={() => {}}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="bg-card/80 backdrop-blur-sm border-border/50 p-6 text-center hover:border-primary/50 transition-all duration-300">
                <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">Browse by Category</h3>
            <ModernFilters
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Featured Jobs */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold text-foreground">Featured Opportunities</h3>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-8 text-center">
                  <div className="text-lg font-semibold mb-2">Loading Featured Jobs...</div>
                  <div className="text-muted-foreground">Please wait while we fetch the latest opportunities.</div>
                </Card>
              </div>
            ) : filteredFeaturedJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredFeaturedJobs.map((job) => (
                  <ModernJobCard
                    key={job.id}
                    {...normalizeJob(job)}
                    isSaved={savedJobs.includes(job.id)}
                    hasApplied={appliedJobs.includes(job.id)}
                    onSave={handleSave}
                    onApply={handleApply}
                    onClick={() => handleJobClick(job.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Featured Jobs Available</h3>
                <p className="text-muted-foreground mb-4">
                  We're working to bring you the best job opportunities. Check back soon!
                </p>
                <Button onClick={() => navigate('/browse')}>Browse All Jobs</Button>
              </Card>
            )}
          </div>

          {/* Regular Jobs */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Latest Jobs</h3>
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-8 text-center">
                  <div className="text-lg font-semibold mb-2">Loading Latest Jobs...</div>
                  <div className="text-muted-foreground">Please wait while we fetch more opportunities.</div>
                </Card>
              </div>
            ) : filteredRegularJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRegularJobs.map((job) => (
                  <ModernJobCard
                    key={job.id}
                    {...normalizeJob(job)}
                    isSaved={savedJobs.includes(job.id)}
                    hasApplied={appliedJobs.includes(job.id)}
                    onSave={handleSave}
                    onApply={handleApply}
                    onClick={() => handleJobClick(job.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Jobs Available Yet</h3>
                <p className="text-muted-foreground mb-4">
                  We're adding new job opportunities daily. Be the first to apply when they're posted!
                </p>
                <Button onClick={() => navigate('/browse')}>Explore Job Categories</Button>
              </Card>
            )}
          </div>

          {/* Load More */}
          {!loading && (featuredJobs.length > 0 || regularJobs.length > 0) && (
            <div className="text-center py-8">
              <Button 
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 px-8"
                onClick={() => navigate('/browse')}
              >
                Browse All Jobs
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;