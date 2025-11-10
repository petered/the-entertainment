# Application Architecture

## Component Hierarchy

```
App (Main Container)
│
├── Configuration View (when not playing)
│   ├── File Selection Button
│   ├── Sort Options (Name/Date/Random)
│   ├── Image Duration Settings (3/5/10/15s)
│   ├── File List Preview
│   └── Start Playback Button
│
└── Playback View (when playing)
    ├── MediaPlayer Component
    │   ├── Image Display (for images)
    │   └── Video Player (for videos)
    └── Playback Controls Overlay
        ├── Progress Info (X / Y files)
        ├── Current File Name
        └── Stop Button
```

## Data Flow

```
User Action → State Update → UI Re-render → Media Playback
                                              ↓
                                         Media End Event
                                              ↓
                                      Advance to Next File
```

## State Management

### App State
- `mediaFiles`: Array of MediaFile objects
- `currentIndex`: Current playback position
- `isPlaying`: Boolean flag for playback state
- `settings`: Sort method and image duration
- `folderPath`: Display text for selected files

### Media Types
```typescript
interface MediaFile {
  uri: string;              // File location
  name: string;             // Display name
  type: 'image' | 'video';  // Media type
  modificationTime?: number; // For date sorting
}

interface AppSettings {
  sortBy: 'name' | 'date' | 'random';
  imageDuration: number; // seconds
}
```

## User Flow

1. **Launch App**
   - Display configuration screen
   - Default settings: sort by name, 5s image duration

2. **Select Files**
   - User taps "Select Files"
   - System file picker appears
   - User selects multiple media files
   - Files are filtered by supported formats
   - Files are sorted according to selected method

3. **Configure Settings**
   - User can change sort order (re-sorts immediately)
   - User can change image duration

4. **Start Playback**
   - Switch to fullscreen playback view
   - Display first media file
   - Show progress overlay

5. **During Playback**
   - Images: Display for configured duration
   - Videos: Play to completion
   - Auto-advance to next file
   - User can stop at any time

6. **End of Playlist**
   - Return to configuration screen
   - Show completion alert
   - Ready for new selection

## File Processing

```
File Selection
    ↓
getMediaType(filename)
    ↓
Filter valid media files
    ↓
sortMediaFiles(files, sortBy)
    ↓
Ready for playback
```

## Playback Logic

### Image Playback
```
Display Image
    ↓
Start Timer (imageDuration seconds)
    ↓
Timer Expires → onMediaEnd()
    ↓
Advance to Next
```

### Video Playback
```
Load Video
    ↓
Start Playback
    ↓
Monitor Status
    ↓
Video Ends → onMediaEnd()
    ↓
Advance to Next
```

## Platform Compatibility

### iOS
- Uses iOS file picker
- Requires photo library permissions
- Native video player

### Android
- Uses Android file picker
- Requires storage permissions
- Native video player

### Web (Optional)
- Uses HTML file input
- Browser-based playback
- Requires additional dependencies

## Key Design Decisions

1. **Expo Framework**: Chosen for ease of development and cross-platform support
2. **Document Picker**: Used instead of folder selection for broader compatibility
3. **TypeScript**: Ensures type safety and better developer experience
4. **Component Separation**: MediaPlayer is isolated for reusability
5. **Timer-based Images**: Simple, reliable approach for image duration
6. **Event-based Videos**: Uses native video player events for reliability

## Performance Considerations

- Media files are referenced by URI (not loaded into memory)
- Only current media file is rendered
- Efficient re-rendering with React state management
- Timer cleanup prevents memory leaks
- Video resources properly managed by expo-av

## Future Architecture Enhancements

Potential improvements:
- Add state management library (Redux/MobX) for complex state
- Implement media preloading for smoother transitions
- Add transition effects engine
- Implement background service for continuous playback
- Add media caching for faster replays
