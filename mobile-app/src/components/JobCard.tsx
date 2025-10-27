import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Bookmark, MapPin } from 'lucide-react-native';

type JobCardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ViewJob'
>;

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type?: string;
  salary?: string;
  applicants?: number;
  skills?: string[];
  tags?: string[];
  logo: string;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
  onApply?: (id: string, title: string) => void;
}

export const JobCard = ({
  id,
  title,
  company,
  location,
  type,
  salary,
  applicants,
  skills,
  tags,
  logo,
  isBookmarked = false,
  onBookmark,
  onApply,
}: JobCardProps) => {
  const navigation = useNavigation<JobCardNavigationProp>();

  return (
    <Pressable
      onPress={() => navigation.navigate('ViewJob', { jobId: id, jobTitle: title })}
    >
      <Card className="p-6 m-2 border-border bg-card">
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Text className="text-lg font-bold text-primary">{logo}</Text>
            </View>
            <View>
              <Text className="text-sm text-muted-foreground">{company}</Text>
              {applicants && (
                <Text className="text-xs text-muted-foreground">
                  +{applicants} Applied
                </Text>
              )}
            </View>
          </View>
          <Button
            variant="ghost"
            size="icon"
            onPress={(e) => { e.stopPropagation(); onBookmark?.(id); }}
          >
            <Bookmark
              className={'text-primary'}
              size={20}
              fill={isBookmarked ? 'hsl(140 80% 40%)' : 'none'}
            />
          </Button>
        </View>

        <Text className="text-lg font-semibold text-foreground mb-2">{title}</Text>
        
        <View className="flex-row items-center gap-2 mb-4 flex-wrap">
          <View className="flex-row items-center gap-1">
            <MapPin className="text-muted-foreground" size={14} />
            <Text className="text-sm text-muted-foreground">{location}</Text>
          </View>
          {type && (
            <>
              <Text className="text-sm text-muted-foreground">•</Text>
              <Text className="text-sm text-muted-foreground">{type}</Text>
            </>
          )}
          {salary && (
            <>
              <Text className="text-sm text-muted-foreground">•</Text>
              <Text className="text-sm font-medium text-foreground">{salary}</Text>
            </>
          )}
        </View>

        <View className="flex flex-row flex-wrap gap-2 mb-4">
          {(skills || tags || []).map((item) => (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          ))}
        </View>

        <View className="flex-row gap-2">
          <Button
            className="flex-1 bg-primary"
            size="sm"
            onPress={(e) => { e.stopPropagation(); onApply?.(id, title); }}
          >
            Apply
          </Button>
        </View>
      </Card>
    </Pressable>
  );
};
