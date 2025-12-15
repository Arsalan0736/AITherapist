'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { detectEmotionFromVideo, getEmotionColor, getEmotionDescription, type Emotion } from '@/utils/emotionDetection';
import SessionAnalytics, { saveSessionData } from '@/components/analytics/SessionAnalytics';
import { motion } from 'framer-motion';

export default function SessionPage() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai'; emotion?: string; timestamp?: Date }[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [detectedEmotion, setDetectedEmotion] = useState<Emotion | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Interval for emotion detection
  const [emotionDetectionInterval, setEmotionDetectionInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start camera and emotion detection when session becomes active
  useEffect(() => {
    if (isSessionActive && videoRef.current) {
      startCamera();

      // Start emotion detection at intervals
      const interval = setInterval(async () => {
        if (videoRef.current) {
          try {
            const emotion = await detectEmotionFromVideo(videoRef.current);
            setDetectedEmotion(emotion);
          } catch (error) {
            console.error('Error detecting emotion:', error);
          }
        }
      }, 3000); // Check emotion every 3 seconds

      setEmotionDetectionInterval(interval);
    }

    return () => {
      // Clean up video stream and interval when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      if (emotionDetectionInterval) {
        clearInterval(emotionDetectionInterval);
      }
    };
  }, [isSessionActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      // Add fallback or error message for users
      setMessages(prev => [...prev, {
        text: 'Unable to access camera. Please check your permissions and try again.',
        sender: 'ai'
      }]);
    }
  };

  const startSession = () => {
    // Generate a unique session ID
    const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    setSessionId(newSessionId);
    setIsSessionActive(true);
    setMessages([{
      text: 'Hello! I\'m your AI therapist. How are you feeling today?',
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  const endSession = () => {
    // Stop camera
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    // Clear emotion detection interval
    if (emotionDetectionInterval) {
      clearInterval(emotionDetectionInterval);
      setEmotionDetectionInterval(null);
    }

    setIsSessionActive(false);
    setMessages([]);
    setDetectedEmotion(null);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user message with timestamp
    const userMessage = currentMessage;
    const userMessageTimestamp = new Date();
    setMessages(prev => [...prev, {
      text: userMessage,
      sender: 'user',
      timestamp: userMessageTimestamp
    }]);
    setCurrentMessage('');

    try {
      // Call the API route
      const response = await fetch('/api/therapist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          currentEmotion: detectedEmotion
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      // Update the detected emotion if provided
      if (data.detectedEmotion) {
        setDetectedEmotion(data.detectedEmotion);
      }

      // Add AI response to messages with timestamp
      setMessages(prev => [...prev, {
        text: data.response,
        sender: 'ai',
        emotion: data.detectedEmotion,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I encountered an issue. Please try again. Error: ' + (error as Error).message,
        sender: 'ai'
      }]);
    }
  };

  // Handle session end and save analytics
  const handleSessionEnd = (sessionData: any) => {
    saveSessionData(sessionData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Analytics component (invisible) */}
      {isSessionActive && sessionId && (
        <SessionAnalytics
          sessionId={sessionId}
          messages={messages}
          onSessionEnd={handleSessionEnd}
        />
      )}

      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Therap<span className="text-primary">AI</span>st
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                Dashboard
              </Link>
              <Link href="/about" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                About
              </Link>
            </nav>
            {isSessionActive && (
              <button
                onClick={endSession}
                className="px-5 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm font-medium transition-colors border border-red-500/20"
              >
                End Session
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow pt-24 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">

          {/* Left side - Video */}
          <motion.div
            className="bento-card flex flex-col relative overflow-hidden p-0 bg-black"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isSessionActive ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-secondary/10">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Ready for your session?</h3>
                <p className="opacity-60 mb-8 max-w-md">
                  Connect with your AI therapist in a secure, private environment.
                  We use camera input to better understand your emotions.
                </p>
                <button
                  onClick={startSession}
                  className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                >
                  Begin Session
                </button>
              </div>
            )}

            {/* Emotion detection overlay */}
            {isSessionActive && detectedEmotion && (
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full glass border border-white/10 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getEmotionColor(detectedEmotion)} animate-pulse`}></div>
                <span className="text-sm font-medium text-white capitalize">
                  {detectedEmotion}
                </span>
              </div>
            )}
          </motion.div>

          {/* Right side - Chat */}
          <motion.div
            className="bento-card flex flex-col p-0 overflow-hidden bg-white dark:bg-stone-900"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isSessionActive ? (
              <>
                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-5 py-3 border border-gray-200 dark:border-gray-700 ${message.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-secondary text-secondary-foreground rounded-bl-none'
                          }`}
                      >
                        <p className="leading-relaxed">{message.text}</p>
                        {message.emotion && (
                          <span className="text-xs opacity-50 mt-2 block flex items-center gap-1">
                            <span>Detected:</span>
                            <span className="capitalize">{message.emotion}</span>
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-black/5 dark:border-white/5 bg-secondary/10">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-grow px-6 py-3 rounded-full bg-background border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim()}
                      className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center opacity-50">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Chat Interface</h3>
                <p className="text-sm">Start the session to enable chat</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}