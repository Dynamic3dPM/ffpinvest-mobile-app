import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Share,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Mock API to generate referral code (replace with real API in production)
const generateReferralCode = async (): Promise<string> => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const code = `FFP${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            resolve(code);
        }, 500);
    });
};

// Mock data for referrals and stats
const mockReferralData = [
    { id: '1', name: 'John Doe', date: '2025-02-20', amountEarned: 25.00 },
    { id: '2', name: 'Jane Smith', date: '2025-02-19', amountEarned: 25.00 },
    { id: '3', name: 'Mike Johnson', date: '2025-02-18', amountEarned: 25.00 },
];
const mockStats = {
    totalEarned: 125.75,
    currentReferrals: 5,
    promoMessage: 'Invite friends to FFPInvest and earn $25 per signup! - FFPInvest Team',
};

const ReferralScreen = () => {
    const [referralCode, setReferralCode] = useState<string>('Loading...');
    const [referrals, setReferrals] = useState(mockReferralData);
    const [stats, setStats] = useState(mockStats);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching referral code and data
        const fetchReferralData = async () => {
            try {
                const code = await generateReferralCode();
                setReferralCode(code);
            } catch (error) {
                console.error('Error fetching referral data:', error);
                setReferralCode('ERROR-CODE');
            } finally {
                setLoading(false);
            }
        };
        fetchReferralData();
    }, []);

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Join FFPInvest with my referral code ${referralCode} and start trading! Download here: [Your App Link]`,
            });
            if (result.action === Share.sharedAction) {
                console.log('Shared successfully');
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const renderReferralItem = ({ item }: { item: typeof mockReferralData[0] }) => (
        <View style={styles.referralItem}>
            <Text style={styles.referralName}>{item.name}</Text>
            <Text style={styles.referralDate}>{item.date}</Text>
            <Text style={styles.referralAmount}>${item.amountEarned.toFixed(2)}</Text>
        </View>
    );

    const renderHeader = () => (
        <>


            {/* Referral Code Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Referral Code</Text>
                <Text style={styles.referralCode}>{referralCode}</Text>
                <TouchableOpacity style={styles.shareButton} onPress={onShare}>
                    <Ionicons name="share-social" size={24} color="#FFFFFF" />
                    <Text style={styles.shareButtonText}>Share Code</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Tiles */}
            <View style={styles.statsContainer}>
                <View style={styles.tile}>
                    <LinearGradient colors={['#FFD700', '#D4AF37']} style={styles.tileGradient}>
                        <Ionicons name="cash-outline" size={28} color="#000000" />
                        <Text style={styles.tileValue}>${stats.totalEarned.toFixed(2)}</Text>
                        <Text style={styles.tileLabel}>Earned</Text>
                    </LinearGradient>
                </View>
                <View style={styles.tile}>
                    <LinearGradient colors={['#FFD700', '#D4AF37']} style={styles.tileGradient}>
                        <Ionicons name="people-outline" size={28} color="#000000" />
                        <Text style={styles.tileValue}>{stats.currentReferrals}</Text>
                        <Text style={styles.tileLabel}>Referrals</Text>
                    </LinearGradient>
                </View>
            </View>

            {/* Promo Message */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>FFPInvest Promo</Text>
                <Text style={styles.promoText}>{stats.promoMessage}</Text>
            </View>

            {/* Referral List Title */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Referrals</Text>
            </View>
        </>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#FFD700" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={referrals}
                renderItem={renderReferralItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={<Text style={styles.noReferralsText}>No referrals yet.</Text>}
                contentContainerStyle={styles.scrollContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContainer: {
        paddingVertical: 20,
    },
    header: {
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#008000',
    },
    headerTitle: {
        fontSize: 28,
        color: '#000000',
        fontFamily: 'Rawline',
        fontWeight: '700',
    },
    section: {
        padding: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#008000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#FFD700',
        fontFamily: 'HeaderFont',
        fontWeight: '600',
        marginBottom: 12,
    },
    referralCode: {
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'BodyFont',
        textAlign: 'center',
        marginBottom: 16,
    },
    shareButton: {
        flexDirection: 'row',
        backgroundColor: '#008000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'BodyFont',
        marginLeft: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    tile: {
        flex: 1,
        marginHorizontal: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    tileGradient: {
        padding: 16,
        alignItems: 'center',
    },
    tileValue: {
        fontSize: 24,
        color: '#000000',
        fontFamily: 'BodyFont',
        fontWeight: '700',
        marginTop: 8,
    },
    tileLabel: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'BodyFont',
        marginTop: 4,
    },
    promoText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'BodyFont',
        lineHeight: 24,
    },
    referralList: {
        maxHeight: 200,
    },
    referralItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    referralName: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'BodyFont',
        flex: 1,
    },
    referralDate: {
        fontSize: 14,
        color: '#FFD700',
        fontFamily: 'BodyFont',
        flex: 1,
        textAlign: 'center',
    },
    referralAmount: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'BodyFont',
        flex: 1,
        textAlign: 'right',
    },
    noReferralsText: {
        fontSize: 16,
        color: '#FFD700',
        fontFamily: 'BodyFont',
        textAlign: 'center',
    },
});

export default ReferralScreen;