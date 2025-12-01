import sqlite3

# Connect to (or create) the SQLite database
conn = sqlite3.connect("speedCoder.db")
cursor = conn.cursor()

# ================================
# CREATE TABLES
# ================================

# codeSnippets table
cursor.execute("""
CREATE TABLE IF NOT EXISTS codeSnippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    language TEXT NOT NULL DEFAULT 'plain',
    snippet TEXT,
    isActive INTEGER NOT NULL DEFAULT 1,
    difficultyLv TEXT
);
""")

# users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    total_attempts INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avg_wpm INTEGER NOT NULL DEFAULT 0,
    best_wpm INTEGER NOT NULL DEFAULT 0,
    easy_best_wpm INTEGER NOT NULL DEFAULT 0,
    medium_best_wpm INTEGER NOT NULL DEFAULT 0,
    hard_best_wpm INTEGER NOT NULL DEFAULT 0
);
""")

# userAttempts table
cursor.execute("""
CREATE TABLE IF NOT EXISTS userAttempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    snippet_id INTEGER,
    wpm REAL NOT NULL,
    accuracy REAL NOT NULL,
    duration_seconds REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    correct_characters INTEGER,
    incorrect_characters INTEGER,
    difficultyLv TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(snippet_id) REFERENCES codeSnippets(id)
);
""")

# ================================
# INSERT SAMPLE DATA
# ================================

# Insert snippets
cursor.execute("""
INSERT INTO codeSnippets (language, snippet, isActive, difficultyLv) VALUES
('python', 'print("Hello, world!")', 1, 'easy'),
('python', 'for i in range(10): print(i)', 1, 'easy'),
('javascript', 'console.log("Hello, world!");', 1, 'easy'),
('java', 'System.out.println("Hello, World!");', 1, 'easy'),
('python', 'def add(a, b):\\n    return a + b', 1, 'medium'),
('javascript', 'function add(a, b) { return a + b; }', 1, 'medium');
""")

# Insert users (⚠️ hashes are placeholders)
cursor.execute("""
INSERT INTO users (username, password_hash, email, total_attempts, avg_wpm, best_wpm, easy_best_wpm, medium_best_wpm, hard_best_wpm)
VALUES 
('testuser1', '$2b$12$EXAMPLEHASH1234567890ABCDEFGHIJKL', 'test1@example.com', 5, 72, 85, 90, 80, 70),
('coder123', '$2b$12$ANOTHERHASH0987654321ZXCVBNMLKJH', 'coder@example.com', 10, 60, 78, 88, 76, 60);
""")

# Insert userAttempts
cursor.execute("""
INSERT INTO userAttempts (
    user_id, snippet_id, wpm, accuracy, duration_seconds, 
    correct_characters, incorrect_characters, difficultyLv
) VALUES
(1, 1, 75.5, 98.6, 42.3, 120, 2, 'easy'),
(1, 2, 68.0, 92.3, 50.0, 115, 9, 'easy'),
(2, 3, 82.1, 95.2, 39.5, 130, 6, 'medium'),
(2, 5, 60.4, 87.0, 55.2, 110, 16, 'medium');
""")

# Save and close
conn.commit()
conn.close()

print("✅ Database initialized with tables + sample data!")