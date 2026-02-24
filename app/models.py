"""
SQLAlchemy ORM models.
"""

from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from app.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    director = Column(String(255), nullable=False)
    genre = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    is_watched = Column(Boolean, default=False)
    rating = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    watched_at = Column(DateTime, nullable=True)
