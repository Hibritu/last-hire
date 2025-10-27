import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import AuthService from '@/services/authService';
import { User } from '@/lib/mockData';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email,
          phone: currentUser.phone || '',
          companyName: currentUser.companyName || '',
          companyWebsite: currentUser.companyWebsite || '',
          companyDescription: currentUser.companyDescription || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            // Navigation handled by RootNavigator
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-foreground">Failed to load profile</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Profile Header */}
        <View className="items-center mb-6">
          <Avatar
            alt={user.name}
            size="xl"
            className="mb-4"
          />
          <Text className="text-2xl font-bold text-foreground">
            {user.companyName || user.name}
          </Text>
          <Text className="text-muted-foreground">{user.email}</Text>
          {user.verified && (
            <View className="flex-row items-center mt-2">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <Text className="text-sm text-green-600">Verified Account</Text>
            </View>
          )}
        </View>

        {/* Edit/Save Button */}
        <Button
          variant={isEditing ? 'secondary' : 'default'}
          onPress={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
          className="mb-6"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>

        {/* Profile Form */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Personal Information
            </Text>

            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              editable={isEditing}
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              editable={isEditing}
            />

            <Input
              label="Email"
              value={formData.email}
              editable={false}
              containerClassName="mb-0"
            />
            <Text className="text-xs text-muted-foreground mb-4">
              Email cannot be changed
            </Text>

            <Input
              label="Phone"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              editable={isEditing}
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-4">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Company Information
            </Text>

            <Input
              label="Company Name"
              value={formData.companyName}
              onChangeText={(text) => setFormData({ ...formData, companyName: text })}
              editable={isEditing}
            />

            <Input
              label="Company Website"
              value={formData.companyWebsite}
              onChangeText={(text) => setFormData({ ...formData, companyWebsite: text })}
              editable={isEditing}
            />

            <TextArea
              label="Company Description"
              value={formData.companyDescription}
              onChangeText={(text) => setFormData({ ...formData, companyDescription: text })}
              editable={isEditing}
            />
          </CardContent>
        </Card>

        {isEditing && (
          <Button
            onPress={handleSave}
            loading={isSaving}
            className="mb-6"
          >
            Save Changes
          </Button>
        )}

        {/* Logout Button */}
        <Button
          variant="destructive"
          onPress={handleLogout}
          className="mb-6"
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}


