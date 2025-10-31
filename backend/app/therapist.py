import asyncio
import re
import google.generativeai as genai
from typing import List, Dict, Any, Optional
from datetime import datetime

from .utils.logger import therapist_logger
from .config import settings
from .rag_system import TherapyRAG
from .db import add_message

class GeminiTherapist:
    """AI Therapist using Gemini API with RAG support"""

    def __init__(
        self,
        gemini_api_key: str,
        rag_system: Optional[TherapyRAG] = None,
        model_name: str = None,
        session_id: Optional[str] = None
    ):
        self.logger = therapist_logger.getChild("GeminiTherapist")
        self.model_name = model_name or settings.GEMINI_MODEL
        self.conversation_history: List[Dict[str, Any]] = []
        self.rag_system = rag_system
        self.session_id = session_id

        # Initialize Gemini API
        genai.configure(api_key=gemini_api_key)
        
        # Configure the model with generation settings
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.8,
            "top_k": 40
        }
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config=generation_config
        )
        
        # Start chat
        self.chat_session = self.model.start_chat(history=[])

    def _build_system_prompt(self, context: str = "") -> str:
        """Build system prompt with RAG context"""
        base_prompt = """You are a compassionate and empathetic AI therapist who speaks in a warm, natural, and conversational tone. 
            Your goal is to make the user feel heard, supported, and understood — not analyzed or lectured.

            Focus on:
            1. Active Listening & Validation — show genuine understanding of the user’s feelings.
            2. Emotional Support — express empathy and comfort naturally, like a caring human.
            3. Gentle Guidance — offer simple, realistic coping ideas or next steps when helpful.
            4. Professional Boundaries — never overstep into diagnosis, medical advice, or therapy substitutes.

            Tone and Style:
            * Speak like a calm, friendly therapist — genuine, relatable, and easy to talk to.
            * Use everyday language with warmth and compassion (e.g., “That sounds really tough,” “I totally get that,” “It’s okay to feel that way”).
            * Avoid sounding too formal, clinical, or robotic.
            * Reflect the user’s emotions before giving advice or suggestions.
            * Keep responses concise — short and meaningful most of the time, longer only when truly necessary to provide clarity or comfort.

            Safety Protocol:
            * If the user expresses suicidal thoughts or intent → Urge immediate professional help or emergency services.
            * For serious or ongoing distress → Encourage reaching out to a licensed therapist or counselor.
            * Never provide medical diagnoses, prescriptions, or definitive treatment plans.

            Response Style:
            Your replies should feel calm, genuine, and human — like a grounded therapist who listens first and speaks with care.
            They can be short and conversational, with longer explanations only when depth is needed for understanding or comfort.

            Reference Example Style:
            > “That sounds really rough. It makes sense you’d feel that way after trying so hard. Want to tell me a bit more about what’s been going on? We can take it one step at a time.”
        """

        if context:
            base_prompt += f"\n{context}"
        
        if self.conversation_history:
            base_prompt += f"\n\nConversation History:\n{self._format_conversation_history()}"
            
        base_prompt += "\n\nRespond as a compassionate therapist while following all guidelines above."
        
        return base_prompt

    def _format_conversation_history(self) -> str:
        """Format conversation history for context"""
        if not self.conversation_history:
            return "No previous conversation."
            
        formatted = []
        for msg in self.conversation_history[-settings.MAX_CONVERSATION_HISTORY:]:
            role = "User" if msg["role"] == "user" else "Therapist"
            formatted.append(f"{role}: {msg['content']}")
            
        return "\n".join(formatted)

    async def chat(
        self,
        user_message: str,
        use_rag: bool = True,
        n_examples: int = 3
    ) -> Dict[str, Any]:
        """Generate a response to user message"""
        try:
            # Get RAG context if enabled
            context = ""
            sources_used = []
            if use_rag and self.rag_system:
                retrieved = await self.rag_system.retrieve(user_message, n_examples)
                if retrieved:
                    context_parts = []
                    for i, result in enumerate(retrieved, 1):
                        context_parts.append(f"Example {i}:\n{result['text']}")
                        sources_used.append(result['metadata']['source'])
                    context = "\n\n".join(context_parts)

            # Build the complete message with context and guidelines
            system_prompt = self._build_system_prompt(context)
            complete_message = f"{system_prompt}\n\nUser: {user_message}"
            
            # Add user message to history
            user_ts = datetime.utcnow().isoformat()
            self.conversation_history.append({
                "role": "user",
                "content": user_message,
                "timestamp": user_ts
            })
            # Persist user message if session_id available
            try:
                if self.session_id:
                    add_message(self.session_id, "user", user_message, user_ts)
            except Exception as e:
                self.logger.warning(f"Failed to persist user message for session {self.session_id}: {e}")

            # Generate response with retry/backoff on rate-limit errors
            max_attempts = 3
            attempt = 0
            response = None
            while True:
                try:
                    response = self.chat_session.send_message(complete_message)
                    break
                except Exception as e:
                    msg = str(e)
                    self.logger.error(f"Error from Gemini API (attempt {attempt+1}): {msg}")

                    # Detect rate-limit / quota errors in the message
                    is_rate_limit = any(k in msg.lower() for k in ("rate limit", "quota", "429"))

                    # Try to extract retry delay from message text (e.g., 'retry_delay { seconds: 10 }' or 'Retry in 10.16s')
                    retry_seconds = None
                    try:
                        m = re.search(r"retry.*?(?:seconds[:\s]*)([0-9]+(?:\.[0-9]+)?)", msg, re.IGNORECASE)
                        if not m:
                            m = re.search(r"retry in\s*([0-9]+(?:\.[0-9]+)?)s", msg, re.IGNORECASE)
                        if m:
                            retry_seconds = float(m.group(1))
                    except Exception:
                        retry_seconds = None

                    if is_rate_limit:
                        attempt += 1
                        if attempt >= max_attempts:
                            # Give up and surface a clear rate-limit error including suggested retry delay when available
                            if retry_seconds:
                                raise Exception(f"Rate limit/quota exceeded. Retry after {retry_seconds} seconds. Original: {msg}")
                            raise Exception(f"Rate limit/quota exceeded. Original: {msg}")

                        # Wait and retry (use provided retry_seconds if present, otherwise exponential backoff)
                        backoff = retry_seconds if retry_seconds else min(2 ** attempt, 30)
                        self.logger.warning(f"Rate-limited by Gemini API. Sleeping {backoff}s before retry (attempt {attempt}/{max_attempts}).")
                        await asyncio.sleep(backoff)
                        continue
                    else:
                        # Non-rate-limit error: transform into clearer messages where possible
                        if "API key" in msg.lower():
                            raise Exception("Invalid or missing API key. Please check your configuration.")
                        raise Exception(f"Error from Gemini API: {msg}")

            # Add assistant response to history
            assistant_ts = datetime.utcnow().isoformat()
            assistant_message = {
                "role": "assistant",
                "content": response.text,
                "timestamp": assistant_ts
            }
            self.conversation_history.append(assistant_message)

            # Persist assistant message if session_id available
            try:
                if self.session_id:
                    add_message(self.session_id, "assistant", response.text, assistant_ts)
            except Exception as e:
                self.logger.warning(f"Failed to persist assistant message for session {self.session_id}: {e}")

            # Trim history if needed
            if len(self.conversation_history) > settings.MAX_CONVERSATION_HISTORY * 2:
                self.conversation_history = self.conversation_history[-settings.MAX_CONVERSATION_HISTORY * 2:]

            return {
                "response": response.text,
                "sources_used": sources_used if sources_used else None,
                "timestamp": datetime.now()
            }

        except Exception as e:
            self.logger.error(f"Error in chat: {str(e)}")
            raise

    def reset_conversation(self) -> None:
        """Clear conversation history"""
        self.conversation_history = []
        self.chat_session = self.model.start_chat(history=[])

    async def get_conversation_summary(self) -> str:
        """Generate a summary of the conversation"""
        if not self.conversation_history:
            return "No conversation to summarize."

        try:
            summary_prompt = (
                "Please provide a concise summary of the following therapy conversation, highlighting:\n"
                "1. Main topics discussed\n"
                "2. User's key concerns\n"
                "3. Your therapeutic approaches used\n"
                "4. Any action items or recommendations given\n\n"
                f"Conversation:\n{self._format_conversation_history()}"
            )

            response =  self.chat_session.send_message(summary_prompt)

            return response.text

        except Exception as e:
            self.logger.error(f"Error in get_conversation_summary: {str(e)}")
            raise

    def get_conversation_history(self) -> List[Dict[str, Any]]:
        """Return the conversation history"""
        return self.conversation_history