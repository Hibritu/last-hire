import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <NavigationContainer>
      <MainTabNavigator />
      <Toast />
    </NavigationContainer>
  );
}