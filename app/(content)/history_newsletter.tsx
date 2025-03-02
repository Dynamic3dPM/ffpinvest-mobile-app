// F:\FFPInvest-User\app\(content)\history_newsletter.tsx

import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock FOREX Newsletter Data with Full Articles and Fake Online Photos
const forexNewsletters = [
    {
        id: '1',
        date: '2025-02-25',
        title: 'USD/JPY Breakout Insights',
        marketUpdate: {
            text: `The USD/JPY pair staged a dramatic breakout this week, surging past the critical resistance at 150.00. This rally was fueled by a robust U.S. jobs report, which added 250,000 jobs, exceeding expectations, and a hawkish tilt from the Federal Reserve. Conversely, the Japanese Yen weakened as the Bank of Japan maintained its ultra-loose monetary policy, with no hints of rate hikes on the horizon. Traders are now watching the 151.50 level closely—if breached, we could see a push towards 153.00. Support at 149.20 remains a key level to monitor for any pullbacks.`,
            image: 'https://picsum.photos/300/200?random=1', // Fake online photo
        },
        tradingTip: {
            text: `For USD/JPY, consider using a 50-period EMA on the daily chart to gauge the trend. Pair this with the MACD indicator to spot momentum shifts. Enter long positions on a confirmed breakout above 151.50 with a tight stop below 150.00 to manage risk in this fast-moving market.`,
            image: 'https://picsum.photos/300/200?random=2', // Fake online photo
        },
        analysis: {
            text: `Pair of the Week: USD/JPY. The breakout above 150.00 marks a significant shift in sentiment. The pair’s next test is at 151.50, where historical resistance lies. A sustained move above this could target 153.00, though overbought RSI readings suggest caution. If yen strength returns due to global risk-off moves, expect a retest of 149.50 as support.`,
            image: 'https://picsum.photos/300/200?random=3', // Fake online photo
        },
    },
    {
        id: '2',
        date: '2025-02-18',
        title: 'EUR/USD Volatility Surge',
        marketUpdate: {
            text: `EUR/USD experienced a rollercoaster week, dropping to 1.0750 after the ECB signaled potential rate cuts if inflation cools, only to rebound to 1.0820 as dollar momentum faded. Eurozone PMI data came in mixed, with manufacturing lagging but services holding steady. The market’s focus now shifts to the upcoming U.S. CPI release, which could dictate the pair’s next move.`,
            image: 'https://picsum.photos/300/200?random=4', // Fake online photo
        },
        tradingTip: {
            text: `Use Bollinger Bands on a 1-hour chart to catch EUR/USD’s volatility. Look for price to touch the lower band with an RSI below 30 as a buy signal, or the upper band with RSI above 70 as a sell signal. Set stops 20 pips beyond the bands to account for whipsaws.`,
            image: 'https://picsum.photos/300/200?random=5', // Fake online photo
        },
        analysis: {
            text: `Pair of the Week: EUR/USD. The pair is testing resistance at 1.0900, a level that’s held firm since late 2024. Support at 1.0700, backed by the 200-day MA, offers a floor. A break above 1.0900 could target 1.1050, while a drop below 1.0700 might see 1.0600 next.`,
            image: 'https://picsum.photos/300/200?random=6', // Fake online photo
        },
    },
    {
        id: '3',
        date: '2025-02-11',
        title: 'GBP/USD Post-Brexit Resilience',
        marketUpdate: {
            text: `GBP/USD climbed to 1.3700 this week, buoyed by strong UK retail sales and hawkish comments from the Bank of England suggesting rate hikes if wage pressures persist. Brexit-related tensions over Northern Ireland protocols linger, but the pound has shrugged off the noise—for now. Key levels to watch include resistance at 1.3750 and support at 1.3550.`,
            image: 'https://picsum.photos/300/200?random=7', // Fake online photo
        },
        tradingTip: {
            text: `On GBP/USD, apply a Fibonacci retracement from the November low to the current high. The 61.8% level at 1.3600 is a prime buy zone on pullbacks. Combine with a stochastic oscillator to time entries when the market is oversold below 20.`,
            image: 'https://picsum.photos/300/200?random=8', // Fake online photo
        },
        analysis: {
            text: `Pair of the Week: GBP/USD. The pair’s push to 1.3700 signals bullish momentum, with 1.3750 as the next hurdle. A break here could eye 1.3900, though political risks might cap gains. Support at 1.3550, reinforced by a rising trendline, offers a safety net.`,
            image: 'https://picsum.photos/300/200?random=9', // Fake online photo
        },
    },
    {
        id: '4',
        date: '2025-02-04',
        title: 'AUD/USD Commodity Boom',
        marketUpdate: {
            text: `AUD/USD surged towards 0.7400 as iron ore and copper prices hit multi-year highs, boosting Australia’s export-driven economy. The RBA faces a balancing act—rising inflation could force its hand, though it signaled no immediate rate changes. Resistance at 0.7450 looms, with support at 0.7280 holding firm.`,
            image: 'https://picsum.photos/300/200?random=10', // Fake online photo
        },
        tradingTip: {
            text: `For AUD/USD, use a 20-period SMA on a daily chart to confirm the uptrend. Enter long on a pullback to the SMA near 0.7320, with a stop below 0.7280. Watch commodity price action—iron ore above $150/ton supports further gains.`,
            image: 'https://picsum.photos/300/200?random=11', // Fake online photo
        },
        analysis: {
            text: `Pair of the Week: AUD/USD. The pair’s climb to 0.7400 reflects commodity strength, with 0.7450 as the next test. A break could target 0.7600, but a dovish RBA might stall the rally. Support at 0.7280, aligned with the 50-day MA, is critical.`,
            image: 'https://picsum.photos/300/200?random=12', // Fake online photo
        },
    },
];

const HistoryNewsletter = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedNewsletter, setSelectedNewsletter] = useState(forexNewsletters[0]);

    const renderDropdownItem = ({ item }: { item: typeof forexNewsletters[0] }) => (
        <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
                setSelectedNewsletter(item);
                setIsDropdownVisible(false);
            }}
        >
            <Text style={styles.dropdownItemText}>{`${item.date} - ${item.title}`}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Navigation Header with Dropdown */}
            <LinearGradient colors={['#FFD700', '#D4AF37']} style={styles.navHeader}>
                <TouchableOpacity
                    style={styles.dropdownToggle}
                    onPress={() => setIsDropdownVisible(!isDropdownVisible)}
                >
                    <Text style={styles.navTitle}>FOREX Newsletter History</Text>
                    <Ionicons
                        name={isDropdownVisible ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="#000000"
                    />
                </TouchableOpacity>
            </LinearGradient>

            {/* Dropdown Menu */}
            {isDropdownVisible && (
                <View style={styles.dropdownContainer}>
                    <FlatList
                        data={forexNewsletters}
                        renderItem={renderDropdownItem}
                        keyExtractor={(item) => item.id}
                        style={styles.dropdownList}
                    />
                </View>
            )}

            {/* Newsletter Content */}
            {selectedNewsletter && (
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.newsletterContainer}>
                        {/* Header */}
                        <Animated.View
                            style={styles.header}
                            entering={FadeInDown.duration(800).springify()}
                        >
                            <Text style={styles.headerTitle}>{selectedNewsletter.title}</Text>
                            <Text style={styles.headerSubtitle}>{selectedNewsletter.date}</Text>
                        </Animated.View>

                        {/* Market Update Section */}
                        <Animated.View
                            style={styles.section}
                            entering={FadeInDown.duration(800).delay(200).springify()}
                        >
                            <Text style={styles.sectionTitle}>Market Update</Text>
                            <Image
                                source={{ uri: selectedNewsletter.marketUpdate.image }}
                                style={styles.sectionImage}
                            />
                            <Text style={styles.sectionText}>{selectedNewsletter.marketUpdate.text}</Text>
                        </Animated.View>

                        {/* Trading Tip Section */}
                        <Animated.View
                            style={styles.section}
                            entering={FadeInDown.duration(800).delay(400).springify()}
                        >
                            <Text style={styles.sectionTitle}>Trading Tip</Text>
                            <Image
                                source={{ uri: selectedNewsletter.tradingTip.image }}
                                style={styles.sectionImage}
                            />
                            <Text style={styles.sectionText}>{selectedNewsletter.tradingTip.text}</Text>
                        </Animated.View>

                        {/* Analysis Section */}
                        <Animated.View
                            style={styles.section}
                            entering={FadeInDown.duration(800).delay(600).springify()}
                        >
                            <Text style={styles.sectionTitle}>Analysis</Text>
                            <Image
                                source={{ uri: selectedNewsletter.analysis.image }}
                                style={styles.sectionImage}
                            />
                            <Text style={styles.sectionText}>{selectedNewsletter.analysis.text}</Text>
                        </Animated.View>

                        {/* Footer */}
                        <Animated.View
                            style={styles.footer}
                            entering={FadeInDown.duration(800).delay(800).springify()}
                        >
                            <Text style={styles.footerText}>
                                Disclaimer: Trading involves risk. Past performance is not indicative of future results.
                            </Text>
                        </Animated.View>
                    </View>
                </ScrollView>
            )}
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
    dropdownToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navTitle: {
        fontSize: 28,
        color: '#000000',
        fontFamily: 'Rawline',
        fontWeight: '700',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    dropdownContainer: {
        position: 'absolute',
        top: 70,
        left: 16,
        right: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#008000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 1000,
    },
    dropdownList: {
        maxHeight: 200,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        backgroundColor: '#222222',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'BodyFont',
        fontWeight: '600',
    },
    contentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    newsletterContainer: {
        borderRadius: 12,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#008000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFD700',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    headerTitle: {
        fontSize: 24,
        color: '#000000',
        fontFamily: 'HeaderFont',
        fontWeight: '700',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'BodyFont',
        opacity: 0.9,
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    sectionTitle: {
        fontSize: 20,
        color: '#FFD700',
        fontFamily: 'HeaderFont',
        fontWeight: '600',
        marginBottom: 12,
    },
    sectionImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    sectionText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'BodyFont',
        lineHeight: 24,
    },
    footer: {
        padding: 16,
        backgroundColor: '#222222',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    footerText: {
        fontSize: 14,
        color: '#FF0000',
        fontFamily: 'BodyFont',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default HistoryNewsletter;