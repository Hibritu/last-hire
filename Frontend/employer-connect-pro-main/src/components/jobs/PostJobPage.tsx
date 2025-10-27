import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { JobService } from "@/services/jobService";

interface PostJobPageProps {
  onTabChange?: (tab: string) => void;
}

export function PostJobPage({ onTabChange }: PostJobPageProps) {
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [employmentType, setEmploymentType] = useState<string>('full_time');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    category: '',
    location: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.requirements) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!expiryDate) {
      toast({
        title: "Missing Expiry Date",
        description: "Please select when this job posting should expire.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Post job to backend (payment is now free/auto-approved)
      await JobService.createJob({
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        salary: formData.salary,
        category: formData.category,
        location: formData.location,
        expiryDate: format(expiryDate, 'yyyy-MM-dd'),
        listingType: 'free',
        employmentType: employmentType,
      });

      toast({
        title: "Job Posted Successfully! 🎉",
        description: "Your job listing is now live and visible to job seekers.",
      });

      // Clear form
      setFormData({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        category: '',
        location: '',
      });
      setExpiryDate(undefined);
      
      // Navigate to jobs tab to see the posted job
      if (onTabChange) {
        setTimeout(() => {
          onTabChange('jobs');
        }, 1500);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Failed to Post Job",
        description: "There was an error posting your job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Post a Job</h1>
        <p className="text-muted-foreground">
          Create a new job posting to find the perfect candidate
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide the basic information about the position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Software Developer"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Addis Ababa"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  placeholder="e.g. 30,000 - 50,000 ETB"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Describe the role and what you're looking for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the required skills, experience, education, and qualifications..."
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Job Settings</CardTitle>
              <CardDescription>
                Set the expiry date and listing type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Expiry Date (Maximum 2 weeks) *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP") : "Select expiry date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      disabled={(date) => 
                        date < new Date() || 
                        date > new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-green-700 dark:text-green-400">Free Job Posting</h3>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      Post unlimited jobs at no cost during beta
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">FREE</div>
                    <div className="text-sm text-green-600 dark:text-green-500">no payment required</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card>
            <CardContent className="pt-6">
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                <CreditCard className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Posting Job...' : 'Post Job (Free)'}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {isSubmitting ? 'Please wait while we post your job...' : 'Your job will be published immediately and visible to job seekers'}
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}