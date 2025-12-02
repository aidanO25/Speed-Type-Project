# init_db.py
from sqlalchemy import text
from db import ENGINE



def initialize_db():
    with ENGINE.connect() as conn:
        # move all your conn.execute(...) calls here
        conn.execute(text("""CREATE TABLE ..."""))
    
        # Create tables
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

        # Insert sample data
        conn.execute(text("""
            INSERT INTO codeSnippets (language, snippet, isActive, difficultyLv) VALUES
            ('python', 'print(''Hello, world!'')', TRUE, 'easy'),
            ('python', 'for i in range(10): print(i)', TRUE, 'easy'),
            ('javascript', 'console.log("Hello, world!");', TRUE, 'easy'),
            ('java', 'System.out.println("Hello, World!");', TRUE, 'easy'),
            ('python', 'def add(a, b):\\n    return a + b', TRUE, 'medium'),
            ('javascript', 'function add(a, b) { return a + b; }', TRUE, 'medium')
            ON CONFLICT DO NOTHING;
        """))

        conn.execute(text("""
            INSERT INTO users (username, password_hash, email, total_attempts, avg_wpm, best_wpm, easy_best_wpm, medium_best_wpm, hard_best_wpm)
            VALUES 
            ('testuser1', '$2b$12$EXAMPLEHASH1234567890ABCDEFGHIJKL', 'test1@example.com', 5, 72, 85, 90, 80, 70),
            ('coder123', '$2b$12$ANOTHERHASH0987654321ZXCVBNMLKJH', 'coder@example.com', 10, 60, 78, 88, 76, 60)
            ON CONFLICT (username) DO NOTHING;
        """))

        conn.execute(text("""
            INSERT INTO userAttempts (user_id, snippet_id, wpm, accuracy, duration_seconds, correct_characters, incorrect_characters, difficultyLv)
            VALUES
            (1, 1, 75.5, 98.6, 42.3, 120, 2, 'easy'),
            (1, 2, 68.0, 92.3, 50.0, 115, 9, 'easy'),
            (2, 3, 82.1, 95.2, 39.5, 130, 6, 'medium'),
            (2, 5, 60.4, 87.0, 55.2, 110, 16, 'medium')
            ON CONFLICT DO NOTHING;
        """))

    print(" PostgreSQL database initialized.")

if __name__ == "__main__":
    initialize_db()