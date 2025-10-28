import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModernSearch } from "@/components/ModernSearch";
import { ModernFilters } from "@/components/ModernFilters";
import { ModernJobCard } from "@/components/ModernJobCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jobService } from "@/services/apiServices";

const BrowseJobs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real jobs and categories from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsResponse, categoriesResponse] = await Promise.all([
          jobService.searchJobs({ location: '', limit: 100 }), // Get all jobs with high limit
          jobService.getJobCategories()
        ]);
        
        // apiWrapper already extracts the data, so jobsResponse is the array directly
        console.log('Jobs loaded:', jobsResponse);
        setAllJobs(Array.isArray(jobsResponse) ? jobsResponse : []);
        
        // Convert category objects to strings for the filter component
        const categoryData = Array.isArray(categoriesResponse) ? categoriesResponse : [];
        const categoryStrings = categoryData.map((cat: any) => 
          typeof cat === 'string' ? cat : (cat.value || cat.label || cat)
        );
        
        setCategories(["All", ...categoryStrings]);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setError('Failed to load jobs');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered and sorted jobs
  const filteredJobs = useMemo(() => {
    if (loading || allJobs.length === 0) return [];
    
    let filtered = allJobs;

    // Filter by search
    if (searchValue) {
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.skills?.some((skill: string) => skill.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter(job => job.category === activeCategory);
    }

    // Sort jobs
    switch (sortBy) {
      case "date":
        filtered.sort((a, b) => {
          if (!a.postedDate || !b.postedDate) return 0;
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        });
        break;
      case "salary":
        filtered.sort((a, b) => {
          const getSalaryValue = (salary: string) => {
            if (!salary) return 0;
            const match = salary.match(/\$(\d+)k/);
            return match ? parseInt(match[1]) : 0;
          };
          return getSalaryValue(b.salary) - getSalaryValue(a.salary);
        });
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // relevance
        // Featured jobs first, then by rating
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }

    return filtered;
  }, [searchValue, activeCategory, sortBy, allJobs, loading]);

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

  const handleLoadMore = () => {
    toast({
      title: "Loading More Jobs",
      description: "Fetching additional job listings...",
    });
    // Mock loading more jobs
    setTimeout(() => {
      toast({
        title: "More Jobs Loaded",
        description: "New job listings have been added.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Explore thousands of opportunities from top companies
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <ModernSearch
            value={searchValue}
            onChange={setSearchValue}
            onFilter={() => {}}
          />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ModernFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2 md:mb-0">
                  {loading ? (
                    "Loading jobs..."
                  ) : (
                    <>Showing {filteredJobs.length} of {allJobs.length} jobs
                    {searchValue && ` for "${searchValue}"`}
                    {activeCategory !== "All" && ` in ${activeCategory}`}</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy} disabled={loading}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date Posted</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="rating">Company Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-8 text-center">
              <div className="text-lg font-semibold mb-2">Loading Jobs...</div>
              <div className="text-muted-foreground">Please wait while we fetch available positions.</div>
            </Card>
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Error Loading Jobs</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredJobs.map((job) => {
              const company = job.employer?.company_name || job.company || 'Unknown Company';
              return (
                <ModernJobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={company}
                  location={job.location || 'Not specified'}
                  salary={job.salary ? `ETB ${job.salary}` : 'Salary not specified'}
                  skills={job.skills || []}
                  logo={company.charAt(0).toUpperCase()}
                  featured={job.is_featured || job.featured}
                  isSaved={savedJobs.includes(job.id)}
                  hasApplied={appliedJobs.includes(job.id)}
                  onSave={handleSave}
                  onApply={handleApply}
                  onClick={() => handleJobClick(job.id)}
                />
              );
            })}
          </div>
        ) : allJobs.length === 0 ? (
          <Card className="p-8 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Jobs Available</h3>
            <p className="text-muted-foreground mb-4">
              We're working hard to bring you amazing job opportunities. Check back soon or contact us to be notified when new positions are posted!
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/')}>Back to Home</Button>
              <Button variant="outline" onClick={() => setSearchValue('')}>Clear Search</Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
            <p className="text-muted-foreground mb-4">
              No jobs match your current search criteria. Try adjusting your filters or search terms.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchValue("");
                setActiveCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Load More */}
        {!loading && filteredJobs.length > 0 && (
          <div className="text-center">
            <Button size="lg" variant="outline" onClick={handleLoadMore} disabled={loading}>
              Load More Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;