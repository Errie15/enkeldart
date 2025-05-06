// src/utils/speechRecognition.ts

import React from 'react';

// Typdefinitioner för webkitSpeechRecognition om de saknas
declare global {
  interface Window {
    // SpeechRecognition API är inte standardiserat, så vi måste använda any här
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    continuous: boolean;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
  }
  interface SpeechRecognitionEvent extends Event {
    results: {
      [index: number]: {
        0: {
          transcript: string;
        };
      };
    };
    resultIndex: number;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
}

export type SpeechRecognitionStatus = 'idle' | 'listening' | 'error' | 'unsupported';

export interface UseSpeechRecognitionResult {
  transcript: string;
  status: SpeechRecognitionStatus;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
}

export function useSpeechRecognition(continuous = false): UseSpeechRecognitionResult {
  const [transcript, setTranscript] = React.useState('');
  const [status, setStatus] = React.useState<SpeechRecognitionStatus>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      setStatus('unsupported');
      setError('Taligenkänning stöds inte i denna webbläsare.');
      return;
    }
    const RecognitionClass =
      typeof window.webkitSpeechRecognition === 'function'
        ? window.webkitSpeechRecognition
        : typeof (window as unknown as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition === 'function'
        ? (window as unknown as { SpeechRecognition: new () => SpeechRecognition }).SpeechRecognition
        : undefined;
    if (!RecognitionClass) {
      setStatus('unsupported');
      setError('Taligenkänning stöds inte i denna webbläsare.');
      return;
    }
    const recognition: SpeechRecognition = new RecognitionClass();
    recognition.lang = 'sv-SE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = continuous;
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let fullTranscript = '';
      const results = event.results as unknown as Array<{ 0: { transcript: string } }>;
      for (let i = event.resultIndex; i < Object.keys(event.results).length; ++i) {
        fullTranscript += results[i][0].transcript + ' ';
      }
      setTranscript(fullTranscript.trim());
      setStatus('listening');
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError('Fel vid taligenkänning: ' + event.error);
      setStatus('error');
    };
    recognition.onend = () => {
      if (continuous) {
        recognition.start(); // Starta om automatiskt
        setStatus('listening');
      } else {
        setStatus('idle');
      }
    };
    // Clean up
    return () => {
      recognition.stop();
    };
  }, [continuous]);

  const startListening = React.useCallback(() => {
    setTranscript('');
    setError(null);
    if (recognitionRef.current) {
      setStatus('listening');
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = React.useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setStatus('idle');
    }
  }, []);

  return { transcript, status, error, startListening, stopListening };
} 