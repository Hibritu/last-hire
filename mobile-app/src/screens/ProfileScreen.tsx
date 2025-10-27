import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  profileData as initialProfile,
  skillsData as initialSkills,
  experienceData as initialExperience,
  educationData as initialEducation,
} from '../lib/data';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>({ ...initialProfile });
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [skills, setSkills] = useState<string[]>([...initialSkills]);
  const [newSkill, setNewSkill] = useState('');
  const [experience] = useState<any[]>([...initialExperience]);
  const [education] = useState<any[]>([...initialEducation]);

  const handleSaveBio = () => {
    setIsEditingBio(false);
    Toast.show({ type: 'success', text1: 'Bio Updated', text2: 'Your bio has been saved.' });
  };

  const handleAddSkill = () => {
    const val = newSkill.trim();
    if (!val) return;
    if (!skills.includes(val)) {
      setSkills((s) => [...s, val]);
      setNewSkill('');
      Toast.show({ type: 'success', text1: 'Skill Added', text2: `${val} added to skills.` });
    } else {
      Toast.show({ type: 'info', text1: 'Skill Exists', text2: `${val} is already listed.` });
    }
  };

  const handleRemoveSkill = (item: string) => {
    setSkills((s) => s.filter((k) => k !== item));
    Toast.show({ type: 'info', text1: 'Skill Removed', text2: `${item} removed.` });
  };

  const handleResumeDownload = () => {
    Toast.show({ type: 'info', text1: 'Download Started', text2: 'Downloading resume (mock)...' });
    setTimeout(() => Toast.show({ type: 'success', text1: 'Download Complete', text2: 'Resume downloaded.' }), 1500);
  };

  const handleResumeUpload = () => {
    Toast.show({ type: 'info', text1: 'Upload', text2: 'Uploading resume (mock)...' });
    setTimeout(() => Toast.show({ type: 'success', text1: 'Upload Complete', text2: 'Resume uploaded.' }), 1500);
  };

  const handlePhotoUpload = () => {
    Toast.show({ type: 'info', text1: 'Photo', text2: 'Uploading photo (mock)...' });
    setTimeout(() => Toast.show({ type: 'success', text1: 'Photo Updated', text2: 'Profile photo updated.' }), 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 16 }} className="px-4 py-8">
          <View className="mb-8">
            <Text className="text-4xl font-bold mb-2">My Profile</Text>
            <Text className="text-muted-foreground text-lg">Manage your profile information and preferences</Text>
          </View>

          <View className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card (span full width on mobile) */}
            <View className="lg:col-span-1 mb-6">
              <Card>
                <View className="p-6">
                  <View className="items-center mb-6">
                    <TouchableOpacity onPress={handlePhotoUpload} className="mb-4">
                      <Image source={{ uri: 'https://via.placeholder.com/96' }} className="h-24 w-24 rounded-full" />
                    </TouchableOpacity>
                    <Button className="mb-4" onPress={handlePhotoUpload}>Change Photo</Button>
                    <Text className="text-2xl font-bold">{profile.name}</Text>
                    <Text className="text-muted-foreground">{profile.title}</Text>
                  </View>

                  <View className="space-y-3">
                    <View className="flex-row items-center gap-2 text-sm">
                      <Text className="text-muted-foreground">{profile.email}</Text>
                    </View>
                    <View className="flex-row items-center gap-2 text-sm">
                      <Text className="text-muted-foreground">{profile.phone}</Text>
                    </View>
                    <View className="flex-row items-center gap-2 text-sm">
                      <Text className="text-muted-foreground">{profile.location}</Text>
                    </View>
                    <View className="flex-row items-center gap-2 text-sm">
                      <Text className="text-muted-foreground">Member since January 2024</Text>
                    </View>
                  </View>

                  <View className="mt-6">
                    <Button className="w-full mb-2" onPress={handleResumeDownload}>Download Resume</Button>
                    <Button className="outline w-full" onPress={handleResumeUpload}>Upload New Resume</Button>
                  </View>
                </View>
              </Card>
            </View>

            {/* Main Content */}
            <View className="lg:col-span-2">
              <View className="space-y-6">
                {/* Bio */}
                <Card>
                  <View className="p-4 flex-row items-center justify-between">
                    <Text className="text-lg font-semibold">About Me</Text>
                    <Button className="outline" onPress={() => setIsEditingBio(!isEditingBio)}>Edit</Button>
                  </View>
                  <View className="p-4">
                    {isEditingBio ? (
                      <>
                        <TextInput
                          value={profile.bio}
                          onChangeText={(t) => setProfile((p: any) => ({ ...p, bio: t }))}
                          multiline
                          className="min-h-[100px] border border-border rounded-md p-3 bg-card"
                        />
                        <View className="flex-row gap-2 mt-2">
                          <Button onPress={handleSaveBio}>Save</Button>
                          <Button className="outline" onPress={() => setIsEditingBio(false)}>Cancel</Button>
                        </View>
                      </>
                    ) : (
                      <Text className="text-muted-foreground">{profile.bio}</Text>
                    )}
                  </View>
                </Card>

                {/* Skills */}
                <Card>
                  <View className="p-4 flex-row items-center justify-between">
                    <Text className="text-lg font-semibold flex-row items-center gap-2">Skills</Text>
                    <View className="flex-row items-center">
                      <TextInput
                        placeholder="e.g., React"
                        value={newSkill}
                        onChangeText={setNewSkill}
                        className="border border-border rounded-md p-2 mr-2 bg-card"
                      />
                      <Button onPress={handleAddSkill}>Add Skill</Button>
                    </View>
                  </View>
                  <View className="p-4 flex-row flex-wrap gap-2">
                    <View className="flex-row flex-wrap">
                      {skills.map((item) => (
                        <Badge key={item} className="mr-2 mb-2">
                          <View className="flex-row items-center">
                            <Text className="mr-2">{item}</Text>
                            <TouchableOpacity onPress={() => handleRemoveSkill(item)}>
                              <Text className="text-red-500 text-xs">×</Text>
                            </TouchableOpacity>
                          </View>
                        </Badge>
                      ))}
                    </View>
                  </View>
                </Card>

                {/* Experience */}
                <Card>
                  <View className="p-4">
                    <Text className="text-lg font-semibold mb-2">Experience</Text>
                    {experience.map((exp) => (
                      <View key={exp.id} className="border-l-4 border-primary pl-4 mb-4">
                        <Text className="font-semibold text-lg">{exp.position}</Text>
                        <Text className="text-primary font-medium">{exp.company}</Text>
                        <Text className="text-sm text-muted-foreground">{exp.duration}</Text>
                        <Text className="text-muted-foreground">{exp.description}</Text>
                      </View>
                    ))}
                  </View>
                </Card>

                {/* Education */}
                <Card>
                  <View className="p-4">
                    <Text className="text-lg font-semibold mb-2">Education</Text>
                    {education.map((edu) => (
                      <View key={edu.id} className="border-l-4 border-primary pl-4 mb-4">
                        <Text className="font-semibold text-lg">{edu.degree}</Text>
                        <Text className="text-primary font-medium">{edu.school}</Text>
                        <Text className="text-sm text-muted-foreground">{edu.duration}</Text>
                      </View>
                    ))}
                  </View>
                </Card>
              </View>
            </View>
          </View>
        </ScrollView>

        <Toast />
      </View>
    </SafeAreaView>
  );
}
