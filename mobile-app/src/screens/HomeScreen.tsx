import React, { useState, useMemo } from 'react';
import { SafeAreaView, ScrollView, View, Text, FlatList, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/HomeStackNavigator';
import { JobCard } from '../components/JobCard';
import SearchHeader from '../components/SearchHeader';
import { featuredJobs, regularJobs, categories, stats } from '../lib/data';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Toast from 'react-native-toast-message';
import { Briefcase, TrendingUp, Zap } from 'lucide-react-native';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ApplyWithCoverLetter'>>();
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Jobs");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // New filter states
  const [jobType, setJobType] = useState("All Types");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [salaryRange, setSalaryRange] = useState("All Salaries");

  const filteredFeaturedJobs = useMemo(() => {
    let filtered = featuredJobs;
    
    // Filter by search value
    if (searchValue) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.company.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }
    
    // Filter by category
    if (activeCategory !== "All Jobs") {
      filtered = filtered.filter(job => job.category === activeCategory);
    }
    
    // Filter by job type
    if (jobType !== "All Types") {
      filtered = filtered.filter(job => job.type === jobType);
    }
    
    // Filter by remote only
    if (remoteOnly) {
      filtered = filtered.filter(job => job.remote === true);
    }
    
    // Filter by salary range
    if (salaryRange !== "All Salaries") {
      filtered = filtered.filter(job => {
        if (!job.salary) return false;
        const salaryValue = parseInt(job.salary.replace(/[^0-9]/g, ''));
        switch (salaryRange) {
          case "Under $50k":
            return salaryValue < 50000;
          case "$50k - $100k":
            return salaryValue >= 50000 && salaryValue <= 100000;
          case "Over $100k":
            return salaryValue > 100000;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [searchValue, activeCategory, featuredJobs, jobType, remoteOnly, salaryRange]);

  const filteredRegularJobs = useMemo(() => {
    let filtered = regularJobs;
    
    // Filter by search value
    if (searchValue) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.company.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }
    
    // Filter by category
    if (activeCategory !== "All Jobs") {
      filtered = filtered.filter(job => job.category === activeCategory);
    }
    
    // Filter by job type
    if (jobType !== "All Types") {
      filtered = filtered.filter(job => job.type === jobType);
    }
    
    // Filter by remote only
    if (remoteOnly) {
      filtered = filtered.filter(job => job.remote === true);
    }
    
    // Filter by salary range
    if (salaryRange !== "All Salaries") {
      filtered = filtered.filter(job => {
        if (!job.salary) return false;
        const salaryValue = parseInt(job.salary.replace(/[^0-9]/g, ''));
        switch (salaryRange) {
          case "Under $50k":
            return salaryValue < 50000;
          case "$50k - $100k":
            return salaryValue >= 50000 && salaryValue <= 100000;
          case "Over $100k":
            return salaryValue > 100000;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [searchValue, activeCategory, regularJobs, jobType, remoteOnly, salaryRange]);

  const handleSave = (jobId: string) => {
    setSavedJobs(prev => {
      const isAlreadySaved = prev.includes(jobId);
      const newSavedJobs = isAlreadySaved 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId];
      
      Toast.show({
        type: isAlreadySaved ? 'error' : 'success',
        text1: isAlreadySaved ? 'Job Unsaved' : 'Job Saved!',
        text2: isAlreadySaved 
          ? 'Job removed from your saved jobs.' 
          : 'Job added to your saved jobs.',
      });
      
      return newSavedJobs;
    });
  };

  const handleApply = (jobId: string, jobTitle: string) => {
    if (appliedJobs.includes(jobId)) {
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

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    Toast.show({
      type: 'info',
      text1: 'Loading More Jobs',
      text2: 'Fetching additional job listings...',
    });
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoadingMore(false);
      Toast.show({
        type: 'success',
        text1: 'More Jobs Loaded',
        text2: 'New job listings have been added.',
      });
    }, 1500);
  };

  // Job type options
  const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Freelance", "Internship"];
  
  // Salary range options
  const salaryRanges = ["All Salaries", "Under $50k", "$50k - $100k", "Over $100k"];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}} className="flex-1">
        <StatusBar 
          backgroundColor="transparent" 
          barStyle="dark-content" 
          translucent={Platform.OS === 'android'} 
        />
        <ScrollView className="pb-4">
          <SearchHeader value={searchValue} onChange={setSearchValue} />

          {/* Stats */}
          <View className="px-4 py-6">
            <View className="flex-row justify-around">
              {stats.map((stat, index) => (
                <View key={stat.label} className="items-center">
                  {index === 0 && <Briefcase className={stat.color} />}
                  {index === 1 && <TrendingUp className={stat.color} />}
                  {index === 2 && <Zap className={stat.color} />}
                  <Text className="text-2xl font-bold text-foreground">{stat.value}</Text>
                  <Text className="text-muted-foreground">{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Filters */}
          <View className="px-4 py-2">
            {/* Job Type Filter */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-foreground mb-2">Job Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row">
                  {jobTypes.map((item) => (
                    <Button
                      key={item}
                      variant={jobType === item ? 'default' : 'outline'}
                      className="mr-2"
                      onPress={() => setJobType(item)}
                    >
                      <Text className={jobType === item ? 'text-primary-foreground' : 'text-foreground'}>
                        {item}
                      </Text>
                    </Button>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Salary Range Filter */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-foreground mb-2">Salary Range</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row">
                  {salaryRanges.map((item) => (
                    <Button
                      key={item}
                      variant={salaryRange === item ? 'default' : 'outline'}
                      className="mr-2"
                      onPress={() => setSalaryRange(item)}
                    >
                      <Text className={salaryRange === item ? 'text-primary-foreground' : 'text-foreground'}>
                        {item}
                      </Text>
                    </Button>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Remote Only Toggle */}
            <View className="mb-4">
              <Button
                variant={remoteOnly ? 'default' : 'outline'}
                className="w-40"
                onPress={() => setRemoteOnly(!remoteOnly)}
              >
                <Text className={remoteOnly ? 'text-primary-foreground' : 'text-foreground'}>
                  {remoteOnly ? 'Remote Only' : 'Remote Only'}
                </Text>
              </Button>
            </View>
          </View>

          {/* Categories */}
          <View className="px-4 py-2">
            <Text className="text-lg font-semibold text-foreground mb-2">Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {categories.map((item) => (
                  <Button
                    key={item}
                    variant={activeCategory === item ? 'default' : 'outline'}
                    className="mr-2"
                    onPress={() => setActiveCategory(item)}
                  >
                    <Text className={activeCategory === item ? 'text-primary-foreground' : 'text-foreground'}>
                      {item}
                    </Text>
                  </Button>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Featured Jobs */}
          <View className="px-4 py-6">
            <Text className="text-2xl font-semibold text-foreground mb-4">Featured Opportunities</Text>
            {filteredFeaturedJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                isBookmarked={savedJobs.includes(job.id)}
                onBookmark={() => handleSave(job.id)}
                onApply={(id, title) => handleApply(id, title)}
              />
            ))}
          </View>

          {/* Regular Jobs */}
          <View className="px-4 py-6">
            <Text className="text-2xl font-semibold text-foreground mb-4">Latest Jobs</Text>
            {filteredRegularJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                isBookmarked={savedJobs.includes(job.id)}
                onBookmark={() => handleSave(job.id)}
                onApply={(id, title) => handleApply(id, title)}
              />
            ))}
          </View>

          {/* Load More */}
          <View className="px-4 py-8 items-center">
            <Button size="lg" onPress={handleLoadMore} disabled={isLoadingMore}>
              <Text className="text-primary-foreground">{isLoadingMore ? 'Loading...' : 'Load More Jobs'}</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;