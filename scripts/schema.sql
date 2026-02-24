-- ============================================================
-- Movie Watchlist — Database Schema
-- ============================================================
-- This is the PostgreSQL schema that SQLAlchemy auto-generates
-- from app/models.py via Base.metadata.create_all().
--
-- You do NOT need to run this manually — the app creates the
-- table on startup. This file exists for reference and for
-- manual database setup if needed.
--
-- Manual usage:
--   psql -U postgres -d movie_watchlist -f scripts/schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS movies (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    director    VARCHAR(255) NOT NULL,
    genre       VARCHAR(100),
    notes       TEXT,
    is_watched  BOOLEAN DEFAULT FALSE,
    rating      INTEGER,
    created_at  TIMESTAMP DEFAULT NOW(),
    watched_at  TIMESTAMP
);

-- Index on id (auto-created by PRIMARY KEY, but also requested in the model)
CREATE INDEX IF NOT EXISTS ix_movies_id ON movies (id);
