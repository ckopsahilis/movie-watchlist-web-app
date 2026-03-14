"""
Route handlers for the Movie Watchlist application.
"""

import math
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, Form, Query, Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Movie
from app.schemas import GENRE_CHOICES
from app.config import ITEMS_PER_PAGE

router = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# GET / — list movies with search, filter, sort, pagination
# ---------------------------------------------------------------------------
@router.get("/movies")
def list_movies(
    request: Request,
    q: Optional[str] = Query(None),
    genre: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    sort: Optional[str] = Query("newest"),
    page: int = Query(1, ge=1),
    db: Session = Depends(get_db),
):
    query = db.query(Movie)

    # Search by title or director
    if q:
        query = query.filter(
            or_(
                Movie.title.ilike(f"%{q}%"),
                Movie.director.ilike(f"%{q}%"),
            )
        )

    # Filter by genre
    if genre:
        query = query.filter(Movie.genre == genre)

    # Filter by watched status
    if status == "watched":
        query = query.filter(Movie.is_watched.is_(True))
    elif status == "unwatched":
        query = query.filter(Movie.is_watched.is_(False))

    # Sort
    sort_options = {
        "newest": Movie.created_at.desc(),
        "oldest": Movie.created_at.asc(),
        "title_asc": Movie.title.asc(),
        "title_desc": Movie.title.desc(),
        "rating_high": Movie.rating.desc().nulls_last(),
        "rating_low": Movie.rating.asc().nulls_last(),
        "watched": Movie.is_watched.desc(),
    }
    query = query.order_by(sort_options.get(sort, Movie.created_at.desc()))

    # Pagination
    total = query.count()
    total_pages = max(1, math.ceil(total / ITEMS_PER_PAGE))
    page = min(page, total_pages)
    movies = query.offset((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).all()

    return {
        "movies": movies,
        "page": page,
        "total_pages": total_pages,
        "total": total,
    }


# ---------------------------------------------------------------------------
# POST /add — add a new movie
# ---------------------------------------------------------------------------
@router.post("/add")
def add_movie(
    title: str = Form(...),
    director: str = Form(...),
    genre: str = Form(""),
    notes: str = Form(""),
    rating: int = Form(None),
    db: Session = Depends(get_db),
):
    movie = Movie(
        title=title,
        director=director,
        genre=genre or None,
        notes=notes or None,
        rating=rating or None,
    )
    db.add(movie)
    db.commit()

    return {"message": f"'{title}' added"}


# ---------------------------------------------------------------------------
# POST /edit/{id} — update an existing movie
# ---------------------------------------------------------------------------
@router.post("/edit/{movie_id}")
def edit_movie(
    movie_id: int,
    title: str = Form(...),
    director: str = Form(...),
    genre: str = Form(""),
    notes: str = Form(""),
    rating: int = Form(None),
    db: Session = Depends(get_db),
):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie:
        movie.title = title
        movie.director = director
        movie.genre = genre or None
        movie.notes = notes or None
        movie.rating = rating or None
        db.commit()
        return {"message": f"'{title}' updated"}
    else:
        raise HTTPException(status_code=404, detail="Movie not found")


# ---------------------------------------------------------------------------
# POST /watched/{id} — toggle watched status
# ---------------------------------------------------------------------------
@router.post("/watched/{movie_id}")
def toggle_watched(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie:
        movie.is_watched = not movie.is_watched
        movie.watched_at = datetime.now(timezone.utc) if movie.is_watched else None
        db.commit()
        label = "watched" if movie.is_watched else "unwatched"
        return {"message": f"'{movie.title}' marked as {label}"}
    else:
        raise HTTPException(status_code=404, detail="Movie not found")


# ---------------------------------------------------------------------------
# POST /delete/{id} — delete a movie
# ---------------------------------------------------------------------------
@router.post("/delete/{movie_id}")
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie:
        title = movie.title
        db.delete(movie)
        db.commit()
        return {"message": f"'{title}' deleted"}
    else:
        raise HTTPException(status_code=404, detail="Movie not found")
