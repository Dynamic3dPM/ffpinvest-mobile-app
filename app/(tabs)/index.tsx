import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);

  const titleScale = useSharedValue(1);
  const dashboardButtonScale = useSharedValue(1);
  const newsletterButtonScale = useSharedValue(1);
  const overlayOpacity = useSharedValue(0.8);

  React.useEffect(() => {
    overlayOpacity.value = withRepeat(
      withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const handlePressIn = (scale: Animated.SharedValue<number>) => {
    scale.value = withSpring(0.95, { stiffness: 200 });
  };

  const handlePressOut = (scale: Animated.SharedValue<number>, route: string) => {
    scale.value = withSpring(1, { stiffness: 200 }, () => {
      runOnJS(router.push)(route as any);
    });
  };

  const handleTitlePressIn = () => {
    titleScale.value = withSpring(1.05, { stiffness: 200 });
  };

  const handleTitlePressOut = () => {
    titleScale.value = withSpring(1, { stiffness: 200 });
  };

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const dashboardButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dashboardButtonScale.value }],
  }));

  const newsletterButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: newsletterButtonScale.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <ImageBackground
      source={require('../../asset/images/bull-bullish-divergence-stock-market-with-green-graph-background-generative-ai.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.8 }}
    >
      {/* Wrapper for layout animations (if any) */}
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(16, 19, 15, 0.9)', 'rgba(16, 19, 15, 0.7)']}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Title with Reanimated animations */}
        <Animated.View entering={FadeInDown.duration(800).springify()}>
          <Animated.View style={titleAnimatedStyle}>
            <TouchableOpacity onPressIn={handleTitlePressIn} onPressOut={handleTitlePressOut} activeOpacity={1}>
              <Text style={styles.title}>Welcome to FFPInvest!</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Subtitle with Reanimated animations */}
        <Animated.Text style={styles.subtitle} entering={FadeInDown.duration(800).delay(200).springify()}>
          Your Gateway to Simpler Trading.
        </Animated.Text>

        {/* Buttons with Reanimated animations */}
        <View style={styles.gridContainer}>
          <Animated.View entering={FadeInDown.duration(800).delay(400).springify()}>
            <TouchableOpacity
              style={styles.button}
              onPressIn={() => handlePressIn(dashboardButtonScale)}
              onPressOut={() => handlePressOut(dashboardButtonScale, '/(tabs)/dashboard')}
              activeOpacity={1}
            >
              <Animated.View style={[styles.buttonContent, dashboardButtonAnimatedStyle]}>
                <MaterialIcons name="dashboard" size={24} color="#FFD700" />
                <Text style={styles.buttonText}>Dashboard</Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(800).delay(600).springify()}>
            <TouchableOpacity
              style={styles.button}
              onPressIn={() => handlePressIn(newsletterButtonScale)}
              onPressOut={() => handlePressOut(newsletterButtonScale, '/(content)/history_newsletter')}
              activeOpacity={1}
            >
              <Animated.View style={[styles.buttonContent, newsletterButtonAnimatedStyle]}>
                <MaterialIcons name="article" size={24} color="#FFD700" />
                <Text style={styles.buttonText}>Newsletter</Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'HeaderFont',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#D3D3D3',
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: 'BodyFont',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gridContainer: {
    width: '90%',
    maxWidth: 400,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 20,
    padding: 10,
  },
  button: {
    width: 150,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008000',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'BodyFont',
    textAlign: 'center',
  },
});