"""
Cookie-based flash message helpers (no extra dependencies needed).
"""

from fastapi import Request
from fastapi.responses import RedirectResponse


def set_flash(response: RedirectResponse, message: str, category: str = "info"):
    """Store a flash message in a short-lived cookie."""
    response.set_cookie("flash_message", message, max_age=5)
    response.set_cookie("flash_category", category, max_age=5)


def get_flash(request: Request):
    """Read the flash message from cookies. Returns (message, category) or (None, None)."""
    message = request.cookies.get("flash_message")
    category = request.cookies.get("flash_category", "info")
    return (message, category) if message else (None, None)


def clear_flash(response):
    """Remove flash cookies after they've been shown."""
    response.delete_cookie("flash_message")
    response.delete_cookie("flash_category")
