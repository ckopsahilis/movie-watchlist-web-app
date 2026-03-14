"""
Movie Watchlist — FastAPI application factory.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.routes import router


def create_app() -> FastAPI:
    """Build and configure the FastAPI application."""
    app = FastAPI(title="Movie Watchlist")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Serve static assets (CSS, JS)
    app.mount("/static", StaticFiles(directory="static"), name="static")

    # Register route handlers
    app.include_router(router)

    # Create database tables on startup
    @app.on_event("startup")
    def on_startup():
        Base.metadata.create_all(bind=engine)

    return app
