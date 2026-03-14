# Movie Watchlist

A full-stack web application to track, rate, and manage your personal movie watchlist. 

The application is built with a decoupled architecture leveraging a **FastAPI** backend serving JSON to a modern, reactive **React (Vite)** frontend, styled with [Pico CSS](https://picocss.com/). Data is persisted via **PostgreSQL** and **SQLAlchemy**.

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql&logoColor=white)

## UI

<img width="1517" height="906" alt="Image" src="https://github.com/user-attachments/assets/d08ee3e8-7bb4-4c64-9916-04253f81b341" />

## Features

- **Add movies** with title, director, genre, notes, and star rating (1–10)
- **Edit and delete** movies
- **Mark as watched/unwatched** with automatic timestamp tracking
- **Search** by title or director
- **Filter** by genre and watched status
- **Sort** by date, title, rating, or watched status
- **Pagination** with configurable page size
- **Flash messages** for real-time interaction feedback
- **Dark theme** UI via Pico CSS
- **Responsive** component-based architecture

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Pico CSS, pure CSS  |
| Backend    | Python 3.10+, FastAPI, Uvicorn      |
| Database   | PostgreSQL, SQLAlchemy 2.0 ORM      |
| DB Adapter | psycopg[binary] 3.x                 |

## Project Structure

```
movie-watchlist-project/
├── frontend/            # React SPA (Vite)
│   ├── index.html       # Vite entry point
│   ├── package.json     # Node dependencies
│   ├── src/             
│   │   ├── App.jsx      # Main orchestrator component
│   │   ├── main.jsx     # App injection root
│   │   ├── index.css    # Global stylesheet (Pico CSS imports)
│   │   └── components/  # Isolated declarative UI components
├── main.py              # FastAPI entry point
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (DB connection, etc.)
├── app/
│   ├── __init__.py      # Application factory (create_app + CORSMiddleware)
│   ├── config.py        # Loads settings from .env
│   ├── database.py      # SQLAlchemy engine, session, Base
│   ├── models.py        # Movie ORM model
│   ├── routes.py        # Abstract JSON REST endpoints
│   └── schemas.py       # Pydantic schemas & genre choices
└── scripts/
    ├── schema.sql       # SQL reference for the database schema
    ├── migrate.py       # SQL Migration script
    └── check_db.py      # CLI utility to print movies
```

## Prerequisites

- **Node.js 18+** / npm
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
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/movie_watchlist
ITEMS_PER_PAGE=10
```

### 6. Run the Application

The project requires running two concurrent processes during development: the **FastAPI backend** and the **Vite React frontend**.

**Terminal 1 — Backend (from project root):**
```bash
# Windows
.\venv\Scripts\activate
uvicorn main:app --reload

# macOS/Linux
source venv/bin/activate
uvicorn main:app --reload
```

The backend API will start on **http://127.0.0.1:8000/api**.

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will start and the React application will be available at **http://localhost:5173**.

## Scripts

| Command                        | Description                            |
|--------------------------------|----------------------------------------|
| `python -m scripts.check_db`   | Print all movies in the database       |
| `python -m scripts.migrate`    | Run one-time migration (add new columns) |


## Documentation

For more detailed technical information, see the [Documentation](DOCUMENTATION.md).


## License

This project is open source and available under the [MIT License](LICENSE).
