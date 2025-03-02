import React from 'react';
import { SafeAreaView, StyleSheet, FlatList, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TradeDashboard from '../(content)/trade_alert';
import Referral from '../(content)/referral';
import ViewNewsletter from '../(content)/view_newsletter';

const Dashboard = () => {
  const sections = [
    {
      id: 'trade',
      title: 'Trade Alerts',
      component: <TradeDashboard />,
    },
    {
      id: 'referral',
      title: 'Referral Stats',
      component: <Referral />,
    },
    {
      id: 'newsletter',
      title: 'Latest Newsletter',
      component: <ViewNewsletter />,
    },
  ];

  const renderSection = ({ item }: { item: { id: string; title: string; component: JSX.Element } }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{item.title}</Text>
      </View>
      <View style={styles.section}>
        {item.component}
      </View>
      <View style={styles.divider} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Header */}
      <LinearGradient colors={['#FFD700', '#D4AF37']} style={styles.navHeader}>
        <Text style={styles.navTitle}>Dashboard</Text>
      </LinearGradient>

      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false} // Optional: hides scrollbar
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  navHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#008000',
  },
  navTitle: {
    fontSize: 28,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Rawline',
    fontWeight: '700',
  },
  listContainer: {
    paddingVertical: 20,
    paddingBottom: 40, // Extra padding at the bottom
  },
  sectionContainer: {
    marginBottom: 24, // Space between sections
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#FFD700',
    fontFamily: 'HeaderFont',
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
  },
  divider: {
    height: 2,
    backgroundColor: '#FFD700',
    marginVertical: 24,
    opacity: 0.3,
    marginHorizontal: 16,
  },
});

export default Dashboard;