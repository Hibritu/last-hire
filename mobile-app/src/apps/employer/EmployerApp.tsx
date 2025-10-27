import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import EmployerNavigator from './navigation/EmployerNavigator';
import Toast from 'react-native-toast-message';

const EmployerApp: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <EmployerNavigator />
      </NavigationContainer>
      <StatusAndToast />
    </SafeAreaProvider>
  );
};

const StatusAndToast = () => (
  <>
    <Toast />
    {/* StatusBar is provided by expo-status-bar in the native App shell */}
  </>
);

export default EmployerApp;
