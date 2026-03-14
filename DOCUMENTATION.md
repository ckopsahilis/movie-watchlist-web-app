# Movie Watchlist — Documentation

Detailed technical documentation for the Movie Watchlist application.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database](#database)
3. [Backend (FastAPI)](#backend-fastapi)
4. [Frontend](#frontend)
5. [API Routes](#api-routes)
6. [Configuration](#configuration)
7. [Utility Scripts](#utility-scripts)

---

## Architecture Overview

The application follows a decoupled **Client-Server architecture**:

```
Browser  ──HTTP──▶  React SPA (Vite Dev Server / Static Build)
                        │
                  (JSON via Fetch)
                        │
                        ▼
                    FastAPI (routes.py)
                        │
                        ├──▶ SQLAlchemy ORM (models.py / database.py)
                        │        │
                        │        └──▶ PostgreSQL (movie_watchlist DB)
```

1. User interacts with the React frontend (e.g. loads page or clicks "Add").
2. React dispatches an asynchronous `fetch()` request to the FastAPI backend.
3. FastAPI matches the route in `routes.py` (e.g., `GET /api/movies` or `POST /api/add`).
4. The route handler receives a SQLAlchemy **session** via the `get_db` dependency.
5. The handler queries or mutates the `movies` table through the `Movie` ORM model.
6. The handler returns a JSON response containing data or success/error messages.
7. React state updates locally, triggering a re-render of the isolated UI components.

---

## Database

### Connection

Defined in `app/database.py`:

```python
engine = create_engine(DATABASE_URL)               # Connection to PostgreSQL
SessionLocal = sessionmaker(..., bind=engine)       # Session factory
Base = declarative_base()                           # Base class for ORM models
```

- **`DATABASE_URL`** is loaded from the `.env` file via `app/config.py`.
- The default is `postgresql+psycopg://postgres:postgres@localhost:5432/movie_watchlist`.
- **`psycopg[binary]`** (psycopg 3.x) is the modern PostgreSQL driver that SQLAlchemy uses under the hood, natively resolving C++ build errors on Windows.

### Dependency Injection

The `get_db()` function is a FastAPI dependency generator:

```python
def get_db():
    db = SessionLocal()
    try:
        yield db        # Route handler uses this session
    finally:
        db.close()      # Automatically closed after the request
```

Every route that needs database access declares `db: Session = Depends(get_db)`.

### Table Auto-Creation

On application startup (`app/__init__.py`):

```python
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
```

SQLAlchemy inspects all model classes that inherit from `Base` and runs `CREATE TABLE IF NOT EXISTS` for each one. **No manual SQL execution is required.**

### Schema

The `movies` table (also documented in `scripts/schema.sql`):

| Column       | Type           | Constraints              |
|-------------|----------------|--------------------------|
| `id`        | `SERIAL`       | Primary key, indexed     |
| `title`     | `VARCHAR(255)` | Not null                 |
| `director`  | `VARCHAR(255)` | Not null                 |
| `genre`     | `VARCHAR(100)` | Nullable                 |
| `notes`     | `TEXT`         | Nullable                 |
| `is_watched`| `BOOLEAN`      | Default `FALSE`          |
| `rating`    | `INTEGER`      | Nullable (1–10)          |
| `created_at`| `TIMESTAMP`    | Default `NOW()`          |
| `watched_at`| `TIMESTAMP`    | Nullable                 |

---

## Backend (FastAPI)

### Application Factory

`app/__init__.py` — `create_app()`:

1. Creates a `FastAPI` instance.
2. Mounts the `/static` directory for CSS and JS.
3. Includes the router from `routes.py`.
4. Registers a startup event to create database tables.

### ORM Model

`app/models.py` — `Movie(Base)`:

Maps directly to the `movies` PostgreSQL table. SQLAlchemy handles all SQL generation:
- **Insert:** `db.add(movie)` → `INSERT INTO movies ...`
- **Update:** modify attributes, then `db.commit()` → `UPDATE movies SET ... WHERE id = ...`
- **Delete:** `db.delete(movie)` → `DELETE FROM movies WHERE id = ...`
- **Query:** `db.query(Movie).filter(...)` → `SELECT * FROM movies WHERE ...`

### Pydantic Schemas

`app/schemas.py` defines validation schemas (currently used for reference/future API expansion):

| Schema         | Purpose                              |
|---------------|--------------------------------------|
| `MovieBase`    | Shared fields with validation rules  |
| `MovieCreate`  | Input schema for creating a movie    |
| `MovieUpdate`  | Input schema for updating a movie    |
| `MovieResponse`| Output schema with `id` and dates    |

Also exports `GENRE_CHOICES` — the list of 16 genres used in the UI dropdowns.

### Flash Messages

The application handles notifications dynamically via React component state. When the backend returns a successful JSON message or an error code natively, the `App.jsx` component captures this and mounts the `<FlashMessage />` component locally in the browser, tracking a timeout ID to dismiss itself automatically without requiring server cookies.

---

## Frontend

### React Components Architecture

The frontend is a strictly declarative Single Page Application (SPA) built with React 18 and bundled via Vite.

- **`frontend/src/App.jsx`**: The main orchestrator connecting state hooks, API fetches, and child components.
- **`<Header />`**: Pure presentational branding.
- **`<AddMovieCard />`**: Form with internal expansion state and validation logic.
- **`<FilterBar />`**: Holds dropdowns linking back to the parent `filters` state.
- **`<MovieTable />`**: The primary list renderer traversing arrays of backend JSON movie objects.
- **`<Pagination />`**: Discrete component tracking mathematical offsets.
- **`<EditMovieDialog />`**: Native modal controlled declaratively via `useRef`.
- **`<FlashMessage />`**: Manages its auto-dismissing lifecycle via a `useEffect` timer.

### Styling

`frontend/src/index.css` encapsulates global custom styles merged on top of Pico CSS via CDN:

- Dark theme with accent color `#6b8aff`
- Advanced CSS selectors defining collapsable widgets, badge tags, and input scopes.
- React components inject semantic class names correlating directly to this stylesheet for native HTML presentation without heavyweight CSS-in-JS libraries.

### State Management

All interactivity replaces obsolete imperative DOM lookup (`getElementById()`) mapping directly to immutable `useState` logic synchronizing immediately against visual representations seamlessly.

---

## API Routes

All backend endpoints output strict `application/json` data and accept form-encoded or query parameter inputs over a standard `Router` prefix of `/api`.

### Endpoints (JSON)

| Method | Path                        | Description                                          |
|--------|-----------------------------|------------------------------------------------------|
| `GET`  | `/api/movies`               | List movies with search, filter, sort, pagination    |
| `POST` | `/api/add`                  | Create a new movie record and return success msg     |
| `POST` | `/api/edit/{movie_id}`      | Updates a record entirely via targeted ID targeting  |
| `POST` | `/api/watched/{movie_id}`   | Toggle watched/unwatched boolean state via ID      |
| `POST` | `/api/delete/{movie_id}`    | Deletes the mapped DB row outright                     |

### Query Parameters (GET /)

| Parameter | Type   | Default    | Description                     |
|-----------|--------|------------|---------------------------------|
| `q`       | string | `null`     | Search by title or director     |
| `genre`   | string | `null`     | Filter by genre                 |
| `status`  | string | `null`     | `watched` or `unwatched`        |
| `sort`    | string | `newest`   | Sort order (see options below)  |
| `page`    | int    | `1`        | Page number (1-based)           |

**Sort options:** `newest`, `oldest`, `title_asc`, `title_desc`, `rating_high`, `rating_low`, `watched`

---

## Configuration

### Environment Variables

Loaded from `.env` by `app/config.py`:

| Variable        | Default                                                    | Description              |
|----------------|------------------------------------------------------------|--------------------------|
| `DATABASE_URL`  | `postgresql://postgres:postgres@localhost:5432/movie_watchlist` | PostgreSQL connection string |
| `ITEMS_PER_PAGE`| `10`                                                       | Movies per page          |

### .env File Example

```dotenv
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/movie_watchlist
ITEMS_PER_PAGE=10
```

> **Important:** Never commit your `.env` file to Git. It is included in `.gitignore`.

---

## Utility Scripts

Located in the `scripts/` directory.

### check_db.py

Prints all movies in the database in a formatted table.

```bash
python -m scripts.check_db
```

### migrate.py

Runs one-time `ALTER TABLE` statements to add columns introduced after the initial schema (genre, notes, created_at, watched_at).

```bash
python -m scripts.migrate
```

### schema.sql

Reference SQL file showing the complete table definition. Not required for normal operation (SQLAlchemy handles it), but useful for:
- Manual database setup without the app
- Database documentation
- Review by team members who prefer reading SQL
