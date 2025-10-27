import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import JobService, { JobData } from '@/services/jobService';

export default function PostJobScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<JobData>({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    category: '',
    location: '',
    expiryDate: '',
    listingType: 'free',
    employmentType: 'full_time',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof JobData, string>>>({});

  // Get categories and locations
  const categories = JobService.getJobCategories();
  const locations = JobService.getJobLocations();

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof JobData, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await JobService.createJob(formData);
      Alert.alert('Success', 'Job posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error posting job:', error);
      Alert.alert('Error', 'Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-foreground mb-2">
          Post a New Job
        </Text>
        <Text className="text-muted-foreground mb-6">
          Fill in the details to create a job posting
        </Text>

        <Input
          label="Job Title *"
          placeholder="e.g. Senior Software Developer"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          error={errors.title}
        />

        <TextArea
          label="Job Description *"
          placeholder="Describe the role, responsibilities, and what makes your company great..."
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          error={errors.description}
        />

        <TextArea
          label="Requirements *"
          placeholder="List the required skills, experience, and qualifications..."
          value={formData.requirements}
          onChangeText={(text) => setFormData({ ...formData, requirements: text })}
          error={errors.requirements}
        />

        <Select
          label="Category *"
          placeholder="Select category"
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          options={categories.map(cat => ({ label: cat, value: cat }))}
          error={errors.category}
        />

        <Select
          label="Location *"
          placeholder="Select location"
          value={formData.location}
          onValueChange={(value) => setFormData({ ...formData, location: value })}
          options={locations.map(loc => ({ label: loc, value: loc }))}
          error={errors.location}
        />

        <Input
          label="Salary Range"
          placeholder="e.g. 30000-50000 ETB"
          value={formData.salary}
          onChangeText={(text) => setFormData({ ...formData, salary: text })}
        />

        <Select
          label="Employment Type"
          placeholder="Select employment type"
          value={formData.employmentType}
          onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
          options={[
            { label: 'Full Time', value: 'full_time' },
            { label: 'Part Time', value: 'part_time' },
            { label: 'Contract', value: 'contract' },
            { label: 'Internship', value: 'internship' },
          ]}
        />

        <Input
          label="Expiry Date *"
          placeholder="YYYY-MM-DD"
          value={formData.expiryDate}
          onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
          error={errors.expiryDate}
        />

        <Select
          label="Listing Type"
          placeholder="Select listing type"
          value={formData.listingType}
          onValueChange={(value) => setFormData({ ...formData, listingType: value })}
          options={[
            { label: 'Free (Basic)', value: 'free' },
            { label: 'Basic (200 ETB)', value: 'basic' },
            { label: 'Premium (500 ETB)', value: 'premium' },
            { label: 'Featured (750 ETB)', value: 'featured' },
          ]}
        />

        <Button
          onPress={handleSubmit}
          loading={isLoading}
          className="mt-6"
        >
          Post Job
        </Button>

        <Button
          variant="outline"
          onPress={() => navigation.goBack()}
          className="mt-3 mb-6"
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
}


