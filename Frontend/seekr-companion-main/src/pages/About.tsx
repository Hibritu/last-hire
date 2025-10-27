import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { 
  Building, 
  Users, 
  Target, 
  Heart, 
  Award, 
  Globe, 
  Mail,
  LinkedinIcon,
  TwitterIcon,
  ArrowLeft
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Innovation",
      description: "We constantly push the boundaries of technology to create better job matching experiences."
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Integrity",
      description: "We believe in transparency, honesty, and building trust with every interaction."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community",
      description: "We foster connections that go beyond just job placements to build lasting relationships."
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Excellence",
      description: "We strive for the highest quality in everything we do, from our platform to our support."
    }
  ];

  const team = [
    {
      name: "Dagmawi Alemayehu",
      position: "CEO & Co-Founder",
     
      bio: "Former VP at LinkedIn with 15+ years in talent acquisition and platform development."
    },
    {
      name: "Habtewold Degfie",
      position: "CTO & Co-Founder", 
      
      bio: "Ex-Google engineer specializing in AI/ML and scalable platform architecture."
    },
    {
      name: "Hibritu Diress",
      position: "CEO amd CTO",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Product strategy expert with experience at Airbnb and Stripe, focused on user experience."
    },
    {
      name: "letra yemane",
      position: "Head of Engineering",
      
      bio: "Full-stack architect with expertise in building high-performance, user-centric applications."
    }
  ];

  const stats = [
    { number: "2019", label: "Founded" },
    { number: "500K+", label: "Active Users" },
    { number: "10K+", label: "Companies" },
    { number: "50+", label: "Countries" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Hire-hub
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <ModeToggle />
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <Badge variant="secondary" className="mb-6 animate-slide-up">
            About Hire-hub
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-slide-up [animation-delay:0.1s]">
            Connecting Talent
            <br />
            with Opportunity
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up [animation-delay:0.2s]">
            We're on a mission to revolutionize how people find meaningful work and how companies discover exceptional talent.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We believe that everyone deserves to find work that fulfills them and contributes to their growth. 
              Our platform bridges the gap between talented individuals and forward-thinking companies, 
              creating opportunities for mutual success.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Founded in 2019, Hire-hub has grown from a simple job listing site to a comprehensive 
              career ecosystem that serves millions of users worldwide.
            </p>
            <div className="flex items-center space-x-4">
              <Globe className="w-6 h-6 text-primary" />
              <span className="text-lg">Serving 50+ countries worldwide</span>
            </div>
          </div>
          <div className="animate-slide-up [animation-delay:0.2s]">
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-primary">Our Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 text-center">
                  {stats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-2xl font-bold text-primary">{stat.number}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 animate-slide-up">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:0.1s]">
              These core principles guide everything we do and shape how we serve our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 animate-slide-up">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:0.1s]">
            We're a diverse group of passionate individuals united by our mission to transform the job search experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CardHeader>
                <div className="mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-primary/20"
                  />
                </div>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {member.position}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {member.bio}
                </p>
                <div className="flex justify-center space-x-3">
                  <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                    <LinkedinIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                    <TwitterIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4 animate-slide-up">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl mb-8 opacity-90 animate-slide-up [animation-delay:0.1s]">
              Whether you're looking for your next opportunity or seeking exceptional talent, 
              we're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:0.2s]">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="hover:scale-105 transition-all duration-300"
                >
                  Get Started Today
                </Button>
              </Link>
              <Link to="/">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300"
                >
                  Learn More
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
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
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

export default About;