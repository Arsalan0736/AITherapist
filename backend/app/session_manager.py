import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional, List, Any
from threading import Lock

from .utils.logger import session_logger
from .config import settings
from .therapist import GeminiTherapist
from .db import create_session_row, delete_session as db_delete_session, increment_message_count as db_increment_message_count, update_session_activity, get_messages

class SessionManager:
    """Manages therapy sessions and conversation state"""

    def __init__(self):
        self.logger = session_logger.getChild("SessionManager")
        self.sessions: Dict[str, GeminiTherapist] = {}
        self.session_metadata: Dict[str, Dict[str, Any]] = {}
        self._lock = Lock()

    def create_session(
        self,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Create a new therapy session"""
        try:
            session_id = str(uuid.uuid4())
            
            with self._lock:
                # Initialize therapist instance (pass session_id for persistence)
                self.sessions[session_id] = GeminiTherapist(
                    gemini_api_key=settings.GEMINI_API_KEY,
                    session_id=session_id
                )
                
                # Store session metadata
                self.session_metadata[session_id] = {
                    "created_at": datetime.now(),
                    "last_activity": datetime.now(),
                    "message_count": 0,
                    "user_id": user_id,
                    **(metadata or {})
                }
                # Persist session metadata to DB
                try:
                    create_session_row(session_id, user_id, metadata or {})
                except Exception as e:
                    self.logger.warning(f"Failed to persist session {session_id} to DB: {e}")
                
            self.logger.info(f"Created new session: {session_id}")
            return session_id
            
        except Exception as e:
            self.logger.error(f"Error creating session: {str(e)}")
            raise

    def get_session(self, session_id: str) -> Optional[GeminiTherapist]:
        """Retrieve an existing session"""
        with self._lock:
            therapist = self.sessions.get(session_id)
            if therapist:
                # Update last activity
                if session_id in self.session_metadata:
                    self.session_metadata[session_id]["last_activity"] = datetime.now()
            return therapist

    def delete_session(self, session_id: str) -> bool:
        """Remove a session"""
        with self._lock:
            if session_id in self.sessions:
                del self.sessions[session_id]
                if session_id in self.session_metadata:
                    del self.session_metadata[session_id]
                # remove persisted session data
                try:
                    db_delete_session(session_id)
                except Exception:
                    self.logger.warning(f"Failed to delete session {session_id} from DB")
                self.logger.info(f"Deleted session: {session_id}")
                return True
            return False

    def get_session_history(self, session_id: str) -> Optional[List[Dict[str, Any]]]:
        """Get conversation history for a session"""
        # Prefer persisted messages
        try:
            msgs = get_messages(session_id)
            if msgs:
                return msgs
        except Exception:
            self.logger.warning(f"Failed to read messages from DB for session {session_id}")

        # Fallback to in-memory history
        therapist = self.get_session(session_id)
        if therapist:
            return therapist.get_conversation_history()
        return None

    def get_all_sessions(self) -> List[Dict[str, Any]]:
        """List all active sessions with metadata"""
        with self._lock:
            return [
                {
                    "session_id": session_id,
                    **self.session_metadata[session_id]
                }
                for session_id in self.sessions.keys()
            ]

    def cleanup_old_sessions(self, max_age_hours: int = None) -> int:
        """Remove inactive sessions"""
        if max_age_hours is None:
            max_age_hours = settings.SESSION_TIMEOUT_HOURS
            
        cutoff_time = datetime.now() - timedelta(hours=max_age_hours)
        sessions_to_delete = []
        
        with self._lock:
            for session_id, metadata in self.session_metadata.items():
                if metadata["last_activity"] < cutoff_time:
                    sessions_to_delete.append(session_id)
                    
            for session_id in sessions_to_delete:
                self.delete_session(session_id)
                
        self.logger.info(f"Cleaned up {len(sessions_to_delete)} old sessions")
        return len(sessions_to_delete)

    def increment_message_count(self, session_id: str) -> None:
        """Increment message count for a session"""
        with self._lock:
            if session_id in self.session_metadata:
                self.session_metadata[session_id]["message_count"] += 1
                self.session_metadata[session_id]["last_activity"] = datetime.now()
                # Persist increment to DB
                try:
                    db_increment_message_count(session_id)
                    update_session_activity(session_id)
                except Exception:
                    self.logger.warning(f"Failed to update message count in DB for session {session_id}")