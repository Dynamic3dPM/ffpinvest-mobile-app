import React, { useState, useRef, useEffect } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

const { width } = Dimensions.get('window');

// Sample financial videos (using publicly available demo URLs)
const videoSamples = [
    {
        id: '1',
        title: 'Stock Market Basics for Beginners',
        source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://img.youtube.com/vi/DYKMbdL8P1U/maxresdefault.jpg',
        duration: '10:35',
    },
    {
        id: '2',
        title: 'Understanding Forex Trading',
        source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: 'https://img.youtube.com/vi/8I4dIO9vSBE/maxresdefault.jpg',
        duration: '15:22',
    },
    {
        id: '3',
        title: 'Investment Strategies 2025',
        source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://img.youtube.com/vi/0sY5G1Xw1bY/maxresdefault.jpg',
        duration: '8:47',
    },
];

export default function VideoScreen() {
    const [selectedVideo, setSelectedVideo] = useState(videoSamples[0]);
    const wasPlayingRef = useRef(false);
    const isMountedRef = useRef(true);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const playerRef = useRef(null);

    // Initialize the player once with a default source
    const player = useVideoPlayer(videoSamples[0].source, player => {
        playerRef.current = player;
        if (isMountedRef.current) {
            player.loop = true;
            player.play();
            setIsPlayerReady(true);
        }
    });

    // Update player source when selectedVideo changes
    useEffect(() => {
        if (isPlayerReady && playerRef.current && isMountedRef.current) {
            playerRef.current.replace(selectedVideo.source);
        }
    }, [selectedVideo, isPlayerReady]);

    // Track component mounting status and cleanup
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
            if (playerRef.current) {
                playerRef.current.pause(); // Explicitly pause
                playerRef.current = null; // Clear reference
            }
        };
    }, []);

    // Safe player interaction method
    const safePlayerAction = (action) => {
        if (isPlayerReady && playerRef.current && isMountedRef.current) {
            try {
                action(playerRef.current);
            } catch (error) {
                console.log("Video player action failed:", error);
            }
        }
    };

    // Handle focus/blur events to control video playback
    useFocusEffect(
        React.useCallback(() => {
            if (isPlayerReady && wasPlayingRef.current) {
                safePlayerAction(p => p.play());
            }
            return () => {
                if (isPlayerReady && playerRef.current) {
                    wasPlayingRef.current = Boolean(playerRef.current.playing);
                    safePlayerAction(p => p.pause());
                }
            };
        }, [isPlayerReady])
    );

    const togglePlayPause = () => {
        safePlayerAction(p => {
            if (p.playing) {
                p.pause();
            } else {
                p.play();
            }
        });
    };

    const renderVideoItem = ({ item }) => (
        <TouchableOpacity
            style={styles.videoItem}
            onPress={() => {
                safePlayerAction(p => p.replace(item.source));
                setSelectedVideo(item);
            }}
        >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.videoDuration}>{item.duration}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <LinearGradient colors={['#000000', '#1A1A1A']} style={styles.container}>
            <View style={styles.playerContainer}>
                {isPlayerReady ? (
                    <VideoView
                        style={styles.video}
                        player={player}
                        allowsFullscreen
                        allowsPictureInPicture
                        nativeControls
                    />
                ) : (
                    <View style={styles.video}>
                        <Text style={styles.loadingText}>Loading video player...</Text>
                    </View>
                )}
                <View style={styles.videoDetails}>
                    <Text style={styles.videoTitleText}>{selectedVideo.title}</Text>
                    <View style={styles.controlsContainer}>
                        <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
                            <Ionicons
                                name={playerRef.current?.playing ? 'pause' : 'play'}
                                size={24}
                                color="#FFD700"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButton}>
                            <Ionicons name="expand" size={24} color="#FFD700" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Related Financial Videos</Text>
                <FlatList
                    data={videoSamples}
                    renderItem={renderVideoItem}
                    keyExtractor={item => item.id}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    playerContainer: {
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#008000',
    },
    video: {
        width: width,
        height: width * 9 / 16, // 16:9 aspect ratio
    },
    videoDetails: {
        padding: 10,
        backgroundColor: '#1A1A1A',
    },
    videoTitleText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'sans-serif-medium',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    controlButton: {
        padding: 8,
        marginRight: 15,
    },
    suggestionsContainer: {
        flex: 1,
        padding: 10,
    },
    suggestionsTitle: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        fontFamily: 'sans-serif',
    },
    videoItem: {
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: '#222222',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#008000',
    },
    thumbnail: {
        width: 120,
        height: 68,
    },
    videoInfo: {
        flex: 1,
        padding: 10,
    },
    videoTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        fontFamily: 'sans-serif',
    },
    videoDuration: {
        color: '#FFD700',
        fontSize: 12,
        fontFamily: 'sans-serif',
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        paddingTop: width * 9 / 32, // Center vertically in 16:9 space
    },
});