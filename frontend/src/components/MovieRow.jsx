export default function MovieRow({ movie, onEdit, onToggleWatch, onDelete }) {
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <tr>
            <td className="title-cell">
                <strong>{movie.title}</strong>
            </td>
            <td>{movie.director}</td>
            <td>
                {movie.genre ? (
                    <span className="badge badge-genre">{movie.genre}</span>
                ) : (
                    <span className="muted">&mdash;</span>
                )}
            </td>
            <td>
                {movie.rating ? (
                    <>
                        <span className="star-display">
                            <span className="star-filled">{'★'.repeat(movie.rating)}</span>
                            <span className="star-empty">{'★'.repeat(10 - movie.rating)}</span>
                        </span>
                        <small className="muted" style={{ marginLeft: '0.25rem' }}>{movie.rating}/10</small>
                    </>
                ) : (
                    <span className="muted">&mdash;</span>
                )}
            </td>
            <td>
                {movie.is_watched ? (
                    <span className="badge badge-watched">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Watched
                    </span>
                ) : (
                    <span className="badge badge-unwatched">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                        Unwatched
                    </span>
                )}
            </td>
            <td className="movie-dates">
                {movie.created_at && <>Added {formatDate(movie.created_at)}</>}
                {movie.watched_at && <><br/>Seen {formatDate(movie.watched_at)}</>}
            </td>
            <td className="movie-notes">
                {movie.notes ? (
                    movie.notes.length > 80 ? `${movie.notes.substring(0, 80)}...` : movie.notes
                ) : (
                    <span className="muted">&mdash;</span>
                )}
            </td>
            <td>
                <div className="actions">
                    <button type="button" className="btn-icon" title="Edit" onClick={onEdit}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>

                    <button type="button" className="btn-icon success" 
                            title={movie.is_watched ? 'Mark unwatched' : 'Mark watched'}
                            onClick={onToggleWatch}>
                        {movie.is_watched ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10"/>
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        )}
                    </button>

                    <button type="button" className="btn-icon danger" title="Delete" 
                            onClick={() => { if (window.confirm('Delete this movie?')) onDelete() }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
}
