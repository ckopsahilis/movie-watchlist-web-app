# Movie Watchlist

A full-stack web application to track, rate, and manage your personal movie watchlist. Built with **FastAPI**, **PostgreSQL**, **SQLAlchemy**, and **Jinja2** templates, styled with [Pico CSS](https://picocss.com/).

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql&logoColor=white)

## Screenshot

<img width="1517" height="906" alt="Image" src="https://github.com/user-attachments/assets/d08ee3e8-7bb4-4c64-9916-04253f81b341" />

## Features

- **Add movies** with title, director, genre, notes, and star rating (1–10)
- **Edit and delete** movies
- **Mark as watched/unwatched** with automatic timestamp tracking
- **Search** by title or director
- **Filter** by genre and watched status
- **Sort** by date, title, rating, or watched status
- **Pagination** with configurable page size
- **Flash messages** for user feedback (cookie-based, no extra dependencies)
- **Dark theme** UI with Pico CSS
- **Responsive** design

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Python 3.10+, FastAPI, Uvicorn      |
| Database   | PostgreSQL, SQLAlchemy 2.0 ORM      |
| Frontend   | Jinja2 templates, Pico CSS, vanilla JS |
| DB Driver  | psycopg2-binary                     |

## Project Structure

```
movie-watchlist-project/
├── main.py              # Entry point — creates and runs the app
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (DB connection, etc.)
├── app/
│   ├── __init__.py      # Application factory (create_app)
│   ├── config.py        # Loads settings from .env
│   ├── database.py      # SQLAlchemy engine, session, Base
│   ├── models.py        # Movie ORM model
│   ├── routes.py        # All route handlers (CRUD, search, pagination)
│   ├── schemas.py       # Pydantic schemas & genre choices
│   └── flash.py         # Cookie-based flash message helpers
├── scripts/
│   ├── schema.sql       # SQL reference for the database schema
│   ├── migrate.py       # One-time migration script
│   └── check_db.py      # Utility to print all movies in the DB
├── templates/
│   └── index.html       # Main Jinja2 template
└── static/
    ├── style.css        # Custom styles
    └── script.js        # Client-side JavaScript
```

## Prerequisites

- **Python 3.10+**
- **PostgreSQL 13+** (running locally or remotely)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/ckopsahilis/movie-watchlist-web-app.git
cd movie-watchlist-web-app
```

### 2. Create a virtual environment

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE movie_watchlist;"
```

Or run the schema file manually:

```bash
psql -U postgres -d movie_watchlist -f scripts/schema.sql
```

> **Note:** The app auto-creates the `movies` table on startup via SQLAlchemy, so this step is optional.

### 5. Configure environment variables

Create a `.env` file in the project root (or edit the existing one):

```dotenv
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/movie_watchlist
ITEMS_PER_PAGE=10
```

### 6. Run the application

```bash
uvicorn main:app --reload
```

The app will be available at **http://127.0.0.1:8000**.

## Scripts

| Command                        | Description                            |
|--------------------------------|----------------------------------------|
| `python -m scripts.check_db`   | Print all movies in the database       |
| `python -m scripts.migrate`    | Run one-time migration (add new columns) |


## Documentation

For more detailed technical information, see the [Documentation](DOCUMENTATION.md).


## License

This project is open source and available under the [MIT License](LICENSE).
