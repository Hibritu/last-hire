import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, Platform, Linking } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/HomeStackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import Toast from 'react-native-toast-message';
import endpoints from '../lib/endpoints';

type ViewJobScreenProps = NativeStackScreenProps<RootStackParamList, 'ViewJob'>;

const ViewJobScreen = ({ route, navigation }: ViewJobScreenProps) => {
  const { jobId, jobTitle } = route.params;
  const [jobDetails, setJobDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadJobDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(endpoints.jobs.details(jobId));
        if (mounted && res.ok) {
          const data = await res.json();
          setJobDetails(data);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load job details. Please try again.',
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadJobDetails();
    return () => { mounted = false; };
  }, [jobId]);

  const handleApply = () => {
    if (hasApplied) {
      Toast.show({
        type: 'error',
        text1: 'Already Applied',
        text2: 'You have already applied to this job.',
      });
      return;
    }

    // Navigate to the cover letter screen
    navigation.navigate('ApplyWithCoverLetter', {
      jobId: jobId,
      jobTitle: jobTitle
    });
  };

  const handleSaveJob = () => {
    Toast.show({
      type: 'success',
      text1: 'Job Saved',
      text2: 'Job added to your saved jobs.',
    });
  };

  const handleShare = () => {
    Toast.show({
      type: 'info',
      text1: 'Share Job',
      text2: 'Sharing functionality would be implemented here.',
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} className="flex-1">
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
            translucent={Platform.OS === 'android'}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-foreground">Loading job details...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} className="flex-1">
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent={Platform.OS === 'android'}
        />
        <ScrollView className="p-6">
          {/* Job Header */}
          <View className="mb-6">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-foreground mb-2">{jobDetails?.title || jobTitle}</Text>
                <Text className="text-lg text-muted-foreground mb-1">{jobDetails?.company || 'Company Name'}</Text>
                <View className="flex-row items-center">
                  <Text className="text-base text-muted-foreground">{jobDetails?.location || 'Location'}</Text>
                </View>
              </View>
              <View className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center ml-4">
                <Text className="text-2xl font-bold text-primary">{jobDetails?.logo || '🏢'}</Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2 mb-4">
              {jobDetails?.type && <Badge>{jobDetails.type}</Badge>}
              {jobDetails?.remote && <Badge>Remote</Badge>}
              {jobDetails?.salary && <Badge>{jobDetails.salary}</Badge>}
              {jobDetails?.experience && <Badge>{jobDetails.experience} Experience</Badge>}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-8">
            <Button 
              className="flex-1" 
              onPress={handleApply}
              disabled={hasApplied}
            >
              <Text className="text-primary-foreground">
                {hasApplied ? 'Applied' : 'Apply Now'}
              </Text>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onPress={handleSaveJob}
            >
              <Text className="text-accent-foreground">Save</Text>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onPress={handleShare}
            >
              <Text className="text-accent-foreground">Share</Text>
            </Button>
          </View>

          {/* Job Description */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-foreground mb-4">Job Description</Text>
            <Text className="text-base text-foreground leading-relaxed">
              {jobDetails?.description || `This is a placeholder for the job description. The full details for job ID: ${jobId} would be displayed here.`}
            </Text>
          </View>

          {/* Responsibilities */}
          {jobDetails?.responsibilities && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-foreground mb-4">Responsibilities</Text>
              {jobDetails.responsibilities.map((item: string, index: number) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-base text-foreground mr-2">•</Text>
                  <Text className="text-base text-foreground flex-1">{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Requirements */}
          {jobDetails?.requirements && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-foreground mb-4">Requirements</Text>
              {jobDetails.requirements.map((item: string, index: number) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-base text-foreground mr-2">•</Text>
                  <Text className="text-base text-foreground flex-1">{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Benefits */}
          {jobDetails?.benefits && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-foreground mb-4">Benefits</Text>
              <View className="flex-row flex-wrap gap-2">
                {jobDetails.benefits.map((benefit: string, index: number) => (
                  <Badge key={index} variant="secondary">{benefit}</Badge>
                ))}
              </View>
            </View>
          )}

          {/* Company Info */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-foreground mb-4">About the Company</Text>
            <Text className="text-base text-foreground leading-relaxed">
              {jobDetails?.companyDescription || 'No company information available.'}
            </Text>
          </View>

          {/* Apply Button */}
          <Button 
            className="mb-6" 
            onPress={handleApply}
            disabled={hasApplied}
          >
            <Text className="text-primary-foreground">
              {hasApplied ? 'Applied' : 'Apply for this Position'}
            </Text>
          </Button>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ViewJobScreen;