import sqlite3
import threading
import json
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict, Any

from .config import settings

_lock = threading.Lock()

# DB file placed alongside this module (backend/app)
DB_PATH = Path(__file__).resolve().parents[1] / "sessions.sqlite3"


def _get_conn():
    # Use check_same_thread=False to allow calls from different threads (simple apps)
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Initialize the sessions DB and tables if they don't exist."""
    with _lock:
        conn = _get_conn()
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                user_id TEXT,
                created_at TEXT,
                last_activity TEXT,
                message_count INTEGER DEFAULT 0,
                metadata TEXT
            )
            """
        )

        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                role TEXT,
                content TEXT,
                timestamp TEXT,
                FOREIGN KEY(session_id) REFERENCES sessions(session_id)
            )
            """
        )

        conn.commit()
        conn.close()


def create_session_row(session_id: str, user_id: Optional[str], metadata: Optional[Dict[str, Any]] = None) -> None:
    with _lock:
        conn = _get_conn()
        cur = conn.cursor()
        now = datetime.utcnow().isoformat()
        cur.execute(
            "INSERT OR REPLACE INTO sessions (session_id, user_id, created_at, last_activity, message_count, metadata) VALUES (?, ?, ?, ?, ?, ?)",
            (session_id, user_id, now, now, 0, json.dumps(metadata or {}))
        )
        conn.commit()
        conn.close()


def update_session_activity(session_id: str) -> None:
    with _lock:
        conn = _get_conn()
        cur = conn.cursor()
        now = datetime.utcnow().isoformat()
        cur.execute("UPDATE sessions SET last_activity = ? WHERE session_id = ?", (now, session_id))
        conn.commit()
        conn.close()


def increment_message_count(session_id: str) -> None:
    with _lock:
        conn = _get_conn()
        cur = conn.cursor()
        cur.execute("UPDATE sessions SET message_count = message_count + 1 WHERE session_id = ?", (session_id,))
        conn.commit()
        conn.close()


def add_message(session_id: str, role: str, content: str, timestamp: Optional[str] = None) -> None:
    with _lock:
        conn = _get_conn()
        cur = conn.cursor()
        ts = timestamp or datetime.utcnow().isoformat()
        cur.execute(
            "INSERT INTO messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
            (session_id, role, content, ts)
        )
        conn.commit()
        conn.close()


def get_messages(session_id: str) -> List[Dict[str, Any]]:
    conn = _get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, role, content, timestamp FROM messages WHERE session_id = ? ORDER BY id ASC", (session_id,))
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def delete_session(session_id: str) -> None:
    with _lock:
        conn = _get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
        cur.execute("DELETE FROM sessions WHERE session_id = ?", (session_id,))
        conn.commit()
        conn.close()


# Initialize DB on import
init_db()
