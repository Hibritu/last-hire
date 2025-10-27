import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { jobService, applicationService } from "@/services/apiServices";
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  Users, 
  Heart,
  Flag,
  Share2,
  Star,
  Calendar,
  Eye,
  FileText,
  Send
} from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showCoverLetterDialog, setShowCoverLetterDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  // Job data - now using mock data
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job data from backend API
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const jobData = await jobService.getJobById(id);
        
        // Normalize backend data structure
        const normalizedJob = {
          ...jobData,
          company: jobData.employer?.company_name || jobData.company || 'Unknown Company',
          posted_date: jobData.created_at || jobData.posted_date || new Date().toISOString(),
          employment_type: jobData.employment_type || 'full_time',
          experience_level: jobData.experience_level || 'Mid-Level',
          application_count: jobData.application_count || 0,
          requirements: Array.isArray(jobData.requirements) 
            ? jobData.requirements 
            : (jobData.requirements ? jobData.requirements.split('\n').filter((r: string) => r.trim()) : []),
          skills: jobData.skills || [],
          benefits: jobData.benefits || [],
          company_info: {
            logo: jobData.employer?.logo || '',
            size: jobData.employer?.company_size || jobData.company_info?.size || 'Not specified',
            industry: jobData.employer?.sector || jobData.company_info?.industry || 'Not specified',
            website: jobData.employer?.website || jobData.company_info?.website || '',
            about: jobData.employer?.description || jobData.company_info?.about || '',
          }
        };
        
        setJob(normalizedJob);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load job:', err);
        setError('Failed to load job details');
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleApply = () => {
    if (hasApplied) {
      toast({
        title: "Already Applied",
        description: "You have already applied to this job.",
        variant: "destructive"
      });
      return;
    }

    // Open cover letter dialog
    setShowCoverLetterDialog(true);
  };

  const handleSubmitApplication = async () => {
    if (!applicantName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive"
      });
      return;
    }

    if (!applicantEmail.trim() || !applicantEmail.includes('@')) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (!coverLetter.trim()) {
      toast({
        title: "Cover Letter Required",
        description: "Please write a cover letter before submitting your application.",
        variant: "destructive"
      });
      return;
    }

    if (coverLetter.trim().length < 100) {
      toast({
        title: "Cover Letter Too Short",
        description: "Please write at least 100 characters in your cover letter to provide meaningful information.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingApplication(true);
    
    try {
      // Submit application to backend
      console.log('📤 Submitting application for job:', id);
      
      const applicationData = {
        cover_letter: coverLetter.trim(),
        applicant_name: applicantName.trim(),
        applicant_email: applicantEmail.trim()
      };
      
      const result = await applicationService.applyToJob(id!, applicationData);
      
      console.log('✅ Application submitted successfully:', result);
      
      // Update UI
      setHasApplied(true);
      setShowCoverLetterDialog(false);
      setCoverLetter("");
      setApplicantName("");
      setApplicantEmail("");
      setIsSubmittingApplication(false);
      
      toast({
        title: "Application Submitted Successfully!",
        description: `Your application for ${job.title} has been sent to the employer. Check 'My Applications' to track status.`,
      });
      
    } catch (error: any) {
      console.error('❌ Failed to submit application:', error);
      setIsSubmittingApplication(false);
      
      // Handle specific errors
      if (error?.response?.status === 401) {
        toast({
          title: "Login Required",
          description: "You must be logged in to apply for jobs. Redirecting to login page...",
          variant: "destructive"
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = `http://localhost:3002/login?from=job-seeker&redirect=${encodeURIComponent(window.location.href)}`;
        }, 2000);
        
      } else if (error?.response?.status === 409) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this job. Check 'My Applications' to view your application status.",
          variant: "destructive"
        });
        setHasApplied(true);
        setShowCoverLetterDialog(false);
        
      } else {
        const errorMessage = error?.response?.data?.error || error?.message || 'Failed to submit application';
        toast({
          title: "Application Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        // Unsave job
        console.log('📌 Unsaving job:', id);
        await jobService.unsaveJob(id!);
        setIsSaved(false);
        toast({
          title: "Job Unsaved",
          description: "Job removed from your saved jobs.",
        });
      } else {
        // Save job
        console.log('📌 Saving job:', id);
        await jobService.saveJob(id!);
        setIsSaved(true);
        toast({
          title: "Job Saved!",
          description: "Job added to your saved jobs.",
        });
      }
    } catch (error: any) {
      console.error('❌ Failed to save/unsave job:', error);
      
      if (error?.response?.status === 401) {
        toast({
          title: "Login Required",
          description: "You must be logged in to save jobs.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save/unsave job. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for reporting. We'll review this job posting.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Job link has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        {loading && (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Loading Job Details...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the job information.</p>
          </Card>
        )}

        {error && (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Job Not Found</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/browse')}>Browse All Jobs</Button>
          </Card>
        )}

        {job && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={job.company_info?.logo} />
                        <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                          {job.company.split(' ').map(word => word[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                        <p className="text-xl text-primary font-semibold mb-2">{job.company}</p>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <Badge variant="secondary">{job.employment_type.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleSave}
                        className={isSaved ? "text-red-500" : ""}
                      >
                        <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{job.description}</p>
                  
                  {job.requirements && job.requirements.length > 0 && (
                    <>
                      <h3 className="font-semibold mb-3">Requirements</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {job.benefits && job.benefits.length > 0 && (
                    <>
                      <h3 className="font-semibold mb-3">Benefits</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {job.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card>
                <CardContent className="p-6">
                  <Dialog open={showCoverLetterDialog} onOpenChange={setShowCoverLetterDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full mb-4" 
                        size="lg"
                        onClick={handleApply}
                        disabled={hasApplied}
                      >
                        {hasApplied ? "Applied" : "Apply Now"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                        <DialogDescription>
                          Complete your application for the {job.title} position at {job.company}. 
                          Please provide your details and write a compelling cover letter explaining why you're the perfect fit for this role.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Applicant Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="applicantName">Full Name *</Label>
                            <Input
                              id="applicantName"
                              value={applicantName}
                              onChange={(e) => setApplicantName(e.target.value)}
                              placeholder="Your full name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="applicantEmail">Email Address *</Label>
                            <Input
                              id="applicantEmail"
                              type="email"
                              value={applicantEmail}
                              onChange={(e) => setApplicantEmail(e.target.value)}
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                        </div>

                        {/* Job Summary */}
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold mb-2">Job Summary</h4>
                          <div className="text-sm space-y-1">
                            <div><strong>Position:</strong> {job.title}</div>
                            <div><strong>Company:</strong> {job.company}</div>
                            <div><strong>Location:</strong> {job.location}</div>
                            <div><strong>Type:</strong> {job.employment_type.replace('_', ' ')}</div>
                            {job.salary && <div><strong>Salary:</strong> {job.salary}</div>}
                          </div>
                        </div>

                        {/* Cover Letter */}
                        <div>
                          <Label htmlFor="coverLetter">Cover Letter *</Label>
                          <Textarea
                            id="coverLetter"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder={`Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. 

With my background in [your relevant experience], I am confident that I would be a valuable addition to your team. I am particularly excited about this opportunity because...

[Explain why you're interested in this specific role and company]

[Highlight your relevant skills and experiences]

[Mention specific achievements or projects]

I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's success. Thank you for considering my application.

Best regards,\n${applicantName || '[Your Name]'}`}
                            className="min-h-[350px] resize-none"
                            required
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>Minimum 100 characters required</span>
                            <span className={coverLetter.length < 100 ? "text-destructive" : "text-green-600"}>
                              {coverLetter.length} characters
                            </span>
                          </div>
                        </div>

                        {/* Application Tips */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for a Strong Application</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Research the company and mention specific aspects that interest you</li>
                            <li>• Highlight achievements with specific numbers or results</li>
                            <li>• Show enthusiasm for the role and company</li>
                            <li>• Keep it concise but informative (3-4 paragraphs ideal)</li>
                            <li>• Proofread for grammar and spelling errors</li>
                          </ul>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowCoverLetterDialog(false);
                            setCoverLetter("");
                            setApplicantName("");
                            setApplicantEmail("");
                          }}
                          disabled={isSubmittingApplication}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmitApplication}
                          disabled={
                            isSubmittingApplication || 
                            !applicantName.trim() || 
                            !applicantEmail.trim() || 
                            coverLetter.trim().length < 100
                          }
                          className="min-w-[140px]"
                        >
                          {isSubmittingApplication ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Submit Application
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSave}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current text-red-500" : ""}`} />
                    {isSaved ? "Saved" : "Save Job"}
                  </Button>
                </CardContent>
              </Card>

              {/* Job Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Posted Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(job.posted_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Separator />
                  {job.deadline && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Application Deadline</p>
                        <p className="font-medium text-orange-600 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {new Date(job.deadline).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Experience Level</p>
                    <p className="font-medium">{job.experience_level}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Type</p>
                    <Badge variant="secondary" className="font-medium">
                      {job.employment_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Applications</p>
                    <p className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {job.application_count} candidate{job.application_count !== 1 ? 's' : ''} applied
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    About {job.company}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.company_info?.size && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Company Size</p>
                        <p className="font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {job.company_info.size}
                        </p>
                      </div>
                      <Separator />
                    </>
                  )}
                  {job.company_info?.industry && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Industry</p>
                        <p className="font-medium">{job.company_info.industry}</p>
                      </div>
                      <Separator />
                    </>
                  )}
                  {job.company_info?.founded && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Founded</p>
                        <p className="font-medium">{job.company_info.founded}</p>
                      </div>
                      <Separator />
                    </>
                  )}
                  {job.company_info?.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">About the Company</p>
                      <p className="text-sm leading-relaxed">{job.company_info.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Report Job */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleReport}
              >
                <Flag className="h-4 w-4 mr-2" />
                Report Job
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;