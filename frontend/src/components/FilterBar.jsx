export default function FilterBar({ filters, onFilterChange }) {
    const genres = [
        "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
        "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"
    ];

    const handleChange = (e) => {
        onFilterChange({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <form className="filter-bar" onSubmit={e => e.preventDefault()}>
            <input 
                type="search" 
                name="q" 
                value={filters.q} 
                onChange={handleChange} 
                placeholder="Search by title or director..." 
                aria-label="Search" 
            />
            <select name="genre" value={filters.genre} onChange={handleChange} aria-label="Genre">
                <option value="">All Genres</option>
                {genres.map(g => (
                    <option key={g} value={g}>{g}</option>
                ))}
            </select>
            <select name="status" value={filters.status} onChange={handleChange} aria-label="Status">
                <option value="">All Status</option>
                <option value="watched">Watched</option>
                <option value="unwatched">Unwatched</option>
            </select>
            <select name="sort" value={filters.sort} onChange={handleChange} aria-label="Sort">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title_asc">Title A-Z</option>
                <option value="title_desc">Title Z-A</option>
                <option value="rating_high">Highest Rated</option>
                <option value="rating_low">Lowest Rated</option>
                <option value="watched">Watched First</option>
            </select>
        </form>
    );
}
