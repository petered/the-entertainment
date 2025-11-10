/**
 * Type representing the kind of media file
 */
export type MediaType = 'image' | 'video';

/**
 * Represents a media file with its metadata
 */
export interface MediaFile {
  uri: string;                    // File URI or path
  name: string;                   // Filename
  type: MediaType;                // Type of media (image or video)
  modificationTime?: number;      // Last modification time (timestamp)
}

/**
 * Available sorting options for media files
 */
export type SortOption = 'name' | 'date' | 'random';

/**
 * Application settings for media playback
 */
export interface AppSettings {
  sortBy: SortOption;             // How to sort the media files
  imageDuration: number;          // Duration to display each image (in seconds)
}
