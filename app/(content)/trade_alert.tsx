import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Vibration, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface OpenTradeAlert {
    pair: string;
    direction: string;
    entry: string;
    stopLoss: string;
    stopLossPercent: number;
    takeProfit: string;
    takeProfitPercent: number;
    takeProfitGoal: string;
    disclaimer: string;
    timestamp: string;
    type: 'open';
}

interface CloseTradeAlert {
    pair: string;
    closingPrice: string;
    date: string;
    disclaimer: string;
    timestamp: string;
    type: 'close';
}

const currencyFlags: { [key: string]: string } = {
    USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', AUD: '🇦🇺', CAD: '🇨🇦',
    CHF: '🇨🇭', CNY: '🇨🇳', NZD: '🇳🇿', SEK: '🇸🇪', NOK: '🇳🇴', DKK: '🇩🇰',
    ZAR: '🇿🇦', INR: '🇮🇳', BRL: '🇧🇷', RUB: '🇷🇺',
};

const getPairFlags = (pair: string): string => {
    if (!pair || !pair.includes('/')) return pair;
    const [base, quote] = pair.split('/');
    const baseFlag = currencyFlags[base] || '';
    const quoteFlag = currencyFlags[quote] || '';
    return `${baseFlag}${quoteFlag} ${pair}`;
};

const toLocalTime = (utcTimeString: string | undefined): string => {
    if (!utcTimeString) return 'N/A';
    const normalizedUtcTime = utcTimeString.endsWith('Z') ? utcTimeString : `${utcTimeString}Z`;
    const utcDate = new Date(normalizedUtcTime);
    return isNaN(utcDate.getTime()) ? 'Invalid Time' : utcDate.toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });
};

const { width } = Dimensions.get('window');

const TradeDashboard = () => {
    const [openAlert, setOpenAlert] = useState<OpenTradeAlert | null>(null);
    const [closeAlert, setCloseAlert] = useState<CloseTradeAlert | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpenAlertVisible, setIsOpenAlertVisible] = useState<boolean>(true);
    const [showOpenPopup, setShowOpenPopup] = useState<boolean>(false);
    const [showClosePopup, setShowClosePopup] = useState<boolean>(false);
    const prevOpenAlertRef = useRef<OpenTradeAlert | null>(null);
    const prevCloseAlertRef = useRef<CloseTradeAlert | null>(null);
    const [soundLoaded, setSoundLoaded] = useState(false);
    const soundRef = useRef<Audio.Sound | null>(null);
    const soundLoadingAttempts = useRef(0);

    useEffect(() => {
        // Set up audio
        const loadSound = async () => {
            try {
                console.log('Loading sound...');
                soundLoadingAttempts.current += 1;

                // Make sure any previous sound instance is unloaded
                if (soundRef.current) {
                    try {
                        await soundRef.current.unloadAsync();
                    } catch (e) {
                        console.warn('Error unloading previous sound:', e);
                    }
                    soundRef.current = null;
                }

                // Make sure the audio module is properly set up
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });

                // Create and load the sound
                const { sound } = await Audio.Sound.createAsync(
                    require('../../asset/sounds/cash.mp3'),
                    { shouldPlay: false },
                    (status) => {
                        if (status.isLoaded) {
                            console.log('Sound loaded callback success');
                            setSoundLoaded(true);
                        } else if (status.error) {
                            console.error('Sound loaded callback error:', status.error);
                            setSoundLoaded(false);
                        }
                    }
                );

                soundRef.current = sound;
                setSoundLoaded(true);
                console.log('Sound loaded successfully');

                // Verify the sound is loaded
                const loadedStatus = await sound.getStatusAsync();
                console.log('Sound status after loading:', loadedStatus);

            } catch (error) {
                console.error('Error loading sound:', error);
                setSoundLoaded(false);

                // Retry loading if failed (up to 3 attempts)
                if (soundLoadingAttempts.current < 3) {
                    console.log(`Retrying sound loading (attempt ${soundLoadingAttempts.current + 1}/3)...`);
                    setTimeout(loadSound, 1000); // Wait 1 second before retry
                }
            }
        };

        loadSound();

        // Clean up
        return () => {
            const unloadSound = async () => {
                if (soundRef.current) {
                    console.log('Unloading sound...');
                    try {
                        await soundRef.current.unloadAsync();
                    } catch (e) {
                        console.warn('Error unloading sound:', e);
                    }
                    soundRef.current = null;
                    setSoundLoaded(false);
                }
            };
            unloadSound();
        };
    }, []);

    const playAlertSound = async () => {
        // Check if sound is loaded and valid
        if (!soundRef.current) {
            console.warn('Sound reference not available');
            // Try to initialize sound on demand
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../asset/sounds/cash.mp3'),
                    { shouldPlay: true }
                );
                soundRef.current = sound;
                return; // Sound is now playing via shouldPlay: true
            } catch (error) {
                console.error('Failed to initialize sound on demand:', error);
                return;
            }
        }

        try {
            console.log('Playing sound...');
            // Get sound status first to check if it's loaded
            const status = await soundRef.current.getStatusAsync();
            console.log('Sound status before playing:', status);

            if (status.isLoaded) {
                // Reset position if it was played before
                if (status.positionMillis > 0) {
                    await soundRef.current.setPositionAsync(0);
                }

                // If it's already playing, stop it first
                if (status.isPlaying) {
                    await soundRef.current.stopAsync();
                }

                // Play the sound
                await soundRef.current.playAsync();
                console.log('Sound played successfully');
            } else {
                console.warn('Sound was not loaded properly, attempting to reload');
                // Try to reload the sound
                try {
                    await soundRef.current.unloadAsync();
                    const { sound } = await Audio.Sound.createAsync(
                        require('../../asset/sounds/cash.mp3'),
                        { shouldPlay: true }
                    );
                    soundRef.current = sound;
                    setSoundLoaded(true);
                } catch (reloadError) {
                    console.error('Failed to reload sound:', reloadError);
                }
            }
        } catch (e) {
            console.warn('Failed to play sound:', e);

            // Try alternative approach if there was an error
            try {
                // Completely recreate the sound object
                if (soundRef.current) {
                    try {
                        await soundRef.current.unloadAsync();
                    } catch (unloadError) {
                        console.warn('Error unloading sound during fallback:', unloadError);
                    }
                }

                // Create a new sound with immediate playback
                const { sound } = await Audio.Sound.createAsync(
                    require('../../asset/sounds/cash.mp3'),
                    { shouldPlay: true }
                );
                soundRef.current = sound;
                setSoundLoaded(true);
            } catch (fallbackError) {
                console.error('All sound playback attempts failed:', fallbackError);
            }
        }
    };

    const openPopupScale = useSharedValue(0);
    const closePopupScale = useSharedValue(0);
    const titleTranslateY = useSharedValue(-50);

    const fetchAlerts = async () => {
        try {
            setError(null);
            const [openResponse, closeResponse] = await Promise.all([
                fetch('https://ffpinvest.ertaccess.cc/get_open_alert', { headers: { 'Content-Type': 'application/json' } }),
                fetch('https://ffpinvest.ertaccess.cc/get_close_alert', { headers: { 'Content-Type': 'application/json' } }),
            ]);

            if (!openResponse.ok || !closeResponse.ok) throw new Error('Network response was not ok');

            const [openData, closeData] = await Promise.all([openResponse.json(), closeResponse.json()]);
            const newOpenAlert = openData?.data || null;
            const newCloseAlert = closeData?.data || null;

            if (prevOpenAlertRef.current && newOpenAlert && JSON.stringify(prevOpenAlertRef.current) !== JSON.stringify(newOpenAlert)) {
                const notificationsEnabled = JSON.parse(await AsyncStorage.getItem('notificationsEnabled') || 'true');
                if (notificationsEnabled) {
                    // Try to play sound without awaiting to prevent blocking the UI
                    playAlertSound().catch(err => console.warn('Sound playback error:', err));
                    Vibration.vibrate([0, 500, 200, 500]);
                }
                setShowOpenPopup(true);
                openPopupScale.value = withSpring(1, { stiffness: 100 });
                setTimeout(() => {
                    openPopupScale.value = withSpring(0, { stiffness: 100 }, () => {
                        runOnJS(setShowOpenPopup)(false);
                    });
                }, 10000);
                setIsOpenAlertVisible(true);
            }
            setOpenAlert(newOpenAlert);
            prevOpenAlertRef.current = newOpenAlert;

            if (prevCloseAlertRef.current && newCloseAlert && JSON.stringify(prevCloseAlertRef.current) !== JSON.stringify(newCloseAlert)) {
                const notificationsEnabled = JSON.parse(await AsyncStorage.getItem('notificationsEnabled') || 'true');
                if (notificationsEnabled) {
                    // Try to play sound without awaiting to prevent blocking the UI
                    playAlertSound().catch(err => console.warn('Sound playback error:', err));
                    Vibration.vibrate([0, 500, 200, 500]);
                }
                setShowClosePopup(true);
                closePopupScale.value = withSpring(1, { stiffness: 100 });
                setTimeout(() => {
                    closePopupScale.value = withSpring(0, { stiffness: 100 }, () => {
                        runOnJS(setShowClosePopup)(false);
                    });
                }, 10000);
            }
            setCloseAlert(newCloseAlert);
            prevCloseAlertRef.current = newCloseAlert;

            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 10000);
        titleTranslateY.value = withSpring(0, { damping: 15 });
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (openAlert?.timestamp) {
            const checkExpiration = () => {
                const alertTime = new Date(openAlert.timestamp + 'Z').getTime();
                const now = Date.now();
                const fiveMinutes = 5 * 60 * 1000;
                setIsOpenAlertVisible(now - alertTime <= fiveMinutes);
            };
            checkExpiration();
            const interval = setInterval(checkExpiration, 1000);
            return () => clearInterval(interval);
        } else {
            setIsOpenAlertVisible(true);
        }
    }, [openAlert]);

    const openPopupAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: openPopupScale.value }],
        opacity: openPopupScale.value,
    }));

    const closePopupAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: closePopupScale.value }],
        opacity: closePopupScale.value,
    }));

    const titleAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: titleTranslateY.value }],
    }));

    if (loading) {
        return (
            <LinearGradient colors={['#000000', '#1A1A1A']} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>Loading Alerts...</Text>
            </LinearGradient>
        );
    }

    if (error) {
        return (
            <LinearGradient colors={['#000000', '#1A1A1A']} style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={40} color="#FF0000" />
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchAlerts}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#000000', '#1A1A1A']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>


                <View style={styles.alertContainer}>
                    <LinearGradient colors={['#FFD700', '#D4AF37']} style={styles.alertHeader}>
                        <Text style={styles.alertTitle}>Open Trade Alert</Text>
                    </LinearGradient>
                    <View style={styles.fullContainer}>
                        {openAlert && Object.keys(openAlert).length > 0 && isOpenAlertVisible ? (
                            <View style={styles.table}>
                                {[
                                    { label: 'Timestamp', value: `⏰ ${toLocalTime(openAlert.timestamp)}`, key: 'timestamp' },
                                    { label: 'Pair', value: getPairFlags(openAlert.pair), key: 'pair' },
                                    { label: 'Direction', value: openAlert.direction === 'buy' || openAlert.direction === 'long' ? '🐂 Long' : '🐻 Short', key: 'direction' },
                                    { label: 'Entry', value: `🔑 ${openAlert.entry}`, key: 'entry' },
                                    { label: 'Stop Loss', value: `🛑 ${openAlert.stopLoss} (${openAlert.stopLossPercent}%)`, key: 'stopLoss' },
                                    { label: 'Take Profit', value: `🤑 ${openAlert.takeProfit} (${openAlert.takeProfitPercent}%)`, key: 'takeProfit' },
                                    { label: 'Take Profit Goal', value: openAlert.takeProfitGoal, key: 'takeProfitGoal' },
                                    { label: 'Disclaimer', value: `🚨 ${openAlert.disclaimer}`, key: 'disclaimer', isDisclaimer: true },
                                ].map((item, index) => (
                                    <View key={item.key} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt, item.isDisclaimer && styles.disclaimerRow]}>
                                        <Text style={[styles.tableLabel, item.isDisclaimer && styles.disclaimerLabel]}>{item.label}</Text>
                                        <Text style={[styles.tableValue, item.isDisclaimer && styles.disclaimerValue]}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.noAlertContainer}>
                                <Image source={require('../../asset/images/noTrade.png')} style={styles.noAlertImage} resizeMode="contain" />
                                <Text style={styles.noAlertText}>No active open trade alerts.</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.alertContainer}>
                    <LinearGradient colors={['#FFD700', '#D4AF37']} style={styles.alertHeader}>
                        <Text style={styles.alertTitle}>Close Trade Alert</Text>
                    </LinearGradient>
                    <View style={styles.fullContainer}>
                        {closeAlert && Object.keys(closeAlert).length > 0 ? (
                            <View style={styles.table}>
                                {[
                                    { label: 'Timestamp', value: `⏰ ${toLocalTime(closeAlert.timestamp)}`, key: 'timestamp' },
                                    { label: 'Pair', value: getPairFlags(closeAlert.pair), key: 'pair' },
                                    { label: 'Closing Price', value: `💵 ${closeAlert.closingPrice}`, key: 'closingPrice' },
                                    { label: 'Date', value: `📅 ${toLocalTime(closeAlert.date)}`, key: 'date' },
                                    { label: 'Disclaimer', value: `🚨 ${closeAlert.disclaimer}`, key: 'disclaimer', isDisclaimer: true },
                                ].map((item, index) => (
                                    <View key={item.key} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt, item.isDisclaimer && styles.disclaimerRow]}>
                                        <Text style={[styles.tableLabel, item.isDisclaimer && styles.disclaimerLabel]}>{item.label}</Text>
                                        <Text style={[styles.tableValue, item.isDisclaimer && styles.disclaimerValue]}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.noAlertContainer}>
                                <Text style={styles.noAlertText}>No close trade alert available.</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {showOpenPopup && openAlert && (
                <BlurView intensity={80} style={styles.blurContainer}>
                    <Animated.View style={[styles.popupContainer, openPopupAnimatedStyle]}>
                        <LinearGradient colors={['#FFD700', '#D4AF37']} style={styles.popupHeader}>
                            <Text style={styles.alertTitle}>New Open Trade Alert</Text>
                        </LinearGradient>
                        <View style={styles.popupFullContainer}>
                            <View style={styles.table}>
                                {[
                                    { label: 'Timestamp', value: `⏰ ${toLocalTime(openAlert.timestamp)}`, key: 'timestamp' },
                                    { label: 'Pair', value: getPairFlags(openAlert.pair), key: 'pair' },
                                    { label: 'Direction', value: openAlert.direction === 'buy' || openAlert.direction === 'long' ? '🐂 Long' : '🐻 Short', key: 'direction' },
                                    { label: 'Entry', value: `🔑 ${openAlert.entry}`, key: 'entry' },
                                    { label: 'Stop Loss', value: `🛑 ${openAlert.stopLoss} (${openAlert.stopLossPercent}%)`, key: 'stopLoss' },
                                    { label: 'Take Profit', value: `🤑 ${openAlert.takeProfit} (${openAlert.takeProfitPercent}%)`, key: 'takeProfit' },
                                    { label: 'Take Profit Goal', value: openAlert.takeProfitGoal, key: 'takeProfitGoal' },
                                    { label: 'Disclaimer', value: `🚨 ${openAlert.disclaimer}`, key: 'disclaimer', isDisclaimer: true },
                                ].map((item, index) => (
                                    <View key={item.key} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt, item.isDisclaimer && styles.disclaimerRow]}>
                                        <Text style={[styles.tableLabel, item.isDisclaimer && styles.disclaimerLabel]}>{item.label}</Text>
                                        <Text style={[styles.tableValue, item.isDisclaimer && styles.disclaimerValue]}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </Animated.View>
                </BlurView>
            )}

            {showClosePopup && closeAlert && (
                <BlurView intensity={80} style={styles.blurContainer}>
                    <Animated.View style={[styles.popupContainer, closePopupAnimatedStyle]}>
                        <LinearGradient colors={['#FFD700', '#D4AF37']} style={styles.popupHeader}>
                            <Text style={styles.alertTitle}>New Close Trade Alert</Text>
                        </LinearGradient>
                        <View style={styles.popupFullContainer}>
                            <View style={styles.table}>
                                {[
                                    { label: 'Timestamp', value: `⏰ ${toLocalTime(closeAlert.timestamp)}`, key: 'timestamp' },
                                    { label: 'Pair', value: getPairFlags(closeAlert.pair), key: 'pair' },
                                    { label: 'Closing Price', value: `💵 ${closeAlert.closingPrice}`, key: 'closingPrice' },
                                    { label: 'Date', value: `📅 ${toLocalTime(closeAlert.date)}`, key: 'date' },
                                    { label: 'Disclaimer', value: `🚨 ${closeAlert.disclaimer}`, key: 'disclaimer', isDisclaimer: true },
                                ].map((item, index) => (
                                    <View key={item.key} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt, item.isDisclaimer && styles.disclaimerRow]}>
                                        <Text style={[styles.tableLabel, item.isDisclaimer && styles.disclaimerLabel]}>{item.label}</Text>
                                        <Text style={[styles.tableValue, item.isDisclaimer && styles.disclaimerValue]}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </Animated.View>
                </BlurView>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    contentContainer: {
        paddingVertical: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFD700',
        fontSize: 20,
        marginTop: 12,
        fontFamily: 'HeaderFont',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#FFD700',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'BodyFont',
    },
    retryButton: {
        backgroundColor: '#008000',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        elevation: 3,
    },
    retryButtonText: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'BodyFont',
    },
    title: {
        fontSize: 32,
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'Rawline',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    alertContainer: {
        marginBottom: 24,
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
    alertHeader: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    alertTitle: {
        fontSize: 22,
        color: '#000000',
        textAlign: 'center',
        fontFamily: 'HeaderFont',
        fontWeight: '700',
    },
    fullContainer: {
        padding: 16,
    },
    table: {
        width: '100%',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    tableRowAlt: {
        backgroundColor: '#222222',
    },
    tableLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        paddingRight: 10,
        fontFamily: 'BodyFont',
    },
    tableValue: {
        color: '#FFFFFF',
        fontSize: 16,
        flex: 2,
        fontFamily: 'BodyFont',
    },
    disclaimerRow: {
        borderWidth: 1,
        borderColor: '#FF0000',
        paddingVertical: 12,
        marginTop: 12,
        borderRadius: 8,
    },
    disclaimerLabel: {
        color: '#FF0000',
        fontWeight: '700',
        fontSize: 16,
        fontFamily: 'BodyFont',
    },
    disclaimerValue: {
        color: '#FF0000',
        fontWeight: '600',
        fontSize: 16,
        fontFamily: 'BodyFont',
    },
    noAlertContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    noAlertImage: {
        width: '100%',
        height: 200,
        marginBottom: 12,
    },
    noAlertText: {
        color: '#FFD700',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'BodyFont',
    },
    blurContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        width: width * 0.9,
        borderRadius: 12,
        backgroundColor: '#1A1A1A',
        borderWidth: 2,
        borderColor: '#008000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        overflow: 'hidden',
    },
    popupHeader: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    popupFullContainer: {
        padding: 16,
    },
});

export default TradeDashboard;