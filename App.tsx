/**
 * The Entertainment - Media Gallery Player
 * 
 * A React Native application for playing images and videos in sequence
 * with configurable sorting and duration options.
 * 
 * Features:
 * - Multi-file selection
 * - Sequential playback (images and videos)
 * - Sort by name, date, or random
 * - Configurable image duration
 * - Full-screen playback
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { MediaPlayer } from './MediaPlayer';
import { MediaFile, SortOption, AppSettings } from './types';
import { getMediaType, sortMediaFiles } from './utils';

export default function App() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>({
    sortBy: 'name',
    imageDuration: 5,
  });
  const [folderPath, setFolderPath] = useState<string>('');

  const selectFolder = async () => {
    try {
      // On React Native, we can't select folders directly, so we'll use document picker
      // and scan the parent directory. For a real implementation, you'd need platform-specific
      // code or use expo-media-library for gallery access.
      Alert.alert(
        'Folder Selection',
        'This demo will use document picker to select files. In a production app, you would use platform-specific APIs to access folders.',
        [{ text: 'OK' }]
      );

      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });

      if (result.canceled) {
        return;
      }

      const files: MediaFile[] = [];
      
      for (const asset of result.assets) {
        const mediaType = getMediaType(asset.name);
        if (mediaType) {
          files.push({
            uri: asset.uri,
            name: asset.name,
            type: mediaType,
            modificationTime: Date.now(), // Use current time as fallback
          });
        }
      }

      if (files.length === 0) {
        Alert.alert('No Media', 'No image or video files were found.');
        return;
      }

      const sorted = sortMediaFiles(files, settings.sortBy);
      setMediaFiles(sorted);
      setCurrentIndex(0);
      setIsPlaying(false);
      setFolderPath(`${files.length} files selected`);
    } catch (error) {
      console.error('Error selecting folder:', error);
      Alert.alert('Error', 'Failed to select files. Please try again.');
    }
  };

  const handleMediaEnd = () => {
    if (currentIndex < mediaFiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reached the end, stop playing
      setIsPlaying(false);
      setCurrentIndex(0);
      Alert.alert('Playback Complete', 'All media files have been played.');
    }
  };

  const startPlayback = () => {
    if (mediaFiles.length === 0) {
      Alert.alert('No Media', 'Please select media files first.');
      return;
    }
    setIsPlaying(true);
    setCurrentIndex(0);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
  };

  const changeSortOrder = (newSort: SortOption) => {
    setSettings({ ...settings, sortBy: newSort });
    if (mediaFiles.length > 0) {
      const sorted = sortMediaFiles(mediaFiles, newSort);
      setMediaFiles(sorted);
      setCurrentIndex(0);
      setIsPlaying(false);
    }
  };

  const changeImageDuration = (duration: number) => {
    setSettings({ ...settings, imageDuration: duration });
  };

  if (isPlaying && mediaFiles.length > 0) {
    return (
      <SafeAreaView style={styles.fullScreen}>
        <MediaPlayer
          media={mediaFiles[currentIndex]}
          imageDuration={settings.imageDuration}
          onMediaEnd={handleMediaEnd}
        />
        <View style={styles.playbackOverlay}>
          <Text style={styles.overlayText}>
            {currentIndex + 1} / {mediaFiles.length} - {mediaFiles[currentIndex].name}
          </Text>
          <TouchableOpacity style={styles.stopButton} onPress={stopPlayback}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
        <StatusBar hidden />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>The Entertainment</Text>
        <Text style={styles.subtitle}>Media Gallery Player</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Media</Text>
          <Button title="Select Files" onPress={selectFolder} />
          {folderPath ? (
            <Text style={styles.infoText}>{folderPath}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                settings.sortBy === 'name' && styles.sortButtonActive,
              ]}
              onPress={() => changeSortOrder('name')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  settings.sortBy === 'name' && styles.sortButtonTextActive,
                ]}
              >
                Name
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                settings.sortBy === 'date' && styles.sortButtonActive,
              ]}
              onPress={() => changeSortOrder('date')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  settings.sortBy === 'date' && styles.sortButtonTextActive,
                ]}
              >
                Date
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                settings.sortBy === 'random' && styles.sortButtonActive,
              ]}
              onPress={() => changeSortOrder('random')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  settings.sortBy === 'random' && styles.sortButtonTextActive,
                ]}
              >
                Random
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Image Duration (seconds)</Text>
          <View style={styles.buttonRow}>
            {[3, 5, 10, 15].map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationButton,
                  settings.imageDuration === duration && styles.sortButtonActive,
                ]}
                onPress={() => changeImageDuration(duration)}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    settings.imageDuration === duration && styles.sortButtonTextActive,
                  ]}
                >
                  {duration}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {mediaFiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Media Files ({mediaFiles.length})</Text>
            <View style={styles.fileList}>
              {mediaFiles.slice(0, 10).map((file, index) => (
                <Text key={index} style={styles.fileName}>
                  {index + 1}. {file.name} ({file.type})
                </Text>
              ))}
              {mediaFiles.length > 10 && (
                <Text style={styles.fileName}>... and {mediaFiles.length - 10} more</Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Button
            title={mediaFiles.length > 0 ? 'Start Playback' : 'Select Files First'}
            onPress={startPlayback}
            disabled={mediaFiles.length === 0}
          />
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  durationButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  infoText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  fileList: {
    marginTop: 5,
  },
  fileName: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  playbackOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
