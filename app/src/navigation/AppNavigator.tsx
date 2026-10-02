import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RegisterScreen } from '../screens/RegisterScreen';
import { VerifyOtpScreen } from '../screens/VerifyOtpScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ChooseTasksScreen } from '../screens/ChooseTasksScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoadingView } from '../components/StateViews';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const { user, token, isInitializing, selectedTasks } = useAuth();

  if (isInitializing) {
    return <LoadingView message="Starting PadosiPro..." />;
  }

  // Determine starting screen based on auth state
  const getInitialRouteName = () => {
    if (!token || !user) {
      return 'Register';
    }
    if (!user.isVerified) {
      return 'VerifyOtp';
    }
    if (!user.hasCompletedProfile) {
      return 'Profile';
    }
    if (!selectedTasks || selectedTasks.length === 0) {
      return 'ChooseTasks';
    }
    return 'Home';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ChooseTasks" component={ChooseTasksScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
