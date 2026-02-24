"""
Utility script — print all movies in the database.

Usage:
    python -m scripts.check_db
"""

import psycopg2

from app.config import DATABASE_URL


def main():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("SELECT id, title, director, is_watched, rating FROM movies ORDER BY id")
    rows = cur.fetchall()

    print(f"{'ID':<5} {'Title':<30} {'Director':<20} {'Watched':<10} {'Rating'}")
    print("-" * 75)
    for row in rows:
        rating = row[4] if row[4] else "-"
        print(f"{row[0]:<5} {row[1]:<30} {row[2]:<20} {str(row[3]):<10} {rating}")
    print(f"\nTotal: {len(rows)} movie(s)")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
