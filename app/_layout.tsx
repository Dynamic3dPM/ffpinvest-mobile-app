import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Set to true by default to skip authentication for testing
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Directly navigate to tabs screen for testing
    if (isAuthenticated !== null) {
      router.replace('/(tabs)');
      SplashScreen.hideAsync();
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/SignUp" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="(content)/view_newsletter"
        options={{
          title: 'Newsletter',
          headerShown: true,
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#FFD700',
          headerTitleStyle: { fontFamily: 'HeaderFont' },
        }}
      />
      <Stack.Screen
        name="(content)/history_newsletter"
        options={{
          title: 'Newsletter History',
          headerShown: true,
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#FFD700',
          headerTitleStyle: { fontFamily: 'HeaderFont' },
        }}
      />
    </Stack>
  );
}