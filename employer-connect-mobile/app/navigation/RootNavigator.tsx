import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import AuthService from '../services/authService';
import MainTabNavigator from './MainTabNavigator';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize services
      await AuthService.initialize();
      
      // Check authentication
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      // For development, always set authenticated to true
      // TODO: Remove this in production
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('App initialization error:', error);
      setIsAuthenticated(true); // Allow access for development
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen
        text="Loading HireHub Employer Portal..."
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthPlaceholder} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Placeholder for auth screen (in real app, would redirect to auth hub)
function AuthPlaceholder() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-semibold text-foreground">
        Please log in via Auth Hub
      </Text>
    </View>
  );
}

export default RootNavigator;


