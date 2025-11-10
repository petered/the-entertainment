import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { MediaFile } from './types';

interface MediaPlayerProps {
  media: MediaFile;
  imageDuration: number;
  onMediaEnd: () => void;
}

const { width, height } = Dimensions.get('window');

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  media,
  imageDuration,
  onMediaEnd,
}) => {
  const videoRef = useRef<Video>(null);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timers
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

    return () => {
      if (imageTimerRef.current) {
        clearTimeout(imageTimerRef.current);
      }
    };
  }, [media, imageDuration, onMediaEnd]);

  const handleVideoPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      onMediaEnd();
    }
  };

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
