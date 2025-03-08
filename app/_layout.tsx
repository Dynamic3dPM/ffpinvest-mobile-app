import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser } from 'aws-amplify/auth';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_xncm4pzfA',
      userPoolClientId: 'qlqkpo5luj598r2imbsdo2v34',
      loginWith: { },
    },
  },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await getCurrentUser();
        console.log('User is signed in:', user);
        router.replace('/(tabs)');
      } catch (err) {
        console.log('User is not signed in');
        router.replace('/(auth)/login');
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    const hubListener = Hub.listen('auth', ({ payload }) => {
      console.log('Auth event:', payload.event);
      switch (payload.event) {
        case 'signedIn':
          console.log('User signed in');
          router.replace('/(tabs)');
          break;
        case 'signedOut':
          console.log('User signed out');
          router.replace('/(auth)/login');
          break;
        case 'tokenRefresh':
          console.log('Auth tokens refreshed');
          break;
        case 'tokenRefresh_failure':
          console.log('Auth token refresh failed');
          break;
        case 'signInWithRedirect':
          console.log('SignInWithRedirect resolved');
          break;
        case 'signInWithRedirect_failure':
          console.log('SignInWithRedirect failed');
          break;
        case 'customOAuthState':
          console.log('Custom OAuth state:', payload.data);
          break;
        default:
          console.log('Unhandled auth event:', payload);
      }
    });

    checkAuthState();

    return () => {
      hubListener();
    };
  }, []); 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen 
          name="(auth)/login" 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen 
          name="(auth)/SignUp" 
          options={{ title: 'Sign Up' }} 
        />

        {/* Main App Screens */}
        <Stack.Screen name="(tabs)" />

        {/* Content Screens */}
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
    </GestureHandlerRootView>
  );
}