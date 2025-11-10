# the-entertainment

A dynamic, interactive art gallery that will engage you into the abyss

## Description

The Entertainment is a React Native media gallery player that allows you to select and play images and videos in a continuous sequence. Perfect for creating dynamic art installations, digital photo frames, or immersive media experiences.

## Features

- 📁 **File Selection**: Select multiple media files (images and videos)
- 🎬 **Sequential Playback**: Automatically plays media files one after another
- 🔀 **Sorting Options**: Sort media by name, date, or randomly
- ⏱️ **Image Duration Control**: Set how long each image displays (3, 5, 10, or 15 seconds)
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🎨 **Clean UI**: Modern, intuitive interface with easy controls

## Supported Media Formats

### Images
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)
- WebP (.webp)
- HEIC (.heic)

### Videos
- MP4 (.mp4)
- MOV (.mov)
- AVI (.avi)
- MKV (.mkv)
- WebM (.webm)
- M4V (.m4v)
- 3GP (.3gp)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/petered/the-entertainment.git
cd the-entertainment
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

Then you can:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your phone

### Platform-Specific

```bash
# iOS (requires macOS)
npm run ios

# Android
npm run android

# Web
npm run web
```

## Usage

1. **Select Files**: Tap "Select Files" to choose images and videos from your device
2. **Configure Settings**:
   - Choose sorting method: Name, Date, or Random
   - Set image duration (how long each image displays)
3. **Start Playback**: Tap "Start Playback" to begin the slideshow
4. **Control Playback**: Use the "Stop" button during playback to return to settings

## Project Structure

```
the-entertainment/
├── App.tsx              # Main application component with UI and controls
├── MediaPlayer.tsx      # Media playback component (images and videos)
├── types.ts            # TypeScript type definitions
├── utils.ts            # Utility functions for media sorting
├── package.json        # Project dependencies
└── assets/             # App icons and splash screens
```

## Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and runtime
- **TypeScript**: Type-safe JavaScript
- **expo-document-picker**: File selection
- **expo-av**: Audio/video playback
- **expo-file-system**: File system access

## Development

### Requirements
- Node.js 18 or higher
- npm or yarn
- For iOS: Xcode (macOS only)
- For Android: Android Studio

### Testing
The app can be tested on:
- Physical devices using Expo Go app
- iOS Simulator (macOS)
- Android Emulator
- Web browsers

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
