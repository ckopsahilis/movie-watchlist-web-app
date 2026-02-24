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

The application follows a classic **server-rendered MVC pattern**:

```
Browser  ──HTTP──▶  FastAPI (routes.py)
                        │
                        ├──▶ SQLAlchemy ORM (models.py / database.py)
                        │        │
                        │        └──▶ PostgreSQL (movie_watchlist DB)
                        │
                        └──▶ Jinja2 Templates (index.html)
                                  │
                                  └──▶ Static Assets (style.css, script.js)
```

**Request lifecycle:**

1. User sends a request (e.g. `GET /` or `POST /add`).
2. FastAPI matches the route in `routes.py`.
3. The route handler receives a SQLAlchemy **session** via the `get_db` dependency.
4. The handler queries or mutates the `movies` table through the `Movie` ORM model.
5. For `GET` requests, the handler renders `index.html` with Jinja2 and returns HTML.
6. For `POST` requests, the handler performs the action, sets a flash message cookie, and redirects to `/`.

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
- The default is `postgresql://postgres:postgres@localhost:5432/movie_watchlist`.
- **`psycopg2-binary`** is the PostgreSQL driver that SQLAlchemy uses under the hood.

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

`app/flash.py` provides cookie-based flash messages with no extra dependencies:

| Function        | Description                                          |
|----------------|------------------------------------------------------|
| `set_flash()`   | Stores a message and category in short-lived cookies |
| `get_flash()`   | Reads the flash message from cookies                 |
| `clear_flash()` | Deletes flash cookies after displaying               |

---

## Frontend

### Template

`templates/index.html` — a single-page Jinja2 template containing:

- **Header** with app branding
- **Flash message** banner (auto-dismisses after 4 seconds)
- **Add Movie** collapsible card with form (title, director, genre, notes, star rating)
- **Filter bar** with search, genre dropdown, status filter, and sort selector
- **Movie table** with all fields and action buttons (edit, toggle watched, delete)
- **Pagination** controls
- **Edit dialog** (`<dialog>` element) for inline editing
- **Empty state** when no movies match

### Styling

`static/style.css` — custom styles on top of Pico CSS:

- Dark theme with accent color `#6b8aff`
- Star rating widget (pure CSS, no JavaScript)
- Responsive grid layouts for the add form
- Badge styles for genre, watched/unwatched status
- Flash message animations
- Collapsible card UI
- Action button hover effects

### JavaScript

`static/script.js` — minimal vanilla JS:

| Function          | Purpose                                        |
|------------------|------------------------------------------------|
| `toggleCard(id)`  | Collapse/expand the "Add Movie" card           |
| `initFlash()`     | Auto-dismiss flash messages after 4 seconds    |
| `openEdit(...)`   | Populate and open the edit dialog               |
| `closeEditDialog()` | Close the edit dialog                        |

---

## API Routes

All routes are defined in `app/routes.py`.

### Pages

| Method | Path               | Description                                |
|--------|--------------------|--------------------------------------------|
| `GET`  | `/`                | List movies with search, filter, sort, pagination |

### Actions (form submissions)

| Method | Path               | Description                                |
|--------|--------------------|--------------------------------------------|
| `POST` | `/add`             | Add a new movie                            |
| `POST` | `/edit/{movie_id}` | Update an existing movie                   |
| `POST` | `/watched/{movie_id}` | Toggle watched/unwatched status         |
| `POST` | `/delete/{movie_id}` | Delete a movie                           |

All `POST` routes redirect to `/` with a flash message after completing the action.

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
