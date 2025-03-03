import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from 'expo-router';

const { width, height } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 16 / 9; // 9:16 aspect ratio flipped for calculation

// Sample financial videos (YouTube URLs)
const videoSamples = [
    {
        id: '1',
        title: 'Stock Market vs FOREX Trading',
        source: 'https://www.youtube.com/embed/pCg72sZKOpg?autoplay=1&mute=0&controls=0&rel=0&showinfo=0',
        duration: '00:57',
        thumbnail: 'https://img.youtube.com/vi/pCg72sZKOpg/mqdefault.jpg',
    },
    {
        id: '2',
        title: 'Placing Your First Order',
        source: 'https://www.youtube.com/embed/JQ6yh4JZc_0?autoplay=1&mute=0&controls=0&rel=0&showinfo=0',
        duration: '2:01',
        thumbnail: 'https://img.youtube.com/vi/JQ6yh4JZc_0?/mqdefault.jpg',
    },
];

export default function VideoScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [isFocused, setIsFocused] = useState(true);
    const flatListRef = useRef(null);
    const webViewRef = useRef(null);

    const togglePlayPause = () => {
        setPlaying(!playing);
    };

    // Handle screen focus/blur
    useFocusEffect(
        useCallback(() => {
            // When screen comes into focus
            setIsFocused(true);

            // When screen loses focus
            return () => {
                setIsFocused(false);
                setPlaying(false);
                // Try to pause the video by injecting JavaScript if webViewRef is available
                if (webViewRef.current) {
                    webViewRef.current.injectJavaScript(`
                        var videoElements = document.getElementsByTagName('video');
                        for(var i = 0; i < videoElements.length; i++) {
                            videoElements[i].pause();
                        }
                        true;
                    `);
                }
            };
        }, [])
    );

    const renderVideoPlayer = () => {
        // Don't render the WebView at all if not focused
        if (!isFocused) {
            return (
                <View style={styles.videoPlayerContainer}>
                    <Image
                        source={{ uri: videoSamples[currentIndex].thumbnail }}
                        style={styles.video}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.7)', 'transparent']}
                        style={styles.gradientOverlay}
                    >
                        <View style={styles.videoDetails}>
                            <Text style={styles.videoTitle}>{videoSamples[currentIndex].title}</Text>
                            <Text style={styles.videoDuration}>{videoSamples[currentIndex].duration}</Text>
                        </View>
                    </LinearGradient>
                </View>
            );
        }

        const videoUrl = playing && isFocused
            ? videoSamples[currentIndex].source
            : `${videoSamples[currentIndex].source.split('?')[0]}?autoplay=0&mute=1&controls=0&rel=0&showinfo=0`;

        return (
            <View style={styles.videoPlayerContainer}>
                <WebView
                    ref={webViewRef}
                    source={{ uri: videoUrl }}
                    style={styles.video}
                    allowsFullscreenVideo
                    javaScriptEnabled
                    mediaPlaybackRequiresUserAction={false}
                    key={`video-${currentIndex}-${playing}-${isFocused}`} // Force remount when state changes
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'transparent']}
                    style={styles.gradientOverlay}
                >
                    <View style={styles.videoDetails}>
                        <Text style={styles.videoTitle}>{videoSamples[currentIndex].title}</Text>
                        <Text style={styles.videoDuration}>{videoSamples[currentIndex].duration}</Text>
                    </View>
                </LinearGradient>
                <View style={styles.controlsContainer}>
                    <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
                        <Ionicons
                            name={playing ? 'pause' : 'play'}
                            size={30}
                            color="#FFD700"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderThumbnailItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.thumbnailItem}
            onPress={() => {
                setCurrentIndex(index);
                setPlaying(true);
                flatListRef.current?.scrollToIndex({ index: 0, animated: true }); // Scroll back to top
            }}
        >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.thumbnailInfo}>
                <Text style={styles.thumbnailTitle}>{item.title}</Text>
                <Text style={styles.thumbnailDuration}>{item.duration}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={[{ id: 'player' }, ...videoSamples]} // Include player as first item
                renderItem={({ item, index }) => {
                    if (index === 0) return renderVideoPlayer();
                    return renderThumbnailItem({ item, index: index - 1 });
                }}
                keyExtractor={(item, index) => item.id + index}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    flatListContent: {
        paddingBottom: 20,
    },
    videoPlayerContainer: {
        width: width,
        height: VIDEO_HEIGHT,
        position: 'relative',
    },
    video: {
        width: width,
        height: VIDEO_HEIGHT,
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
        padding: 20,
    },
    videoDetails: {
        marginTop: 40,
    },
    videoTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'sans-serif-medium',
    },
    videoDuration: {
        color: '#FFD700',
        fontSize: 14,
        fontFamily: 'sans-serif',
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignItems: 'center',
    },
    controlButton: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
    },
    thumbnailItem: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: '#222',
        borderRadius: 8,
        overflow: 'hidden',
    },
    thumbnail: {
        width: 120,
        height: 213, // 9:16 ratio for thumbnails
    },
    thumbnailInfo: {
        flex: 1,
        padding: 10,
    },
    thumbnailTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
    thumbnailDuration: {
        color: '#FFD700',
        fontSize: 12,
    },
});