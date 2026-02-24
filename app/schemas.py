"""
Pydantic schemas for request validation and response serialization.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

GENRE_CHOICES = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
]


class MovieBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    director: str = Field(..., min_length=1, max_length=255)
    genre: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    is_watched: bool = False
    rating: Optional[int] = Field(None, ge=1, le=10)


class MovieCreate(MovieBase):
    pass


class MovieUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    director: str = Field(..., min_length=1, max_length=255)
    genre: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=10)


class MovieResponse(MovieBase):
    id: int
    created_at: Optional[datetime] = None
    watched_at: Optional[datetime] = None

    class Config:
        from_attributes = True
