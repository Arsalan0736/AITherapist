import { NextResponse } from 'next/server';
import { detectEmotionFromText, type Emotion } from '@/utils/emotionDetection';

// Store active sessions
const activeSessions: Record<string, string> = {};

// Function to get or create session
async function getOrCreateSession(): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/api/sessions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'anonymous',
        metadata: { started_at: new Date().toISOString() }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.status}`);
    }

    const data = await response.json();
    return data.session_id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { message, currentEmotion } = await request.json();

    // Get or create a session
    const sessionId = await getOrCreateSession();

    // Send chat request to backend
    const backendResponse = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
        use_rag: true,
        n_examples: 3
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      throw new Error(`Chat API responded with status ${backendResponse.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await backendResponse.json();

    return NextResponse.json({
      response: data.response,
      detectedEmotion: currentEmotion || detectEmotionFromText(message),
      session_id: sessionId,
      sources_used: data.sources_used
    });
  } catch (error) {
    console.error('Error in therapist API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
