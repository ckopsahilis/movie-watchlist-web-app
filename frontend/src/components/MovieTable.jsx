import MovieRow from './MovieRow';

export default function MovieTable({ movies, total, onEdit, onToggleWatch, onDelete }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
              <line x1="7" y1="2" x2="7" y2="22"/>
              <line x1="17" y1="2" x2="17" y2="22"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <line x1="2" y1="7" x2="7" y2="7"/>
              <line x1="2" y1="17" x2="7" y2="17"/>
              <line x1="17" y1="17" x2="22" y2="17"/>
              <line x1="17" y1="7" x2="22" y2="7"/>
          </svg>
          <h3>No movies found</h3>
          <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="results-meta">
          <span>Showing {movies.length} of {total} movie{total !== 1 ? 's' : ''}</span>
      </div>
      <figure>
        <table role="grid">
          <thead>
            <tr>
              <th>Title</th>
              <th>Director</th>
              <th>Genre</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Dates</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <MovieRow 
                key={movie.id} 
                movie={movie} 
                onEdit={() => onEdit(movie)}
                onToggleWatch={() => onToggleWatch(movie.id)}
                onDelete={() => onDelete(movie.id)}
              />
            ))}
          </tbody>
        </table>
      </figure>
    </>
  );
}
