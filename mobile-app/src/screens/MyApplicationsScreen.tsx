import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/HomeStackNavigator';
import { applications as localApplications, savedJobs as localSavedJobs } from '../lib/data';
import endpoints from '../lib/endpoints';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import Toast from 'react-native-toast-message';

type MyApplicationsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ApplyWithCoverLetter'
>;

const MyApplicationsScreen = () => {
  const navigation = useNavigation<MyApplicationsNavigationProp>();
  const [activeTab, setActiveTab] = useState("all");
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [mySavedJobs, setMySavedJobs] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [appsRes, savedRes] = await Promise.all([
          fetch(endpoints.applications.list()),
          fetch(endpoints.jobs.saved()),
        ]);

        if (mounted) {
          if (appsRes.ok) {
            setMyApplications(await appsRes.json());
          } else {
            setMyApplications(localApplications);
          }

          if (savedRes.ok) {
            setMySavedJobs(await savedRes.json());
          } else {
            setMySavedJobs(localSavedJobs);
          }
        }
      } catch (err) {
        // network failed -> fallback to local data
        if (mounted) {
          setMyApplications(localApplications);
          setMySavedJobs(localSavedJobs);
        }
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  const handleUnsave = (jobId: string) => {
    setMySavedJobs((prev) => prev.filter((job) => job.id !== jobId));
    // Try backend delete
    (async () => {
      try {
        await fetch(endpoints.jobs.unsave(jobId), { method: 'DELETE' });
      } catch {}
    })();
    Toast.show({ type: 'error', text1: 'Job Unsaved', text2: 'Job removed from your saved jobs.' });
  };

  const handleApply = (jobId: string, jobTitle: string) => {
    // Navigate to the cover letter screen
    navigation.navigate('ApplyWithCoverLetter', {
      jobId: jobId,
      jobTitle: jobTitle
    });
  };

  const handleViewJob = (jobId: string, jobTitle: string) => {
    navigation.navigate('ViewJob', {
      jobId: jobId,
      jobTitle: jobTitle
    });
  };

  const handleMessageHR = (companyName: string) => {
    Toast.show({
      type: 'info',
      text1: 'Opening Messages',
      text2: `Starting conversation with ${companyName} HR...`,
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "Under Review",
      shortlisted: "Shortlisted",
      rejected: "Not Selected",
      accepted: "Offer Extended",
    };
    return statusMap[status] || status;
  };

  const filteredApplications = myApplications.filter((app) => {
    if (activeTab === "all") return true;
    if (activeTab === "saved") return false;
    return app.status === activeTab;
  });

  const stats = {
    total: myApplications.length,
    pending: myApplications.filter((app) => app.status === "pending").length,
    shortlisted: myApplications.filter((app) => app.status === "shortlisted").length,
    accepted: myApplications.filter((app) => app.status === "accepted").length,
    rejected: myApplications.filter((app) => app.status === "rejected").length,
    saved: mySavedJobs.length,
  };

  const renderApplicationCard = (application: any) => (
    <Card key={application.id} className="p-4 mb-4">
      <View className="flex-row items-start">
        <View className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
          <Text className="text-lg font-bold text-primary">{application.logo}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-lg font-semibold text-foreground">{application.jobTitle}</Text>
              <Text className="text-base text-muted-foreground">{application.company}</Text>
            </View>
            <Badge className={`${application.statusColor} text-white`}>
              {getStatusText(application.status)}
            </Badge>
          </View>
          <View className="mt-2">
            <Text className="text-sm text-muted-foreground">Applied: {application.appliedDate}</Text>
            <Text className="text-sm text-foreground">Next Step: {application.nextStep}</Text>
          </View>
          <View className="flex-row mt-4">
            <Button variant="outline" size="sm" className="mr-2" onPress={() => handleViewJob(application.id, application.jobTitle)}>
              <Text className="text-foreground">View Job</Text>
            </Button>
            <Button variant="outline" size="sm" onPress={() => handleMessageHR(application.company)}>
              <Text className="text-foreground">Message HR</Text>
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderSavedJobCard = (job: any) => (
    <Card key={job.id} className="p-4 mb-4">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
          <Text className="text-lg font-bold text-primary">{job.logo}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">{job.title}</Text>
          <Text className="text-base text-muted-foreground">{job.company}</Text>
        </View>
        <View className="flex-row">
          <Button variant="outline" size="sm" className="mr-2" onPress={() => handleUnsave(job.id)}>
            <Text className="text-foreground">Unsave</Text>
          </Button>
          <Button size="sm" onPress={() => handleApply(job.id, job.title)}>
            <Text className="text-primary-foreground">Apply</Text>
          </Button>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}} className="flex-1">
        <StatusBar 
          backgroundColor="transparent" 
          barStyle="dark-content" 
          translucent={Platform.OS === 'android'} 
        />
        <ScrollView className="p-4">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2">My Applications</Text>
            <Text className="text-lg text-muted-foreground">Track your job applications and their progress</Text>
          </View>

          <View className="grid grid-cols-3 gap-2 mb-8">
            {/* Stats will be implemented later */}
          </View>

          <View className="flex-row mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Button variant={activeTab === 'all' ? 'default' : 'outline'} onPress={() => setActiveTab('all')} className="mr-2">
                <Text className={activeTab === 'all' ? 'text-primary-foreground' : 'text-foreground'}>All</Text>
              </Button>
              <Button variant={activeTab === 'pending' ? 'default' : 'outline'} onPress={() => setActiveTab('pending')} className="mr-2">
                <Text className={activeTab === 'pending' ? 'text-primary-foreground' : 'text-foreground'}>Pending</Text>
              </Button>
              <Button variant={activeTab === 'shortlisted' ? 'default' : 'outline'} onPress={() => setActiveTab('shortlisted')} className="mr-2">
                <Text className={activeTab === 'shortlisted' ? 'text-primary-foreground' : 'text-foreground'}>Shortlisted</Text>
              </Button>
              <Button variant={activeTab === 'accepted' ? 'default' : 'outline'} onPress={() => setActiveTab('accepted')} className="mr-2">
                <Text className={activeTab === 'accepted' ? 'text-primary-foreground' : 'text-foreground'}>Accepted</Text>
              </Button>
              <Button variant={activeTab === 'rejected' ? 'default' : 'outline'} onPress={() => setActiveTab('rejected')} className="mr-2">
                <Text className={activeTab === 'rejected' ? 'text-primary-foreground' : 'text-foreground'}>Rejected</Text>
              </Button>
              <Button variant={activeTab === 'saved' ? 'default' : 'outline'} onPress={() => setActiveTab('saved')}>
                <Text className={activeTab === 'saved' ? 'text-primary-foreground' : 'text-foreground'}>Saved</Text>
              </Button>
            </ScrollView>
          </View>

          {activeTab !== 'saved' && filteredApplications.map(renderApplicationCard)}
          {activeTab === 'saved' && mySavedJobs.map(renderSavedJobCard)}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyApplicationsScreen;