import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/HomeStackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import Toast from 'react-native-toast-message';
import endpoints from '../lib/endpoints';

type JobDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'JobDetails'>;

const JobDetailsScreen = ({ route, navigation }: JobDetailsScreenProps) => {
  const { jobId, jobTitle } = route.params;
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [jobDetails, setJobDetails] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(endpoints.jobs.details(jobId));
        if (mounted && res.ok) {
          setJobDetails(await res.json());
        }
      } catch {
        // ignore — keep null to use placeholders
      }
    };
    load();
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} className="flex-1">
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent={Platform.OS === 'android'}
        />
        <ScrollView className="p-6">
          <Text className="text-2xl font-bold text-foreground mb-2">{jobDetails?.title || jobTitle}</Text>
          <Text className="text-lg text-muted-foreground mb-4">{jobDetails?.company || 'Company Name'}</Text>

          <View className="flex-row gap-2 mb-4">
            {jobDetails?.type && <Badge>{jobDetails.type}</Badge>}
            {jobDetails?.remote ? <Badge>Remote</Badge> : null}
          </View>

          <Text className="text-base text-foreground leading-relaxed">
            {jobDetails?.description || `This is a placeholder for the job description. The full details for job ID: ${jobId} would be displayed here.`}
          </Text>

          <Button
            className="mt-6"
            onPress={handleApply}
            disabled={isApplying || hasApplied}
          >
            <Text>
              {isApplying ? 'Applying...' : hasApplied ? 'Applied' : 'Apply Now'}
            </Text>
          </Button>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default JobDetailsScreen;
