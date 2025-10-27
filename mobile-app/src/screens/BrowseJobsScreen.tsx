

import React, { useState, useMemo } from 'react';
import { SafeAreaView, ScrollView, View, Text, FlatList, StatusBar, Platform } from 'react-native';
import { JobCard } from '../components/JobCard';
import SearchHeader from '../components/SearchHeader';
import { allJobs, categories } from '../lib/data';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';

const BrowseJobsScreen = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filteredJobs = useMemo(() => {
    let filtered = allJobs;

    if (searchValue) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.company.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    if (activeCategory !== "All") {
      filtered = filtered.filter(job => job.category === activeCategory);
    }

    switch (sortBy) {
      case "date":
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case "salary":
        filtered.sort((a, b) => {
          const getSalaryValue = (salary: string) => {
            const match = salary.match(/\$(\d+)k/);
            return match ? parseInt(match[1]) : 0;
          };
          return getSalaryValue(b.salary) - getSalaryValue(a.salary);
        });
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }

    return filtered;
  }, [searchValue, activeCategory, sortBy]);

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

  const handleApply = (jobId: string) => {
    if (appliedJobs.includes(jobId)) {
      Toast.show({
        type: 'error',
        text1: 'Already Applied',
        text2: 'You have already applied to this job.',
      });
      return;
    }

    setAppliedJobs(prev => [...prev, jobId]);
    Toast.show({
      type: 'success',
      text1: 'Application Submitted!',
      text2: 'Your application has been sent to the employer.',
    });
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    Toast.show({
      type: 'info',
      text1: 'Loading More Jobs',
      text2: 'Fetching additional job listings...',
    });
    setTimeout(() => {
      setIsLoadingMore(false);
      Toast.show({
        type: 'success',
        text1: 'More Jobs Loaded',
        text2: 'New job listings have been added.',
      });
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
      <StatusBar 
        backgroundColor="transparent" 
        barStyle="dark-content" 
        translucent={Platform.OS === 'android'} 
      />
      <ScrollView className="pb-4">
        <View className="px-4">
          <Text className="text-3xl font-bold mb-2">Find Your Dream Job</Text>
          <Text className="text-lg text-muted-foreground mb-4">Explore thousands of opportunities from top companies</Text>
        </View>

        <SearchHeader value={searchValue} onChange={setSearchValue} />

        <View className="px-4 mt-4">
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Button
                variant={activeCategory === item ? 'default' : 'outline'}
                className="mr-2"
                onPress={() => setActiveCategory(item)}
              >
                <Text>{item}</Text>
              </Button>
            )}
          />
        </View>

        <View className="px-4 mt-6">
          <Card className="p-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} of {allJobs.length} jobs
              </Text>
              <Picker
                selectedValue={sortBy}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => setSortBy(itemValue)}
              >
                <Picker.Item label="Relevance" value="relevance" />
                <Picker.Item label="Date Posted" value="date" />
                <Picker.Item label="Salary" value="salary" />
                <Picker.Item label="Company Rating" value="rating" />
              </Picker>
            </View>
          </Card>
        </View>

        {filteredJobs.length > 0 ? (
          <View className="px-2 mt-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                isBookmarked={savedJobs.includes(job.id)}
                onBookmark={() => handleSave(job.id)}
                onApply={() => handleApply(job.id)}
              />
            ))}
          </View>
        ) : (
          <Card className="p-8 text-center mx-4 mt-6">
            <Text className="text-lg font-semibold mb-2">No Jobs Found</Text>
            <Text className="text-muted-foreground mb-4">No jobs match your current search criteria.</Text>
            <Button 
              variant="outline" 
              onPress={() => {
                setSearchValue("");
                setActiveCategory("All");
              }}
            >
              <Text>Clear Filters</Text>
            </Button>
          </Card>
        )}

        {filteredJobs.length > 0 && (
          <View className="px-4 py-8 items-center">
            <Button size="lg" variant="outline" onPress={handleLoadMore} disabled={isLoadingMore}>
              <Text>{isLoadingMore ? 'Loading...' : 'Load More Jobs'}</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrowseJobsScreen;
