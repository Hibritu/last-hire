import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Clock, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

const BrowseFreelancers = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [contactedFreelancers, setContactedFreelancers] = useState<string[]>([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real freelancers from backend
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('/api/users/all?role=job_seeker&has_profile=true');
        setFreelancers(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load freelancers:', err);
        setError('Failed to load freelancers');
        setFreelancers([]);
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  const locations = ["All", ...Array.from(new Set(freelancers.map((f: any) => f.location).filter(Boolean)))];
  const skills = ["All"]; // Skills will come from freelancer profiles

  const filteredFreelancers = useMemo(() => {
    let filtered = freelancers.filter((freelancer: any) => {
      const name = `${freelancer.first_name || ''} ${freelancer.last_name || ''}`.trim();
      const matchesSearch = searchValue === "" || 
        name.toLowerCase().includes(searchValue.toLowerCase()) ||
        (freelancer.title || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (freelancer.bio || '').toLowerCase().includes(searchValue.toLowerCase());

      const matchesSkill = skillFilter === "All"; // Skills matching can be implemented later
      const matchesLocation = locationFilter === "All" || freelancer.location === locationFilter;

      return matchesSearch && matchesSkill && matchesLocation;
    });

    // Sort results
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case "rate_low":
        filtered.sort((a, b) => parseFloat(a.hourlyRate.replace(/[^0-9.]/g, '')) - parseFloat(b.hourlyRate.replace(/[^0-9.]/g, '')));
        break;
      case "rate_high":
        filtered.sort((a, b) => parseFloat(b.hourlyRate.replace(/[^0-9.]/g, '')) - parseFloat(a.hourlyRate.replace(/[^0-9.]/g, '')));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchValue, skillFilter, locationFilter, sortBy]);

  const handleContact = (freelancerId: string, freelancerName: string) => {
    if (!contactedFreelancers.includes(freelancerId)) {
      setContactedFreelancers([...contactedFreelancers, freelancerId]);
      toast({
        title: "Contact Request Sent",
        description: `Your message has been sent to ${freelancerName}. They will respond shortly.`,
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Freelancers</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Connect with talented Ethiopian freelancers ready to bring your projects to life
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search freelancers by name, title, or skills..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="rate_low">Lowest Rate</SelectItem>
                <SelectItem value="rate_high">Highest Rate</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              {filteredFreelancers.length} freelancer{filteredFreelancers.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Freelancers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <Card key={freelancer.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                    <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{freelancer.name}</CardTitle>
                    <CardDescription className="text-base font-medium text-primary">
                      {freelancer.title}
                    </CardDescription>
                    
                    <div className="flex items-center space-x-1 mt-2">
                      {renderStars(freelancer.rating)}
                      <span className="text-sm font-medium ml-2">{freelancer.rating}</span>
                      <span className="text-sm text-muted-foreground">({freelancer.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{freelancer.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{freelancer.availability}</span>
                  </div>
                </div>

                <div className="text-xl font-bold text-primary">
                  {freelancer.hourlyRate}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {freelancer.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {freelancer.skills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {freelancer.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{freelancer.skills.length - 4} more
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground py-2 border-t">
                  <div>
                    <div className="font-medium text-foreground">{freelancer.completedProjects}</div>
                    <div>Projects</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{freelancer.experience}</div>
                    <div>Experience</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{freelancer.languages.join(', ')}</div>
                    <div>Languages</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => handleContact(freelancer.id, freelancer.name)}
                    disabled={contactedFreelancers.includes(freelancer.id)}
                  >
                    {contactedFreelancers.includes(freelancer.id) ? "Message Sent" : "Contact"}
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFreelancers.length === 0 && (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Freelancers Found</h3>
            <p className="text-muted-foreground mb-4">
              No freelancers match your current search criteria. Try adjusting your filters or search terms.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchValue("");
                setSkillFilter("All");
                setLocationFilter("All");
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BrowseFreelancers;