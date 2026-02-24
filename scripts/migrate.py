"""
One-time migration — adds columns that were introduced after the initial schema.

Usage:
    python -m scripts.migrate
"""

import psycopg2

from app.config import DATABASE_URL

ALTER_STATEMENTS = [
    "ALTER TABLE movies ADD COLUMN IF NOT EXISTS genre VARCHAR(100)",
    "ALTER TABLE movies ADD COLUMN IF NOT EXISTS notes TEXT",
    "ALTER TABLE movies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()",
    "ALTER TABLE movies ADD COLUMN IF NOT EXISTS watched_at TIMESTAMP",
]


def main():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cur = conn.cursor()

    for stmt in ALTER_STATEMENTS:
        cur.execute(stmt)
        print(f"OK: {stmt}")

    cur.execute("UPDATE movies SET created_at = NOW() WHERE created_at IS NULL")
    print(f"Updated {cur.rowcount} existing row(s) with created_at")

    cur.close()
    conn.close()
    print("Migration complete!")


if __name__ == "__main__":
    main()
