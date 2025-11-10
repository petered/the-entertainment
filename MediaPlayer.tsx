import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { MediaFile } from './types';

interface MediaPlayerProps {
  media: MediaFile;           // The media file to display
  imageDuration: number;      // How long to display images (in seconds)
  onMediaEnd: () => void;     // Callback when media playback completes
}

const { width, height } = Dimensions.get('window');

/**
 * MediaPlayer component that displays images and plays videos
 * Automatically advances to the next media after completion
 */
export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  media,
  imageDuration,
  onMediaEnd,
}) => {
  const videoRef = useRef<Video>(null);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timers when media changes
    if (imageTimerRef.current) {
      clearTimeout(imageTimerRef.current);
      imageTimerRef.current = null;
    }

    if (media.type === 'image') {
      // Set timer for image duration
      imageTimerRef.current = setTimeout(() => {
        onMediaEnd();
      }, imageDuration * 1000);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (imageTimerRef.current) {
        clearTimeout(imageTimerRef.current);
      }
    };
  }, [media, imageDuration, onMediaEnd]);

  /**
   * Handle video playback status updates
   * Triggers onMediaEnd when video finishes playing
   */
  const handleVideoPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      onMediaEnd();
    }
  };

  // Render image
  if (media.type === 'image') {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: media.uri }}
          style={styles.media}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Render video
  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: media.uri }}
        style={styles.media}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: width,
    height: height,
  },
});
