import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Edit2, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  Award,
  Download,
  Upload,
  Plus,
  X,
  Settings,
  ExternalLink,
  Globe,
  Github,
  Linkedin
} from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    firstName: "",
    lastName: "",
    gender: ""
  });

  // Load user data from AuthContext when available
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        title: user.title || '',
        gender: user.gender || ''
      }));
    }
  }, [user]);
  const [skillsData, setSkillsData] = useState<string[]>([]);
  const [experienceData, setExperienceData] = useState<any[]>([]);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    duration: "",
    description: ""
  });
  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    duration: "",
    gpa: ""
  });
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    description: "",
    technologies: [] as string[],
    liveUrl: "",
    githubUrl: "",
    imageUrl: ""
  });
  const [newTechnology, setNewTechnology] = useState("");

  const handleSaveBio = () => {
    setIsEditing(false);
    toast({
      title: "Bio Updated",
      description: "Your bio has been saved successfully.",
    });
  };

  const handleSaveProfile = (formData: FormData) => {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const gender = formData.get("gender") as string;

    setProfileData(prev => ({
      ...prev,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      location,
      gender
    }));

    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsData.includes(newSkill.trim())) {
      setSkillsData([...skillsData, newSkill.trim()]);
      setNewSkill("");
      toast({
        title: "Skill Added",
        description: `${newSkill} has been added to your skills.`,
      });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsData(skillsData.filter(skill => skill !== skillToRemove));
    toast({
      title: "Skill Removed",
      description: `${skillToRemove} has been removed from your skills.`,
    });
  };

  const handleAddExperience = () => {
    if (newExperience.company && newExperience.position) {
      const experience = {
        id: Date.now(),
        ...newExperience
      };
      setExperienceData([...experienceData, experience]);
      setNewExperience({ company: "", position: "", duration: "", description: "" });
      toast({
        title: "Experience Added",
        description: "New work experience has been added to your profile.",
      });
    }
  };

  const handleAddEducation = () => {
    if (newEducation.school && newEducation.degree) {
      const education = {
        id: Date.now(),
        ...newEducation
      };
      setEducationData([...educationData, education]);
      setNewEducation({ school: "", degree: "", duration: "", gpa: "" });
      toast({
        title: "Education Added",
        description: "New education has been added to your profile.",
      });
    }
  };

  const handleAddPortfolio = () => {
    if (newPortfolio.title && newPortfolio.description) {
      const portfolio = {
        id: Date.now(),
        ...newPortfolio
      };
      setPortfolioData([...portfolioData, portfolio]);
      setNewPortfolio({ title: "", description: "", technologies: [], liveUrl: "", githubUrl: "", imageUrl: "" });
      toast({
        title: "Portfolio Item Added",
        description: "New portfolio item has been added to your profile.",
      });
    }
  };

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !newPortfolio.technologies.includes(newTechnology.trim())) {
      setNewPortfolio(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology("");
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setNewPortfolio(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleRemovePortfolio = (portfolioId: number) => {
    setPortfolioData(portfolioData.filter(item => item.id !== portfolioId));
    toast({
      title: "Portfolio Item Removed",
      description: "Portfolio item has been removed from your profile.",
    });
  };

  const handleResumeDownload = () => {
    toast({
      title: "Download Started",
      description: "Your resume is being downloaded...",
    });
    // Mock download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your resume has been downloaded successfully.",
      });
    }, 2000);
  };

  const handleResumeUpload = () => {
    toast({
      title: "Upload Started",
      description: "Please select a PDF or DOCX file...",
    });
    // Mock upload
    setTimeout(() => {
      toast({
        title: "Upload Complete",
        description: "Your resume has been uploaded successfully.",
      });
    }, 2000);
  };

  const handlePhotoUpload = () => {
    toast({
      title: "Photo Upload",
      description: "Please select an image file...",
    });
    // Mock upload
    setTimeout(() => {
      toast({
        title: "Photo Updated",
        description: "Your profile photo has been updated successfully.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">My Profile</h1>
          <p className="text-muted-foreground text-lg">
            Manage your profile information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-2xl">
                      {profileData.firstName?.[0] || 'U'}{profileData.lastName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="mb-4" onClick={handlePhotoUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <h2 className="text-2xl font-bold">{profileData.name || 'No Name Set'}</h2>
                  <p className="text-muted-foreground">{profileData.title || 'No Title Set'}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {profileData.email || 'No email set'}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {profileData.phone || 'No phone set'}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {profileData.location || 'No location set'}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Member since January 2024
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full mb-2" onClick={handleResumeDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleResumeUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  {/* Bio */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>About Me</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <Textarea 
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                            className="min-h-[100px]"
                            placeholder="Tell us about yourself, your experience, and your career goals..."
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveBio}>Save</Button>
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {profileData.bio || 'No bio added yet. Click edit to add information about yourself.'}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Skills
                        </CardTitle>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Skill
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Skill</DialogTitle>
                              <DialogDescription>
                                Add a new skill to your profile.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="skill">Skill Name</Label>
                                <Input
                                  id="skill"
                                  value={newSkill}
                                  onChange={(e) => setNewSkill(e.target.value)}
                                  placeholder="e.g., React, Python, Design..."
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleAddSkill}>Add Skill</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {skillsData.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No skills added yet. Click "Add Skill" to get started.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {skillsData.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="group relative">
                              {skill}
                              <button
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-2 opacity-0 group-hover:opacity-100 text-xs"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="experience">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Work Experience
                      </CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Experience
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Add Work Experience</DialogTitle>
                            <DialogDescription>
                              Add your work experience to showcase your professional background.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="company">Company</Label>
                              <Input
                                id="company"
                                value={newExperience.company}
                                onChange={(e) => setNewExperience(prev => ({...prev, company: e.target.value}))}
                                placeholder="Company name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="position">Position</Label>
                              <Input
                                id="position"
                                value={newExperience.position}
                                onChange={(e) => setNewExperience(prev => ({...prev, position: e.target.value}))}
                                placeholder="Your job title"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="duration">Duration</Label>
                              <Input
                                id="duration"
                                value={newExperience.duration}
                                onChange={(e) => setNewExperience(prev => ({...prev, duration: e.target.value}))}
                                placeholder="e.g., 2020 - 2023"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={newExperience.description}
                                onChange={(e) => setNewExperience(prev => ({...prev, description: e.target.value}))}
                                placeholder="Describe your role and achievements..."
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleAddExperience}>Add Experience</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {experienceData.length === 0 ? (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Work Experience</h3>
                        <p className="text-muted-foreground mb-4">
                          Add your work experience to showcase your professional background.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {experienceData.map((job) => (
                          <div key={job.id} className="border-l-2 border-primary pl-4">
                            <h3 className="font-semibold text-lg">{job.position}</h3>
                            <p className="text-primary font-medium">{job.company}</p>
                            <p className="text-sm text-muted-foreground mb-2">{job.duration}</p>
                            <p className="text-muted-foreground">{job.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education
                      </CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Education
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Education</DialogTitle>
                            <DialogDescription>
                              Add your educational background to your profile.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="school">School/University</Label>
                              <Input
                                id="school"
                                value={newEducation.school}
                                onChange={(e) => setNewEducation(prev => ({...prev, school: e.target.value}))}
                                placeholder="Institution name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="degree">Degree</Label>
                              <Input
                                id="degree"
                                value={newEducation.degree}
                                onChange={(e) => setNewEducation(prev => ({...prev, degree: e.target.value}))}
                                placeholder="e.g., Bachelor of Computer Science"
                              />
                            </div>
                            <div>
                              <Label htmlFor="eduDuration">Duration</Label>
                              <Input
                                id="eduDuration"
                                value={newEducation.duration}
                                onChange={(e) => setNewEducation(prev => ({...prev, duration: e.target.value}))}
                                placeholder="e.g., 2016 - 2020"
                              />
                            </div>
                            <div>
                              <Label htmlFor="gpa">GPA (Optional)</Label>
                              <Input
                                id="gpa"
                                value={newEducation.gpa}
                                onChange={(e) => setNewEducation(prev => ({...prev, gpa: e.target.value}))}
                                placeholder="e.g., 3.8/4.0"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleAddEducation}>Add Education</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {educationData.length === 0 ? (
                      <div className="text-center py-12">
                        <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Education</h3>
                        <p className="text-muted-foreground mb-4">
                          Add your educational background to your profile.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {educationData.map((edu) => (
                          <div key={edu.id} className="border-l-2 border-primary pl-4">
                            <h3 className="font-semibold text-lg">{edu.degree}</h3>
                            <p className="text-primary font-medium">{edu.school}</p>
                            <p className="text-sm text-muted-foreground">{edu.duration}</p>
                            {edu.gpa && <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Portfolio
                      </CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Project
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Add Portfolio Project</DialogTitle>
                            <DialogDescription>
                              Showcase your work by adding projects to your portfolio.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div>
                              <Label htmlFor="projectTitle">Project Title</Label>
                              <Input
                                id="projectTitle"
                                value={newPortfolio.title}
                                onChange={(e) => setNewPortfolio(prev => ({...prev, title: e.target.value}))}
                                placeholder="Enter project title"
                              />
                            </div>
                            <div>
                              <Label htmlFor="projectDescription">Description</Label>
                              <Textarea
                                id="projectDescription"
                                value={newPortfolio.description}
                                onChange={(e) => setNewPortfolio(prev => ({...prev, description: e.target.value}))}
                                placeholder="Describe your project, its features, and your role..."
                                className="min-h-[120px]"
                              />
                            </div>
                            <div>
                              <Label>Technologies Used</Label>
                              <div className="flex gap-2 mb-3">
                                <Input
                                  value={newTechnology}
                                  onChange={(e) => setNewTechnology(e.target.value)}
                                  placeholder="Add technology (e.g., React, Node.js)"
                                  onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                                />
                                <Button type="button" onClick={handleAddTechnology}>
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {newPortfolio.technologies.map((tech, index) => (
                                  <Badge key={index} variant="secondary" className="group relative">
                                    {tech}
                                    <button
                                      onClick={() => handleRemoveTechnology(tech)}
                                      className="ml-2 opacity-0 group-hover:opacity-100 text-xs"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="liveUrl">Live Demo URL</Label>
                                <Input
                                  id="liveUrl"
                                  value={newPortfolio.liveUrl}
                                  onChange={(e) => setNewPortfolio(prev => ({...prev, liveUrl: e.target.value}))}
                                  placeholder="https://your-project.com"
                                />
                              </div>
                              <div>
                                <Label htmlFor="githubUrl">GitHub Repository</Label>
                                <Input
                                  id="githubUrl"
                                  value={newPortfolio.githubUrl}
                                  onChange={(e) => setNewPortfolio(prev => ({...prev, githubUrl: e.target.value}))}
                                  placeholder="https://github.com/username/repo"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="imageUrl">Project Image URL</Label>
                              <Input
                                id="imageUrl"
                                value={newPortfolio.imageUrl}
                                onChange={(e) => setNewPortfolio(prev => ({...prev, imageUrl: e.target.value}))}
                                placeholder="https://example.com/project-image.jpg"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleAddPortfolio}>Add Project</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {portfolioData.length === 0 ? (
                      <div className="text-center py-12">
                        <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Portfolio Projects</h3>
                        <p className="text-muted-foreground mb-4">
                          Showcase your work by adding projects to your portfolio.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {portfolioData.map((project) => (
                          <Card key={project.id} className="group relative">
                            <button
                              onClick={() => handleRemovePortfolio(project.id)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 z-10 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {project.imageUrl && (
                              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                <img 
                                  src={project.imageUrl} 
                                  alt={project.title}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {project.technologies.map((tech, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                {project.liveUrl && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3 w-3 mr-2" />
                                      Live Demo
                                    </a>
                                  </Button>
                                )}
                                {project.githubUrl && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                      <Github className="h-3 w-3 mr-2" />
                                      Code
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Profile Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(new FormData(e.currentTarget)); }} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            defaultValue={profileData.firstName} 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            defaultValue={profileData.lastName} 
                            required 
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          defaultValue={profileData.email} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          defaultValue={profileData.phone} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          name="location" 
                          defaultValue={profileData.location} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select name="gender" defaultValue={profileData.gender}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;