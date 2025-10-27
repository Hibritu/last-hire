import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import JobService from '@/services/jobService';
import { Job } from '@/lib/mockData';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function JobsScreen() {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await JobService.getEmployerJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const handleDeleteJob = async (jobId: string) => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job posting?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await JobService.deleteJob(jobId);
              setJobs(jobs.filter(job => job.id !== jobId));
            } catch (error) {
              console.error('Error deleting job:', error);
              Alert.alert('Error', 'Failed to delete job');
            }
          },
        },
      ]
    );
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading jobs..." />;
  }

  return (
    <View className="flex-1 bg-background">
      {/* Filter Tabs */}
      <View className="flex-row bg-card border-b border-border px-4 py-2">
        <TouchableOpacity
          onPress={() => setFilter('all')}
          className={`mr-4 px-4 py-2 rounded-lg ${
            filter === 'all' ? 'bg-primary' : 'bg-transparent'
          }`}
        >
          <Text
            className={`font-semibold ${
              filter === 'all' ? 'text-white' : 'text-foreground'
            }`}
          >
            All ({jobs.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('active')}
          className={`mr-4 px-4 py-2 rounded-lg ${
            filter === 'active' ? 'bg-primary' : 'bg-transparent'
          }`}
        >
          <Text
            className={`font-semibold ${
              filter === 'active' ? 'text-white' : 'text-foreground'
            }`}
          >
            Active ({jobs.filter(j => j.status === 'active').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('expired')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'expired' ? 'bg-primary' : 'bg-transparent'
          }`}
        >
          <Text
            className={`font-semibold ${
              filter === 'expired' ? 'text-white' : 'text-foreground'
            }`}
          >
            Expired ({jobs.filter(j => j.status === 'expired').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Start by creating your first job posting"
          action={
            <Button onPress={() => navigation.navigate('PostJob' as never)}>
              Post a Job
            </Button>
          }
        />
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22c55e']} />
          }
        >
          <View className="p-4">
            {filteredJobs.map(job => (
              <Card key={job.id} className="mb-4">
                <CardContent className="pt-4">
                  {/* Header */}
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-2">
                      <Text className="text-lg font-bold text-foreground mb-1">
                        {job.title}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {job.location} • {job.category}
                      </Text>
                    </View>
                    <Badge variant={job.status === 'active' ? 'success' : 'destructive'}>
                      {job.status}
                    </Badge>
                  </View>

                  {/* Stats */}
                  <View className="flex-row mb-3">
                    <View className="mr-6">
                      <Text className="text-2xl font-bold text-primary">
                        {job.applicationsCount}
                      </Text>
                      <Text className="text-xs text-muted-foreground">Applications</Text>
                    </View>
                    <View>
                      <Text className="text-2xl font-bold text-blue-600">
                        {job.views || 0}
                      </Text>
                      <Text className="text-xs text-muted-foreground">Views</Text>
                    </View>
                  </View>

                  {/* Info */}
                  <View className="mb-3">
                    <Text className="text-sm text-muted-foreground">
                      Salary: {job.salary}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Posted: {formatDate(job.createdAt)}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Expires: {formatDate(job.expiryDate)}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View className="flex-row">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 mr-2"
                      onPress={() => {
                        // Navigate to edit job (not implemented)
                        Alert.alert('Edit Job', 'Edit functionality coming soon');
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onPress={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </Button>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PostJob' as never)}
        className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}


