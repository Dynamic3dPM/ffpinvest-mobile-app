import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function ViewNewsletter() {
  // Animation values for overlay pulse (if desired)
  const overlayOpacity = useSharedValue(0.9);

  // Pulse animation for subtle background effect
  React.useEffect(() => {
    overlayOpacity.value = withRepeat(
      withTiming(0.7, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite loop
      true // Reverse
    );
  }, [overlayOpacity]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.7)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View style={styles.header} entering={FadeInDown.duration(800).springify()}>
          <Text style={styles.headerTitle}>FOREX Trading Newsletter</Text>
          <Text style={styles.headerSubtitle}>February 27, 2025</Text>
        </Animated.View>

        {/* Market Update Section */}
        <Animated.View style={styles.section} entering={FadeInDown.duration(800).delay(200).springify()}>
          <Text style={styles.sectionTitle}>Market Update</Text>
          <Image
            source={{ uri: 'https://picsum.photos/300/200?random=1' }}
            style={styles.sectionImage}
          />
          <Text style={styles.sectionText}>
            The EUR/USD pair saw a 0.8% increase this week, driven by strong Eurozone PMI data. Key resistance at 1.0950 remains in focus, with traders eyeing the upcoming U.S. Non-Farm Payrolls report for further direction.
          </Text>
        </Animated.View>

        {/* Trading Tip Section */}
        <Animated.View style={styles.section} entering={FadeInDown.duration(800).delay(400).springify()}>
          <Text style={styles.sectionTitle}>Trading Tip</Text>
          <Image
            source={{ uri: 'https://picsum.photos/300/200?random=2' }}
            style={styles.sectionImage}
          />
          <Text style={styles.sectionText}>
            Use a 20-period SMA on a 4-hour chart to identify trend direction. Combine with RSI to confirm overbought/oversold conditions before entering trades. Patience is key in volatile markets!
          </Text>
        </Animated.View>

        {/* Analysis Section */}
        <Animated.View style={styles.section} entering={FadeInDown.duration(800).delay(600).springify()}>
          <Text style={styles.sectionTitle}>Pair of the Week: GBP/JPY</Text>
          <Image
            source={{ uri: 'https://picsum.photos/300/200?random=3' }}
            style={styles.sectionImage}
          />
          <Text style={styles.sectionText}>
            GBP/JPY has broken above 188.50, signaling potential bullish momentum. Watch for a retest of support at 187.00. Risk-off sentiment could push it back if yen strength returns.
          </Text>
        </Animated.View>

        {/* Footer */}
        <Animated.View style={styles.footer} entering={FadeInDown.duration(800).delay(800).springify()}>
          <Text style={styles.footerText}>
            Disclaimer: Trading involves risk. Past performance is not indicative of future results.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#008000',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFD700',
    textAlign: 'center',
    fontFamily: 'HeaderFont',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#D3D3D3',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'BodyFont',
  },
  section: {
    padding: 20,
    marginHorizontal: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#008000',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 16,
    fontFamily: 'HeaderFont',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  sectionText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    fontFamily: 'BodyFont',
  },
  footer: {
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: '#008000',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  footerText: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'BodyFont',
  },
});