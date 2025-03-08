import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signOut } from 'aws-amplify/auth';

export default function Settings() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleNotifications = async () => {
    try {
      const newValue = !notificationsEnabled;
      setNotificationsEnabled(newValue);
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newValue));
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
    }
  };

  useEffect(() => {
    const updateNotifications = async () => {
      try {
        if (notificationsEnabled) {
          // Code to enable notifications
          console.log('Notifications enabled');
        } else {
          // Code to disable notifications
          console.log('Notifications disabled');
        }
      } catch (error) {
        console.error('Failed to update notifications:', error);
      }
    };

    updateNotifications();
  }, [notificationsEnabled]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.settingItem} onPress={toggleNotifications}>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.settingToggle}>{notificationsEnabled ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#008000',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  settingsList: {
    width: '100%',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingText: {
    color: '#808080',
    fontSize: 16,
  },
  settingToggle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#008000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 2,
    marginTop: 24,
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});