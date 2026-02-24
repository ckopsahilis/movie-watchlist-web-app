"""
Movie Watchlist — Entry Point

Start the server:
    uvicorn main:app --reload
"""

from app import create_app

app = create_app()
