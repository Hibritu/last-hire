import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import JobService from '@/services/jobService';
import { Application } from '@/lib/mockData';
import { formatDate, getRelativeTime } from '@/lib/utils';

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'shortlisted' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await JobService.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleUpdateStatus = async (
    applicationId: string,
    status: 'pending' | 'shortlisted' | 'accepted' | 'rejected',
    applicantName: string
  ) => {
    // Confirmation dialog
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${status === 'rejected' ? 'reject' : status === 'shortlisted' ? 'shortlist' : 'accept'} ${applicantName}'s application?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const updated = await JobService.updateApplicationStatus(applicationId, status);
              setApplications(
                applications.map(app => (app.id === applicationId ? updated : app))
              );
              
              const statusMessage = status === 'rejected' ? 'rejected' : status === 'shortlisted' ? 'shortlisted' : 'accepted';
              Alert.alert('Success', `Application ${statusMessage} successfully! ${applicantName} will be notified.`);
            } catch (error) {
              console.error('Error updating status:', error);
              Alert.alert('Error', 'Failed to update application status');
            }
          },
        },
      ]
    );
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'shortlisted': return 'default';
      case 'accepted': return 'success';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading applications..." />;
  }

  return (
    <View className="flex-1 bg-background">
      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-card border-b border-border">
        <View className="flex-row px-4 py-2">
          {['all', 'pending', 'shortlisted', 'accepted', 'rejected'].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilter(status as any)}
              className={`mr-3 px-4 py-2 rounded-lg ${
                filter === status ? 'bg-primary' : 'bg-transparent'
              }`}
            >
              <Text
                className={`font-semibold capitalize ${
                  filter === status ? 'text-white' : 'text-foreground'
                }`}
              >
                {status} ({applications.filter(a => status === 'all' || a.status === status).length})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="Applications will appear here when candidates apply"
        />
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22c55e']} />
          }
        >
          <View className="p-4">
            {filteredApplications.map(app => (
              <Card key={app.id} className="mb-4">
                <CardContent className="pt-4">
                  {/* Header */}
                  <View className="flex-row items-start mb-3">
                    <Avatar alt={app.applicantName} size="md" className="mr-3" />
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-foreground">
                        {app.applicantName}
                      </Text>
                      <Text className="text-sm text-muted-foreground mb-1">
                        {app.applicantEmail}
                      </Text>
                      {app.applicantPhone && (
                        <Text className="text-sm text-muted-foreground">
                          {app.applicantPhone}
                        </Text>
                      )}
                    </View>
                    <Badge variant={getStatusBadgeVariant(app.status)}>
                      {app.status}
                    </Badge>
                  </View>

                  {/* Job Title */}
                  <Text className="text-base font-semibold text-foreground mb-2">
                    Applied for: {app.jobTitle}
                  </Text>

                  {/* Cover Letter Preview */}
                  <Text className="text-sm text-muted-foreground mb-3" numberOfLines={2}>
                    {app.coverLetter}
                  </Text>

                  {/* Applied Date */}
                  <Text className="text-xs text-muted-foreground mb-3">
                    Applied {getRelativeTime(app.appliedAt)}
                  </Text>

                  {/* Actions */}
                  {app.status === 'pending' && (
                    <View className="flex-row">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 mr-2"
                        onPress={() => handleUpdateStatus(app.id, 'shortlisted', app.applicantName)}
                      >
                        Shortlist
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onPress={() => handleUpdateStatus(app.id, 'rejected', app.applicantName)}
                      >
                        Reject
                      </Button>
                    </View>
                  )}

                  {app.status === 'shortlisted' && (
                    <View className="flex-row">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 mr-2"
                        onPress={() => handleUpdateStatus(app.id, 'accepted', app.applicantName)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onPress={() => handleUpdateStatus(app.id, 'rejected', app.applicantName)}
                      >
                        Reject
                      </Button>
                    </View>
                  )}
                </CardContent>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}


