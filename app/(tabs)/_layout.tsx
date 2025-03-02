import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Layout() {
  const router = useRouter();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#808080',
          tabBarStyle: styles.tabBar,
          headerShown: false
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="video"
          options={{
            title: 'Learn',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="book-education-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings" // Fixed from "about"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/dashboard')} // Relative path within (tabs)
      >
        <Ionicons name="speedometer" size={24} color="#FFD700" />
      </TouchableOpacity> */}
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#008000',
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: '#008000',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});