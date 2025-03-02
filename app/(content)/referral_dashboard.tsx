import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import BankModalPopup from '../(components)/bank_modal_popup';

interface ReferralData {
  id: string;
  name: string;
  signupDate: string;
  daysActive: number;
  amountEarned: number;
}

export default function ReferralDashboard() {
  const [isModalVisible, setModalVisible] = useState(false);

  // Mock data
  const mockReferrals: ReferralData[] = [
    { id: '1', name: 'John Doe', signupDate: '2025-01-15', daysActive: 44, amountEarned: 50 },
    { id: '2', name: 'Jane Smith', signupDate: '2025-01-20', daysActive: 39, amountEarned: 50 },
    { id: '3', name: 'Bob Johnson', signupDate: '2025-02-01', daysActive: 27, amountEarned: 0 },
    { id: '4', name: 'Alice Brown', signupDate: '2025-01-10', daysActive: 49, amountEarned: 50 },
  ];

  // Calculate stats
  const totalEarnings = mockReferrals.reduce((sum, referral) => 
    sum + (referral.daysActive >= 30 ? referral.amountEarned : 0), 0);
  const totalSubscribers = mockReferrals.length;
  const qualifiedSubscribers = mockReferrals.filter(r => r.daysActive >= 30).length;
  const rewardTier = Math.floor(totalSubscribers / 10);
  const nextTierThreshold = (rewardTier + 1) * 10;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Referral Dashboard</Text>

      {/* Stats Tiles */}
      <View style={styles.tilesContainer}>
        <View style={styles.tile}>
          <Text style={styles.tileValue}>${totalEarnings}</Text>
          <Text style={styles.tileLabel}>Total Earnings</Text>
        </View>
        <View style={styles.tile}>
          <Text style={styles.tileValue}>{totalSubscribers}</Text>
          <Text style={styles.tileLabel}>Total Subscribers</Text>
        </View>
        <View style={styles.tile}>
          <Text style={styles.tileValue}>{qualifiedSubscribers}</Text>
          <Text style={styles.tileLabel}>Qualified (30+ days)</Text>
        </View>
      </View>

      {/* Reward Progress */}
      <View style={styles.rewardContainer}>
        <Text style={styles.sectionTitle}>Reward Tier: {rewardTier}</Text>
        <Text style={styles.rewardText}>
          {totalSubscribers} / {nextTierThreshold} subscribers to next tier
        </Text>
        <View style={styles.progressBar}>
          <View style={{
            ...styles.progressFill,
            width: `${(totalSubscribers % 10) * 10}%`,
          }} />
        </View>
        <Text style={styles.rewardInfo}>
          Every 10 subscribers increases your reward tier!
        </Text>
      </View>

      {/* Bank Update Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Update Bank Information</Text>
      </TouchableOpacity>

      {/* Referrals Table */}
      <View style={styles.tableContainer}>
        <Text style={styles.sectionTitle}>Your Referrals</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Signup Date</Text>
          <Text style={styles.headerCell}>Days Active</Text>
          <Text style={styles.headerCell}>Earnings</Text>
        </View>
        
        {mockReferrals.map((referral) => (
          <View key={referral.id} style={styles.tableRow}>
            <Text style={styles.cell}>{referral.name}</Text>
            <Text style={styles.cell}>{referral.signupDate}</Text>
            <Text style={styles.cell}>{referral.daysActive}</Text>
            <Text style={styles.cell}>
              ${referral.daysActive >= 30 ? referral.amountEarned : 0}
            </Text>
          </View>
        ))}
      </View>

      {/* Bank Modal Popup */}
      <BankModalPopup 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </ScrollView>
  );
}

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
    color: '#FFD700',
    textAlign: 'center',
    fontFamily: 'HeaderFont',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#FFD700',
  },
  tilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  tile: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
  },
  tileValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008000',
  },
  tileLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#FFD700',
  },
  rewardContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#FFD700',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#008000',
  },
  rewardInfo: {
    fontSize: 12,
    color: '#FFD700',
  },
  button: {
    backgroundColor: '#008000',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    margin: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFD700',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#FFD700',
  },
});