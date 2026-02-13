# Virtual Video Chat App

A responsive web application that simulates an interactive video conversation with a virtual anime-style character using seamless video playback and browser-based speech recognition.

![Virtual VC Demo](./public/demo-screenshot.png)

Demo app: https://virtual-vc.netlify.app/

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome or Edge recommended for speech recognition)

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdurahmonK/vvc.git
cd vvc

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack & Rationale

### Framework: **React + Vite**
- **Why React**: Component-based architecture perfect for managing complex state transitions between video states
- **Why Vite**: Lightning-fast hot module replacement (HMR) for smooth development experience, optimized production builds

### Styling: **Tailwind CSS v4**
- Modern utility-first CSS framework
- Custom theme with glassmorphism effects and dark gradients
- Excellent for responsive design and rapid prototyping

### Speech Recognition: **Web Speech API**
- **Native browser API** - no external dependencies or API keys required
- Real-time transcription with interim results
- Works offline once the page is loaded
- Free and privacy-friendly (no data sent to external servers)

### State Management: **React Hooks**
- `useState` for local component state
- `useCallback` for optimized event handlers
- `useRef` for managing media elements and timers
- Custom hook (`useSpeechRecognition`) for speech logic encapsulation

## 🎬 Video Playback Strategy

### Seamless Transitions
The app uses a **dual-buffer video player** approach to achieve smooth, gap-free transitions:

1. **Two Video Elements**: Maintains two `<video>` elements in the DOM
2. **Preloading**: While one video plays, the next video is preloaded in the background
3. **Cross-Fade**: Uses CSS opacity transitions (300ms) for smooth visual transitions
4. **Active Index Switching**: Toggles between video elements without interrupting playback

```typescript
// Core seamless playback logic:
// 1. Preload next video in hidden element
nextVideo.src = videoUrl;
nextVideo.load();

// 2. Start playback
await nextVideo.play();

// 3. Cross-fade with CSS
currentVideo.style.opacity = '0';
nextVideo.style.opacity = '1';

// 4. Clean up after transition
setTimeout(() => setActiveIndex(nextIndex), 300);
```

### State Machine
Video playback follows a strict state machine pattern:
- **IDLE** → **GREETING** → **LISTENING** → **RESPONSE** → **LISTENING** (loop)
- **GOODBYE** → **IDLE**

### Looping States
IDLE and LISTENING states loop continuously until a transition occurs, providing a natural "waiting" animation.

## 🎤 Speech Integration

### Architecture
Built a custom `useSpeechRecognition` hook that encapsulates all speech logic:

```typescript
const {
  isListening,
  transcript,
  startListening,
  stopListening
} = useSpeechRecognition(handleSpeechResult);
```

### Keyword Detection
Uses simple **substring matching** for keyword detection:

| Keywords | Response Type |
|----------|---------------|
| "hello", "hi" | GREETING |
| "weather", "today" | WEATHER |
| "bye", "goodbye" | GOODBYE |
| Default | GENERAL |

### Silence Detection
- Starts an 8-second timer when listening begins
- If no speech detected, triggers a "prompt" response
- Timer resets on any speech activity
- Prevents awkward silence during conversation

### Error Handling
- Checks browser compatibility on mount
- Handles microphone permission denials gracefully
- Displays error messages to user with retry option
- Automatically restarts recognition on unexpected stops

## ✅ Implemented Features

### Core Requirements
- ✅ **Seamless video playback** with state transitions
- ✅ **Browser speech recognition** (Web Speech API)
- ✅ **Keyword-based responses** (greeting, weather, general)
- ✅ **Clean, maintainable codebase** (TypeScript, component-based)
- ✅ **No page refreshes** - fully client-side

### Stretch Goals
- ✅ **Silence detection** - prompts user after 8 seconds
- ✅ **Responsive design** - works on desktop and tablets
- ✅ **Modern UI** - glassmorphism effects, dark theme, animations
- ✅ **Conversation history** - displays transcript of entire chat
- ✅ **Visual feedback** - microphone visualizer with pulse animations
- ✅ **Status indicator** - shows current state with themed colors

## 🎯 Challenges & Solutions

### Challenge 1: Tailwind CSS v4 Configuration
**Problem**: Tailwind v4 changed its architecture, breaking the standard PostCSS setup.

**Solution**: Switched to `@tailwindcss/vite` plugin and updated CSS imports to use `@import "tailwindcss"` instead of `@tailwind` directives.

### Challenge 2: Video Not Autoplaying on Load
**Problem**: The idle video wouldn't play on initial page load due to state change detection logic.

**Solution**: Added a dedicated initialization effect that runs once on mount to load and play the first video before any state changes occur.

### Challenge 3: Glassmorphism Effects Not Visible
**Problem**: Semi-transparent UI elements (`bg-white/5`) were invisible against the default white background.

**Solution**: Added a dark gradient background to the entire page:
```css
background: linear-gradient(135deg, #0a0a0f 0%, #1a0f2e 50%, #0f1a2e 100%);
```

### Challenge 4: Speech Recognition Restarting During Video Playback
**Problem**: Recognition would restart prematurely while the response video was still playing.

**Solution**: Implemented strict state checks - only allow restart when `videoState === 'LISTENING'` and video has ended.

## ⚠️ Known Limitations

1. **Browser Compatibility**: 
   - Speech recognition only works in Chromium-based browsers (Chrome, Edge, Brave)
   - Safari and Firefox not fully supported

2. **Language Support**: 
   - Currently only supports English (en-US)
   - Adding multilingual support would require language detection logic

3. **Keyword Matching**:
   - Uses simple substring matching - may have false positives
   - More sophisticated NLP would improve accuracy

4. **Video Assets**:
   - Requires externally hosted video files (not included in repo)
   - Large video files can impact initial load time

5. **No Persistence**:
   - Conversation history resets on page reload
   - Could be improved with localStorage or backend integration

## 🔮 Future Enhancements

### Short-term
- [ ] Add more response types (sports, music, jokes, etc.)
- [ ] Implement speech synthesis for vocal responses
- [ ] Add volume control and mute toggle
- [ ] Improve keyword matching with fuzzy search
- [ ] Add multiple language support

### Long-term
- [ ] **AI Integration**: Use GPT-4/Claude for natural conversation
- [ ] **Dynamic Video Generation**: Generate character responses on-the-fly
- [ ] **Multiple Characters**: Choose between different virtual personalities
- [ ] **Backend Integration**: Save conversations, user preferences
- [ ] **Mobile App**: React Native version for iOS/Android
- [ ] **Voice Cloning**: Match synthesized voice to character personality

## 📁 Project Structure

```
virtual-vc/
├── src/
│   ├── components/
│   │   ├── SeamlessVideoPlayer.tsx   # Dual-buffer video player
│   │   └── MicrophoneVisualizer.tsx  # Animated mic indicator
│   ├── hooks/
│   │   └── useSpeechRecognition.ts   # Speech API wrapper
│   ├── utils/
│   │   ├── stateMachine.ts           # State transition logic
│   │   ├── videoMap.ts               # Video URL mappings
│   │   ├── keywordMatcher.ts         # Keyword detection
│   │   └── types.ts                  # TypeScript types
│   ├── types/
│   │   └── speech-recognition.d.ts   # Web Speech API types
│   ├── App.tsx                       # Main application
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Global styles
├── public/
│   └── videos/                       # Video assets (not included)
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎥 Demo Video

![Demo Recording](./public/demo/screen-recording.webp)

### Demo Coverage
1. **Happy Path**: Start → Greeting → Listening state with mic visualizer
2. **Video Transitions**: Smooth cross-fade between different states
3. **UI Elements**: Dark theme, glassmorphism effects, status indicators
