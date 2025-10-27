import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Briefcase, MessageSquare, User, Search } from 'lucide-react-native';

import HomeStackNavigator from './HomeStackNavigator';
import BrowseJobsScreen from '../screens/BrowseJobsScreen';
import MyApplicationsScreen from '../screens/MyApplicationsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;

          if (route.name === 'HomeStack') {
            IconComponent = Home;
          } else if (route.name === 'Browse') {
            IconComponent = Search;
          } else if (route.name === 'MyApplications') {
            IconComponent = Briefcase;
          } else if (route.name === 'Messages') {
            IconComponent = MessageSquare;
          } else if (route.name === 'Profile') {
            IconComponent = User;
          }

          return IconComponent ? <IconComponent size={size} color={color} /> : null;
        },
        tabBarActiveTintColor: 'hsl(140 80% 40%)', // primary color
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // We handle headers inside the stack navigator
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseJobsScreen}
        options={{ title: 'Browse' }}
      />
      <Tab.Screen
        name="MyApplications"
        component={MyApplicationsScreen}
        options={{ title: 'Applications' }}
      />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
