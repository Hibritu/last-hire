"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Building2,
  Briefcase,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { AdminService } from "@/services/adminService";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getDashboardMetrics();
      setMetrics(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchDashboardData} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Active Jobs",
      value: metrics?.activeJobs?.toString() || "0",
      change: `+${metrics?.jobGrowth || 0}%`,
      changeType: metrics?.jobGrowth > 0 ? "positive" : "negative",
      icon: Briefcase,
      color: "bg-blue-500"
    },
    {
      title: "Pending Approvals",
      value: metrics?.pendingJobApprovals?.toString() || "0",
      change: metrics?.pendingEmployerVerifications > 0 ? `+${metrics.pendingEmployerVerifications} employers` : "None",
      changeType: metrics?.pendingJobApprovals > 0 ? "negative" : "positive",
      icon: Clock,
      color: "bg-yellow-500"
    },
    {
      title: "Total Users",
      value: metrics?.totalUsers?.toString() || "0",
      change: `+${metrics?.userGrowth || 0}%`,
      changeType: metrics?.userGrowth > 0 ? "positive" : "negative",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Total Employers",
      value: metrics?.totalEmployers?.toString() || "0",
      change: `+${metrics?.employerGrowth || 0}%`,
      changeType: metrics?.employerGrowth > 0 ? "positive" : "negative",
      icon: Building2,
      color: "bg-purple-500"
    }
  ];

  const quickActions = [
    { name: "Review Pending Employers", href: "/dashboard/employers", icon: Building2 },
    { name: "Check Flagged Content", href: "/dashboard/reports", icon: AlertTriangle },
    { name: "View Payment Reports", href: "/dashboard/payments", icon: CreditCard },
    { name: "Send Announcement", href: "/dashboard/notifications", icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge
                  variant={stat.changeType === "positive" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span className="ml-2 text-xs text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Jobs</CardTitle>
            <CardDescription>All time job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics?.totalJobs || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Applications</CardTitle>
            <CardDescription>All time applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics?.totalApplications || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
            <CardDescription>Employers awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{metrics?.pendingEmployerVerifications || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.name}
                variant="outline"
                className="h-20 flex-col justify-center space-y-2"
                onClick={() => window.location.href = action.href}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-sm text-center">{action.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>Real-time system metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Job Postings</span>
                <span>{metrics?.activeJobs || 0} active</span>
              </div>
              <Progress 
                value={metrics?.activeJobs ? (metrics.activeJobs / metrics.totalJobs) * 100 : 0} 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>User Activity</span>
                <span>{metrics?.totalUsers || 0} users</span>
              </div>
              <Progress 
                value={metrics?.userGrowth || 0} 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Employer Verifications</span>
                <span>{metrics?.totalEmployers || 0} employers</span>
              </div>
              <Progress 
                value={metrics?.employerGrowth || 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics?.pendingJobApprovals > 0 && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>{metrics.pendingJobApprovals} jobs awaiting approval</span>
              </div>
            )}
            {metrics?.pendingEmployerVerifications > 0 && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{metrics.pendingEmployerVerifications} employers awaiting verification</span>
              </div>
            )}
            {metrics?.totalApplications > 0 && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{metrics.totalApplications} total applications submitted</span>
              </div>
            )}
            {metrics?.activeJobs > 0 && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>{metrics.activeJobs} jobs currently active</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
