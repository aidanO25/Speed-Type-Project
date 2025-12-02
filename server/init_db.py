from sqlalchemy import text
from db import ENGINE

def initialize_db():
    with ENGINE.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                email TEXT,
                total_attempts INTEGER DEFAULT 0,
                avg_wpm FLOAT DEFAULT 0,
                best_wpm FLOAT DEFAULT 0,
                easy_best_wpm FLOAT DEFAULT 0,
                medium_best_wpm FLOAT DEFAULT 0,
                hard_best_wpm FLOAT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """))

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS codeSnippets (
                id SERIAL PRIMARY KEY,
                language VARCHAR(50),
                snippet TEXT,
                isActive BOOLEAN DEFAULT TRUE,
                difficultyLv VARCHAR(20)
            );
        """))

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS userAttempts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                snippet_id INTEGER REFERENCES codeSnippets(id),
                wpm FLOAT,
                accuracy FLOAT,
                duration_seconds FLOAT,
                correct_characters INTEGER,
                incorrect_characters INTEGER,
                difficultyLv VARCHAR(20),
                attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """))

        conn.execute(text("""
            INSERT INTO codeSnippets (language, snippet, isActive, difficultyLv) VALUES
            ('python', 'print(''Hello, world!'')', TRUE, 'easy'),
            ('python', 'for i in range(10): print(i)', TRUE, 'easy'),
            ('javascript', 'console.log("Hello, world!");', TRUE, 'easy'),
            ('java', 'System.out.println("Hello, World!");', TRUE, 'easy'),
            ('python', 'def add(a, b):\n    return a + b', TRUE, 'medium'),
            ('javascript', 'function add(a, b) { return a + b; }', TRUE, 'medium')
            ON CONFLICT DO NOTHING;
        """))

        conn.commit()

if __name__ == "__main__":
    initialize_db()