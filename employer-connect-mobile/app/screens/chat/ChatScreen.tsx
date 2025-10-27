import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockConversations, Conversation } from '@/lib/mockData';
import { getRelativeTime } from '@/lib/utils';

export default function ChatScreen() {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading messages..." />;
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        title="No messages yet"
        description="Messages from applicants will appear here"
      />
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22c55e']} />
      }
    >
      <View className="p-4">
        {conversations.map(conversation => (
          <TouchableOpacity
            key={conversation.id}
            onPress={() => {
              navigation.navigate('Conversation' as never, {
                conversationId: conversation.id,
                applicantName: conversation.applicantName,
                jobTitle: conversation.jobTitle,
              } as never);
            }}
          >
            <Card className="mb-3">
              <CardContent className="pt-4">
                <View className="flex-row items-start">
                  <Avatar
                    alt={conversation.applicantName}
                    size="md"
                    className="mr-3"
                  />
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                      <Text className="text-base font-bold text-foreground flex-1">
                        {conversation.applicantName}
                      </Text>
                      <Text className="text-xs text-muted-foreground ml-2">
                        {getRelativeTime(conversation.lastMessageTime)}
                      </Text>
                    </View>
                    <Text className="text-sm text-muted-foreground mb-2">
                      {conversation.jobTitle}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text
                        className="text-sm text-foreground flex-1"
                        numberOfLines={1}
                      >
                        {conversation.lastMessage}
                      </Text>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="ml-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}


