"""
Movie Watchlist — FastAPI application factory.
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.routes import router


def create_app() -> FastAPI:
    """Build and configure the FastAPI application."""
    app = FastAPI(title="Movie Watchlist")

    # Serve static assets (CSS, JS)
    app.mount("/static", StaticFiles(directory="static"), name="static")

    # Register route handlers
    app.include_router(router)

    # Create database tables on startup
    @app.on_event("startup")
    def on_startup():
        Base.metadata.create_all(bind=engine)

    return app
