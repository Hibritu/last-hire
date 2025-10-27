import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { mockDashboardStats, DashboardStats } from '@/lib/mockData';
import { formatDate, getRelativeTime } from '@/lib/utils';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(mockDashboardStats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  if (!stats) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-foreground">No data available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22c55e']} />
      }
    >
      <View className="p-4">
        {/* Welcome Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-1">
            Welcome back! 👋
          </Text>
          <Text className="text-muted-foreground">
            Here's what's happening with your jobs today
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap -mx-2 mb-4">
          {/* Total Jobs */}
          <View className="w-1/2 px-2 mb-4">
            <Card className="bg-primary/10">
              <CardContent className="pt-4">
                <Text className="text-3xl font-bold text-primary mb-1">
                  {stats.totalJobs}
                </Text>
                <Text className="text-sm text-muted-foreground">Total Jobs</Text>
              </CardContent>
            </Card>
          </View>

          {/* Active Jobs */}
          <View className="w-1/2 px-2 mb-4">
            <Card className="bg-green-50">
              <CardContent className="pt-4">
                <Text className="text-3xl font-bold text-green-600 mb-1">
                  {stats.activeJobs}
                </Text>
                <Text className="text-sm text-muted-foreground">Active Jobs</Text>
              </CardContent>
            </Card>
          </View>

          {/* Total Applications */}
          <View className="w-1/2 px-2 mb-4">
            <Card className="bg-blue-50">
              <CardContent className="pt-4">
                <Text className="text-3xl font-bold text-blue-600 mb-1">
                  {stats.totalApplications}
                </Text>
                <Text className="text-sm text-muted-foreground">Applications</Text>
              </CardContent>
            </Card>
          </View>

          {/* Total Views */}
          <View className="w-1/2 px-2 mb-4">
            <Card className="bg-purple-50">
              <CardContent className="pt-4">
                <Text className="text-3xl font-bold text-purple-600 mb-1">
                  {stats.totalViews}
                </Text>
                <Text className="text-sm text-muted-foreground">Total Views</Text>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Pending Applications Card */}
        <Card className="mb-4">
          <CardHeader>
            <Text className="text-lg font-semibold text-foreground">
              Pending Actions
            </Text>
          </CardHeader>
          <CardContent>
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-2xl font-bold text-foreground mb-1">
                  {stats.pendingApplications}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Pending Applications
                </Text>
              </View>
              <Badge variant="warning">Review</Badge>
            </View>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <Text className="text-lg font-semibold text-foreground">
              Recent Activity
            </Text>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.map((activity, index) => (
              <View
                key={activity.id}
                className={`py-3 ${
                  index !== stats.recentActivity.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <Text className="text-foreground mb-1">{activity.message}</Text>
                <Text className="text-xs text-muted-foreground">
                  {getRelativeTime(activity.timestamp)}
                </Text>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <View className="mt-6 mb-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <TouchableOpacity 
                className="bg-primary rounded-lg p-4"
                onPress={() => navigation.navigate('Jobs' as never, { screen: 'PostJob' } as never)}
              >
                <Text className="text-white font-semibold text-center">
                  Post New Job
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <TouchableOpacity 
                className="bg-secondary rounded-lg p-4"
                onPress={() => navigation.navigate('Applications' as never)}
              >
                <Text className="text-foreground font-semibold text-center">
                  View Applications
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}


