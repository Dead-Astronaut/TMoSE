import sqlite3
import os

DB_PATH = os.getenv("DATABASE_URL", "mypy.db").replace("sqlite:///./", "")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def create_tables():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            started_at TEXT NOT NULL,
            ended_at TEXT,
            certification TEXT NOT NULL,
            questions_answered INTEGER DEFAULT 0,
            correct_count INTEGER DEFAULT 0,
            duration_seconds INTEGER
        );

        CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            question_id TEXT NOT NULL,
            user_answer TEXT NOT NULL,
            is_correct INTEGER NOT NULL,
            answered_at TEXT NOT NULL,
            time_taken_seconds INTEGER,
            FOREIGN KEY (session_id) REFERENCES sessions(id)
        );

        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            certification TEXT NOT NULL,
            section TEXT NOT NULL,
            objective TEXT NOT NULL,
            questions_seen INTEGER DEFAULT 0,
            correct_count INTEGER DEFAULT 0,
            current_difficulty INTEGER DEFAULT 1,
            last_seen_at TEXT,
            mastery_status TEXT DEFAULT 'not_started',
            UNIQUE(certification, section, objective)
        );
    """)
    conn.commit()
    conn.close()
