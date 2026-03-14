import { useEffect, useRef, useState } from 'react';

export default function EditMovieDialog({ movie, onClose, onSave }) {
  const dialogRef = useRef(null);
  const [formData, setFormData] = useState({});

  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
    "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"
  ];

  useEffect(() => {
    if (movie) {
      setFormData(movie); // populate with existing standard values
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [movie]);

  if (!movie) return null; // Unmount completely when null

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <dialog ref={dialogRef} onClose={onClose}>
      <article>
        <header>
          <button aria-label="Close" onClick={(e) => { e.preventDefault(); onClose() }}></button>
          <h3>Edit Movie</h3>
        </header>
        <form onSubmit={handleSubmit}>
          {/* Inputs properly bound to formData state */}
          <div className="edit-row">
            <label>Title
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required />
            </label>
            <label>Director
              <input type="text" name="director" value={formData.director || ''} onChange={handleChange} required />
            </label>
          </div>
          <div className="edit-row">
            <label>Genre
              <select name="genre" value={formData.genre || ''} onChange={handleChange}>
                  <option value="">None</option>
                  {genres.map(g => (
                      <option key={g} value={g}>{g}</option>
                  ))}
              </select>
            </label>
            <div className="add-rating">
              <label className="add-rating-label">Rating</label>
              <div className="star-rating add-stars" id="editStars">
                  {[10,9,8,7,6,5,4,3,2,1].map(i => (
                      <div key={`edit-star-wrapper-${i}`} style={{ display: 'inline' }}>
                          <input type="radio" name="rating" id={`edit-star${i}`} value={i} 
                                 checked={Number(formData.rating) === i} 
                                 onChange={handleChange} />
                          <label htmlFor={`edit-star${i}`} title={`${i}/10`}>&#9733;</label>
                      </div>
                  ))}
              </div>
            </div>
          </div>
          <label>Notes
            <textarea name="notes" rows="3" value={formData.notes || ''} onChange={handleChange}></textarea>
          </label>
          <footer>
             <button type="button" className="secondary" onClick={onClose}>Cancel</button>
             <button type="submit">Save Changes</button>
          </footer>
        </form>
      </article>
    </dialog>
  );
}
