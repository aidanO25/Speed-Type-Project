import sqlite3

# Connect to (or create) the SQLite database
conn = sqlite3.connect("speedCoder.db")
cursor = conn.cursor()

# Execute SELECT query
cursor.execute("SELECT * FROM users;")


# Fetch all rows
rows = cursor.fetchall()

# Print the results
for row in rows:
    print(row)

# Clean up
conn.close()