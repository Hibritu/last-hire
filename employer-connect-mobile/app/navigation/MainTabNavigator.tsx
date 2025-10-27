import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import JobsScreen from '../screens/jobs/JobsScreen';
import PostJobScreen from '../screens/jobs/PostJobScreen';
import ApplicationsScreen from '../screens/applications/ApplicationsScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ConversationScreen from '../screens/chat/ConversationScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import PaymentsScreen from '../screens/payments/PaymentsScreen';

const Tab = createBottomTabNavigator();
const JobsStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

// Jobs Stack Navigator
function JobsStackNavigator() {
  return (
    <JobsStack.Navigator>
      <JobsStack.Screen
        name="JobsList"
        component={JobsScreen}
        options={{ title: 'My Jobs' }}
      />
      <JobsStack.Screen
        name="PostJob"
        component={PostJobScreen}
        options={{ title: 'Post New Job' }}
      />
    </JobsStack.Navigator>
  );
}

// Chat Stack Navigator
function ChatStackNavigator() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="ChatList"
        component={ChatScreen}
        options={{ title: 'Messages' }}
      />
      <ChatStack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{ headerShown: false }}
      />
    </ChatStack.Navigator>
  );
}

// More Stack Navigator
function MoreStackNavigator() {
  return (
    <MoreStack.Navigator>
      <MoreStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <MoreStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <MoreStack.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{ title: 'Payments' }}
      />
    </MoreStack.Navigator>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#22c55e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          title: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
          title: 'Jobs',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
          title: 'Applications',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
          title: 'Messages',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal-circle" size={size} color={color} />
          ),
          title: 'More',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;

