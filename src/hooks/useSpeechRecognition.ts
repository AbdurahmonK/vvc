/// <reference path="../types/speech-recognition.d.ts" />

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ResponseType } from '../utils/types';

interface UseSpeechRecognitionReturn {
    isListening: boolean;
    transcript: string;
    isSupported: boolean;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

export const useSpeechRecognition = (
    onResult: (responseType: ResponseType, transcript: string) => void
): UseSpeechRecognitionReturn => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const silenceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        // Check browser support
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            setIsSupported(true);
            recognitionRef.current = new SpeechRecognition();

            const recognition = recognitionRef.current;
            if (!recognition) return; // Type guard

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    setTranscript(finalTranscript);
                    const responseType = detectKeyword(finalTranscript);
                    onResult(responseType, finalTranscript);

                    // Reset silence timer
                    if (silenceTimerRef.current) {
                        clearTimeout(silenceTimerRef.current);
                    }
                }
            };

            recognition.onerror = (event: any) => {
                if (event.error === 'no-speech') {
                    // Trigger prompt video on no-speech detection
                    console.log('No speech detected, triggering prompt');
                    onResult('PROMPT', '');
                } else {
                    console.error('Speech recognition error:', event.error);
                    setError(`Error: ${event.error}`);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };
        } else {
            setIsSupported(false);
            setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        };
    }, [onResult]);

    const detectKeyword = (text: string): ResponseType => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('goodbye') || lowerText.includes('bye')) {
            return 'GENERAL';
        }
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return 'GREETING';
        }

        if (lowerText.includes('weather') || lowerText.includes('today')) {
            return 'WEATHER';
        }
        return 'GENERAL';
    };

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setError(null);
            setTranscript('');

            try {
                recognitionRef.current.start();
                setIsListening(true);

                silenceTimerRef.current = setTimeout(() => {
                    if (recognitionRef.current && isListening) {
                        console.log('Silence timeout, triggering prompt');
                        stopListening();
                        onResult('PROMPT', '');
                    }
                }, 8000);
            } catch (err) {
                console.error('Error starting recognition:', err);
            }
        }
    }, [isListening, onResult]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);

            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        }
    }, [isListening]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        isListening,
        transcript,
        isSupported,
        error,
        startListening,
        stopListening,
        resetTranscript,
    };
};
