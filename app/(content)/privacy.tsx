import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

export default function PrivacyPolicy() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.paragraph}>Last Updated: FEB 17 2024</Text>
        <Text style={styles.paragraph}>
          At FFPInvest, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information.
        </Text>
        <Text style={styles.sectionTitle}>1. Information Collection</Text>
        <Text style={styles.paragraph}>
          We collect information you provide during signup, such as your name and email address, to provide our services.
        </Text>
        <Text style={styles.sectionTitle}>2. Data Usage</Text>
        <Text style={styles.paragraph}>
          Your data is used to personalize your experience and communicate updates. We do not sell your information to third parties.
        </Text>
        {/* Add more sections as needed */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D1117',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#006837',
    width: '80%',
    maxHeight: '80%',
  },
  header: {
    color: '#B0D0C1',
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContainer: {
    maxHeight: 400, // Adjust as needed
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    color: '#C9D1D9',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    color: '#C9D1D9',
    fontFamily: 'Poppins',
    fontSize: 14,
    marginBottom: 12,
  },
});