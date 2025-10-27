import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { 
  Search, 
  Users, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Building, 
  Star,
  ArrowRight,
  CheckCircle,
  Home,
  DollarSign,
  Calendar,
  Briefcase,
  LogOut
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('hirehub_token');
    if (token) {
      try {
        // Decode the JWT to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo({
          email: payload.email,
          role: payload.role
        });
        setIsLoggedIn(true);
      } catch (error) {
        // Invalid token, clear it
        localStorage.removeItem('hirehub_token');
        localStorage.removeItem('hirehub_refresh_token');
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('hirehub_token');
    localStorage.removeItem('hirehub_refresh_token');
    setIsLoggedIn(false);
    setUserInfo(null);
    
    toast.success('Logged out successfully!');
  };
  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Smart Job Search",
      description: "AI-powered search to find the perfect job opportunities tailored to your skills and preferences."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Company Insights",
      description: "Get detailed information about companies, their culture, and employee reviews before you apply."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Career Growth",
      description: "Track your career progress and get personalized recommendations for skill development."
    }
  ];

  const benefits = [
    "Access to thousands of verified job opportunities",
    "Real-time application tracking and status updates",
    "Personalized job recommendations based on your profile",
    "Direct communication with hiring managers",
    "Comprehensive company research tools",
    "Salary insights and market analysis"
  ];

  const featuredJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Zemen Bank",
      location: "Addis Ababa, Ethiopia",
      salary: "40,000 - 60,000 ETB",
      type: "Full-time",
      posted: "2 days ago",
      skills: ["React", "TypeScript", "Next.js"]
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Delivery Addis",
      location: "Addis Ababa, Ethiopia",
      salary: "35,000 - 50,000 ETB",
      type: "Full-time",
      posted: "1 day ago",
      skills: ["Product Strategy", "Analytics", "Leadership"]
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Gebeya Inc",
      location: "Addis Ababa, Ethiopia",
      salary: "25,000 - 35,000 ETB",
      type: "Full-time",
      posted: "3 days ago",
      skills: ["Figma", "User Research", "Prototyping"]
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "M-Birr",
      location: "Addis Ababa, Ethiopia",
      salary: "38,000 - 55,000 ETB",
      type: "Full-time",
      posted: "1 week ago",
      skills: ["AWS", "Kubernetes", "Docker"]
    },
    {
      id: 5,
      title: "Digital Marketing Specialist",
      company: "Ethio Telecom",
      location: "Addis Ababa, Ethiopia",
      salary: "30,000 - 45,000 ETB",
      type: "Full-time",
      posted: "4 days ago",
      skills: ["Google Ads", "SEO", "Analytics"]
    },
    {
      id: 6,
      title: "Data Analyst",
      company: "Commercial Bank of Ethiopia",
      location: "Addis Ababa, Ethiopia",
      salary: "20,000 - 30,000 ETB",
      type: "Full-time",
      posted: "5 days ago",
      skills: ["SQL", "Python", "Excel"]
    }
  ];

  const featuredFreelancers = [
    {
      id: 1,
      name: "Abel Tesfaye",
      title: "Full-Stack Developer",
      rating: 4.9,
      reviews: 127,
      hourlyRate: "1,800 ETB/hr",
      skills: ["React", "Node.js", "Python"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      availability: "Available now",
      location: "Addis Ababa, Ethiopia"
    },
    {
      id: 2,
      name: "Sara Alemayehu",
      title: "UI/UX Designer",
      rating: 4.8,
      reviews: 89,
      hourlyRate: "1,500 ETB/hr",
      skills: ["Figma", "Adobe XD", "Webflow"],
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      availability: "Available this week",
      location: "Addis Ababa, Ethiopia"
    },
    {
      id: 3,
      name: "Michael Tadesse",
      title: "Digital Marketing Expert",
      rating: 4.9,
      reviews: 156,
      hourlyRate: "1,200 ETB/hr",
      skills: ["SEO", "Google Ads", "Analytics"],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      availability: "Available now",
      location: "Addis Ababa, Ethiopia"
    },
    {
      id: 4,
      name: "Helen Getahun",
      title: "Content Writer",
      rating: 4.7,
      reviews: 78,
      hourlyRate: "800 ETB/hr",
      skills: ["Content Writing", "SEO Writing", "Translation"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      availability: "Available now",
      location: "Bahir Dar, Ethiopia"
    },
    {
      id: 5,
      name: "Daniel Fekadu",
      title: "Mobile App Developer",
      rating: 4.8,
      reviews: 94,
      hourlyRate: "2,000 ETB/hr",
      skills: ["Flutter", "React Native", "iOS"],
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      availability: "Available next week",
      location: "Addis Ababa, Ethiopia"
    },
    {
      id: 6,
      name: "Ruth Assefa",
      title: "Graphic Designer",
      rating: 4.6,
      reviews: 132,
      hourlyRate: "900 ETB/hr",
      skills: ["Photoshop", "Illustrator", "Branding"],
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      availability: "Available now",
      location: "Dire Dawa, Ethiopia"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Hire-hub
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/about">
              <Button variant="ghost" className="hover:text-primary">
                About
              </Button>
            </Link>
            <ModeToggle />
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  Welcome back, {userInfo?.email} ({userInfo?.role})
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hover:text-primary">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-primary hover:scale-105 transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <Badge variant="secondary" className="mb-6 animate-slide-up">
            🚀 Your Dream Job Awaits
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-slide-up [animation-delay:0.1s]">
            Find Your Perfect
            <br />
            Career Match
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up [animation-delay:0.2s]">
            Connect with top companies and discover opportunities that align with your skills, 
            goals, and values. Your next career move starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:0.3s]">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-primary hover:scale-105 transition-all duration-300">
                Start Your Journey
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
                Already Have an Account?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 animate-slide-up">
            Why Choose Our Platform?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:0.1s]">
            We've built the most comprehensive job search platform to help you succeed in your career journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="bg-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 animate-slide-up">
              Featured Jobs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:0.1s]">
              Discover exciting opportunities from top companies looking for talented professionals like you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredJobs.map((job, index) => (
              <Card 
                key={job.id} 
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-2 text-base">
                        <Building className="w-4 h-4" />
                        <span>{job.company}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{job.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{job.posted}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/signup">
              <Button variant="outline" size="lg" className="hover:scale-105 transition-all duration-300">
                View All Jobs
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Freelancers Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 animate-slide-up">
            Featured Freelancers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:0.1s]">
            Connect with top-rated freelancers ready to help bring your projects to life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {featuredFreelancers.map((freelancer, index) => (
            <Card 
              key={freelancer.id} 
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <img 
                    src={freelancer.avatar} 
                    alt={freelancer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-xl">{freelancer.name}</CardTitle>
                    <CardDescription className="text-base">
                      {freelancer.title}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(freelancer.rating) 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({freelancer.reviews})</span>
                  </div>
                  <span className="text-lg font-semibold text-primary">{freelancer.hourlyRate}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{freelancer.availability}</span>
                </div>
                
                <Button className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300">
                  Hire Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/signup">
            <Button variant="outline" size="lg" className="hover:scale-105 transition-all duration-300">
              View All Freelancers
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold mb-6">
                Everything You Need to Land Your Dream Job
              </h2>
              <p className="text-muted-foreground mb-8">
                Our platform provides all the tools and resources you need to make your job search 
                efficient, effective, and successful.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 animate-slide-up"
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-slide-up [animation-delay:0.2s]">
              <Card className="p-8 bg-gradient-card backdrop-blur-sm border-0 shadow-2xl">
                <div className="text-center">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <blockquote className="text-lg italic mb-4">
                    "This platform helped me find my dream job in just 2 weeks! 
                    The personalized recommendations were spot-on."
                  </blockquote>
                  <cite className="text-sm text-muted-foreground">
                    - Sarah Johnson, Software Engineer
                  </cite>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { number: "10,000+", label: "Active Jobs" },
            { number: "5,000+", label: "Companies" },
            { number: "50,000+", label: "Job Seekers" },
            { number: "95%", label: "Success Rate" }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4 animate-slide-up">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl mb-8 opacity-90 animate-slide-up [animation-delay:0.1s]">
              Join thousands of professionals who have found their perfect career match through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:0.2s]">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="hover:scale-105 transition-all duration-300"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300"
                >
                  Sign In Instead
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Building className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                Hire-hub
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t">
            © 2024 Hire-hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;