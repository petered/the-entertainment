export type MediaType = 'image' | 'video';

export interface MediaFile {
  uri: string;
  name: string;
  type: MediaType;
  modificationTime?: number;
}

export type SortOption = 'name' | 'date' | 'random';

export interface AppSettings {
  sortBy: SortOption;
  imageDuration: number; // in seconds
}
