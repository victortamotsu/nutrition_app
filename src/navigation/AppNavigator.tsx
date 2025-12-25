import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import BMIScreen from '../screens/BMIScreen';
import ArmPerimeterScreen from '../screens/ArmPerimeterScreen';
import GymsScreen from '../screens/GymsScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { isDarkMode, colors } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Main" component={HomeScreen} />
          <Stack.Screen name="BMI" component={BMIScreen} />
          <Stack.Screen name="Gyms" component={GymsScreen} />
          <Stack.Screen name="ArmPerimeter" component={ArmPerimeterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}