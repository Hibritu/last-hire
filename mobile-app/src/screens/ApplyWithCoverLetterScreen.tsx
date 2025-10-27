import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, Platform, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/HomeStackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import Toast from 'react-native-toast-message';
import endpoints from '../lib/endpoints';

type ApplyWithCoverLetterScreenProps = NativeStackScreenProps<RootStackParamList, 'ApplyWithCoverLetter'>;

const ApplyWithCoverLetterScreen = ({ route, navigation }: ApplyWithCoverLetterScreenProps) => {
  const { jobId, jobTitle } = route.params;
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Cover Letter Required',
        text2: 'Please write a cover letter before submitting your application.',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(endpoints.applications.submit(jobId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cover_letter: coverLetter,
          applied_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Application Submitted!',
          text2: 'Your application has been sent to the employer.',
        });
        // Navigate back to job details or to applications screen
        navigation.goBack();
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: 'Could not submit your application. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground mb-2">Apply for {jobTitle}</Text>
            <Text className="text-lg text-muted-foreground">Write a cover letter to introduce yourself</Text>
          </View>

          <View className="mb-6">
            <Text className="text-base font-medium text-foreground mb-2">Cover Letter</Text>
            <TextInput
              className="h-64 p-4 border border-input rounded-lg bg-background text-foreground text-base"
              multiline
              placeholder="Write your cover letter here..."
              placeholderTextColor="#9CA3AF"
              value={coverLetter}
              onChangeText={setCoverLetter}
              textAlignVertical="top"
            />
          </View>

          <View className="flex-row justify-between">
            <Button 
              variant="outline" 
              className="flex-1 mr-2"
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
            >
              <Text>Cancel</Text>
            </Button>
            <Button 
              className="flex-1 ml-2"
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text>{isSubmitting ? 'Submitting...' : 'Submit Application'}</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ApplyWithCoverLetterScreen;