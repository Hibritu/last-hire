import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ApplyWithCoverLetterScreen from '../screens/ApplyWithCoverLetterScreen';
import ViewJobScreen from '../screens/ViewJobScreen';

export type RootStackParamList = {
  Home: undefined;
  ApplyWithCoverLetter: { jobId: string; jobTitle: string };
  ViewJob: { jobId: string; jobTitle: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Browse Jobs' }}
      />
      <Stack.Screen
        name="ApplyWithCoverLetter"
        component={ApplyWithCoverLetterScreen}
        options={{ title: 'Apply with Cover Letter' }}
      />
      <Stack.Screen
        name="ViewJob"
        component={ViewJobScreen}
        options={({ route }) => ({ title: route.params.jobTitle })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
