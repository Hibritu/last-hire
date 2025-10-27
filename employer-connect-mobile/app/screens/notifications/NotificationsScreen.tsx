import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockNotifications, Notification } from '@/lib/mockData';
import { getRelativeTime } from '@/lib/utils';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    // Returns emoji based on notification type
    switch (type) {
      case 'application': return '📝';
      case 'payment': return '💳';
      case 'job': return '💼';
      case 'system': return '🔔';
      default: return '📩';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading notifications..." />;
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      {notifications.length > 0 && (
        <View className="bg-card border-b border-border px-4 py-3 flex-row justify-between items-center">
          <Text className="text-foreground font-semibold">
            {unreadCount} unread
          </Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Text className="text-primary font-semibold">Mark all as read</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You're all caught up! Notifications will appear here."
        />
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22c55e']} />
          }
        >
          <View className="p-4">
            {notifications.map(notification => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => handleMarkAsRead(notification.id)}
              >
                <Card
                  className={`mb-3 ${
                    !notification.read ? 'border-l-4 border-l-primary' : ''
                  }`}
                >
                  <CardContent className="pt-4">
                    <View className="flex-row items-start">
                      <Text className="text-2xl mr-3">
                        {getNotificationIcon(notification.type)}
                      </Text>
                      <View className="flex-1">
                        <View className="flex-row justify-between items-start mb-1">
                          <Text
                            className={`text-base flex-1 ${
                              !notification.read
                                ? 'font-bold text-foreground'
                                : 'text-foreground'
                            }`}
                          >
                            {notification.title}
                          </Text>
                          {!notification.read && (
                            <View className="w-2 h-2 bg-primary rounded-full ml-2 mt-2" />
                          )}
                        </View>
                        <Text className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {getRelativeTime(notification.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}


