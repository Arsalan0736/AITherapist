from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # API Keys and Authentication
    GEMINI_API_KEY: str

    # Paths and Models
    VECTOR_DB_PATH: str = "./therapy_vector_db"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    # Use a lower-RPM model by default to avoid free-tier quota limits.
    # Can be overridden with the GEMINI_MODEL environment variable.
    GEMINI_MODEL: str = "gemini-2.0-flash-lite"

    # Application Settings
    MAX_CONVERSATION_HISTORY: int = 10
    SESSION_TIMEOUT_HOURS: int = 24
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    LOG_LEVEL: str = "INFO"

    # RAG System Settings
    RAG_N_RESULTS: int = 3
    BATCH_SIZE: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings instance
settings = Settings()