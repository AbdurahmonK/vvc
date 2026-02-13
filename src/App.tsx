import { getNextState } from './utils/stateMachine';
import { useState, useEffect, useCallback } from 'react';
import type { VideoState, ResponseType } from './utils/types';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { SeamlessVideoPlayer } from './components/SeamlessVideoPlayer';
import { MicrophoneVisualizer } from './components/MicrophoneVisualizer';


function App() {
  const [videoState, setVideoState] = useState<VideoState>('IDLE');
  const [responseType, setResponseType] = useState<ResponseType | undefined>();
  const [chatStarted, setChatStarted] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);

  const handleSpeechResult = useCallback((type: ResponseType, transcript: string) => {
    console.log('Speech result:', type, transcript);

    if (transcript.toLowerCase().includes('bye') || transcript.toLowerCase().includes('goodbye')) {
      stopListening();
      setVideoState('GOODBYE');
      setResponseType(undefined);
      if (transcript) {
        setTranscripts(prev => [...prev, `You: ${transcript}`]);
      }
      return;
    }

    if (type === 'PROMPT' && videoState === 'LISTENING') {
      stopListening();
      setVideoState('PROMPT');
      return;
    }

    if (videoState === 'LISTENING') {
      stopListening();
      setResponseType(type);
      setVideoState('RESPONSE');
      if (transcript) {
        setTranscripts(prev => [...prev, `You: ${transcript}`]);
      }
    }
  }, [videoState]);

  const {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(handleSpeechResult);

  const handleVideoEnd = () => {
    const nextState = getNextState(videoState);
    console.log('Video ended, transitioning:', videoState, '->', nextState);

    setVideoState(nextState);

    if (nextState === 'LISTENING') {
      setTimeout(() => {
        resetTranscript();
        startListening();
      }, 500);
    }

    if (nextState === 'IDLE') {
      setChatStarted(false);
      setTranscripts([]);
    }

    if (videoState === 'RESPONSE') {
      setResponseType(undefined);
    }
  };

  const handleStartChat = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setChatStarted(true);
    setVideoState('GREETING');
    setTranscripts([]);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-8 flex flex-col gap-6">
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-bg-darker shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)]">
        <SeamlessVideoPlayer
          currentState={videoState}
          responseType={responseType}
          onVideoEnd={handleVideoEnd}
          className="w-full h-full"
        />

        {!chatStarted && videoState === 'IDLE' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
            <button
              className="relative px-12 py-6 text-xl font-semibold text-white bg-gradient-to-br from-primary to-secondary rounded-full cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-100 shadow-[0_10px_30px_rgba(127,90,240,0.4),0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(127,90,240,0.6),0_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden group"
              onClick={handleStartChat}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
              Start Chat
            </button>
          </div>
        )}

        {videoState === 'LISTENING' && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 bg-white/5 backdrop-blur-[20px] p-6 rounded-[20px] border border-white/10 shadow-glass">
            <MicrophoneVisualizer isActive={isListening} />
            {transcript && (
              <p className="text-gray-400 text-sm italic max-w-[300px] text-center m-0">{transcript}</p>
            )}
          </div>
        )}

        {error && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-4 rounded-xl text-sm z-20 backdrop-blur-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            {error}
          </div>
        )}
      </div>

      {transcripts.length > 0 && (
        <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[20px] p-6 lg:p-8 max-h-[300px] overflow-y-auto shadow-glass">
          <h3 className="text-lg font-semibold mb-4 text-white">Conversation</h3>
          <div className="flex flex-col gap-2">
            {transcripts.map((text, index) => (
              <p
                key={index}
                className="text-gray-400 text-[0.95rem] leading-relaxed p-2 bg-white/[0.02] rounded-lg border-l-[3px] border-primary"
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center p-4">
        <span
          className={`
            text-[0.85rem] font-semibold uppercase tracking-wider px-6 py-2 rounded-[20px] 
            bg-white/5 border backdrop-blur-[10px] transition-all duration-300
            ${videoState === 'IDLE' ? 'text-gray-400 border-white/10' : ''}
            ${videoState === 'GREETING' || videoState === 'GOODBYE' ? 'text-primary border-primary shadow-glow-primary' : ''}
            ${videoState === 'LISTENING' ? 'text-secondary border-secondary shadow-glow-secondary animate-glow' : ''}
            ${videoState === 'RESPONSE' ? 'text-accent border-accent shadow-glow-accent' : ''}
          `}
        >
          {videoState}
        </span>
      </div>
    </div>
  );
}

export default App;
