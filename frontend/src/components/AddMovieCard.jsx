import { useState } from 'react';

export default function AddMovieCard({ onAdd }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
    "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const movie = Object.fromEntries(formData.entries());
    onAdd(movie);
    e.target.reset();
  };

  return (
    <div className={`card ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="card-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Add a Movie
        </h3>
        <svg className="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      <div className="card-body">
         <form onSubmit={handleSubmit}>
            <div className="add-row-1">
                <input type="text" name="title" placeholder="Movie title" required aria-label="Title" />
                <input type="text" name="director" placeholder="Director" required aria-label="Director" />
                <select name="genre" aria-label="Genre">
                    <option value="">Select genre</option>
                    {genres.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>
            <div className="add-row-2">
                <input type="text" name="notes" placeholder="Notes (optional)" aria-label="Notes" />
                <div className="add-rating">
                    <label className="add-rating-label">Rating</label>
                    <div className="star-rating add-stars">
                        {[10,9,8,7,6,5,4,3,2,1].map(i => (
                            <div key={`star-wrapper-${i}`} style={{ display: 'inline' }}>
                                <input type="radio" name="rating" id={`add-star${i}`} value={i} />
                                <label htmlFor={`add-star${i}`} title={`${i}/10`}>&#9733;</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="add-footer">
                <button type="submit">Add Movie</button>
            </div>
         </form>
      </div>
    </div>
  );
}
