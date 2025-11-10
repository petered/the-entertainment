import { MediaFile, SortOption } from './types';

/**
 * Determines the media type based on file extension
 * @param filename - The name of the file including extension
 * @returns 'image', 'video', or null if not a supported media type
 */
export const getMediaType = (filename: string): 'image' | 'video' | null => {
  const lowerName = filename.toLowerCase();
  
  // Image extensions
  if (lowerName.match(/\.(jpg|jpeg|png|gif|bmp|webp|heic)$/)) {
    return 'image';
  }
  
  // Video extensions
  if (lowerName.match(/\.(mp4|mov|avi|mkv|webm|m4v|3gp)$/)) {
    return 'video';
  }
  
  return null;
};

/**
 * Sorts media files based on the specified sort option
 * @param files - Array of media files to sort
 * @param sortBy - Sort method: 'name', 'date', or 'random'
 * @returns Sorted array of media files
 */
export const sortMediaFiles = (files: MediaFile[], sortBy: SortOption): MediaFile[] => {
  const sortedFiles = [...files];
  
  switch (sortBy) {
    case 'name':
      return sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'date':
      return sortedFiles.sort((a, b) => {
        const timeA = a.modificationTime || 0;
        const timeB = b.modificationTime || 0;
        return timeB - timeA; // Most recent first
      });
    
    case 'random':
      // Fisher-Yates shuffle algorithm
      for (let i = sortedFiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sortedFiles[i], sortedFiles[j]] = [sortedFiles[j], sortedFiles[i]];
      }
      return sortedFiles;
    
    default:
      return sortedFiles;
  }
};
