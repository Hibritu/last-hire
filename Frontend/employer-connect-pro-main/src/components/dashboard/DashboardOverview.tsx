import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Users, 
  Eye, 
  CheckCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

interface DashboardOverviewProps {
  onTabChange: (tab: string) => void;
}

export function DashboardOverview({ onTabChange }: DashboardOverviewProps) {
  const [stats, setStats] = useState([
    {
      title: "Active Jobs",
      value: 0,
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Total Applications",
      value: 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Shortlisted",
      value: 0,
      icon: Eye,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
    },
    {
      title: "Accepted",
      value: 0,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ]);
  
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard data from backend
        // This is a placeholder - you'll need to implement the actual API endpoints
        // For now, we'll use mock data but in a real implementation, you would call:
        // const response = await apiClient.get('/dashboard/stats');
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        setStats([
          {
            title: "Active Jobs",
            value: 5,
            icon: Briefcase,
            color: "text-primary",
            bgColor: "bg-primary/10"
          },
          {
            title: "Total Applications",
            value: 24,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20"
          },
          {
            title: "Shortlisted",
            value: 8,
            icon: Eye,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
          },
          {
            title: "Accepted",
            value: 3,
            icon: CheckCircle,
            color: "text-success",
            bgColor: "bg-success/10"
          }
        ]);
        
        // Mock recent jobs data
        setRecentJobs([
          {
            id: "1",
            title: "Senior Software Engineer",
            company: "EthioTech Solutions",
            createdAt: "2023-06-15",
            applicationsCount: 12,
            status: "active"
          },
          {
            id: "2",
            title: "Product Manager",
            company: "Addis Ababa Digital",
            createdAt: "2023-06-10",
            applicationsCount: 8,
            status: "active"
          },
          {
            id: "3",
            title: "UX Designer",
            company: "Ethiopian Innovations",
            createdAt: "2023-06-05",
            applicationsCount: 4,
            status: "closed"
          }
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your hiring activity.
          </p>
        </div>
        <Button onClick={() => onTabChange('post-job')}>
          <Briefcase className="mr-2 h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {job.applicationsCount} applications
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={job.status === 'active' ? 'default' : 'secondary'}
                    className={job.status === 'active' ? 'bg-success text-success-foreground' : ''}
                  >
                    {job.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => onTabChange('jobs')}>
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => onTabChange('post-job')}>
              <Briefcase className="mr-2 h-4 w-4" />
              Post a New Job
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onTabChange('applications')}>
              <Users className="mr-2 h-4 w-4" />
              Review Applications
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onTabChange('profile')}>
              <Eye className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                New application for Senior Software Developer
                <span className="text-muted-foreground">2h ago</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-success" />
                Payment confirmed for Marketing Manager listing
                <span className="text-muted-foreground">1d ago</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                Profile verification pending
                <span className="text-muted-foreground">2d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}