import { useState, useEffect } from 'react';
import Header from './components/Header';
import FlashMessage from './components/FlashMessage';
import AddMovieCard from './components/AddMovieCard';
import FilterBar from './components/FilterBar';
import MovieTable from './components/MovieTable';
import Pagination from './components/Pagination';
import EditMovieDialog from './components/EditMovieDialog';

export default function App() {
  const [movies, setMovies] = useState([]); // Will fetch from FastAPI
  const [flash, setFlash] = useState(null); // { message: '', category: '' }
  const [editingMovie, setEditingMovie] = useState(null);
  const [filters, setFilters] = useState({ q: '', genre: '', status: '', sort: 'newest' });

  const fetchMovies = async (filterParams) => {
    try {
      const searchParams = new URLSearchParams(filterParams);
      const res = await fetch(`http://localhost:8000/api/movies?${searchParams}`);
      if (res.ok) {
        const data = await res.json();
        setMovies(data.movies);
      }
    } catch (err) {
      console.error(err);
      setFlash({ category: 'error', message: 'Failed to fetch movies from the backend' });
    }
  };

  useEffect(() => { 
    fetchMovies(filters); 
  }, [filters]);

  // Add Movie
  const handleAddMovie = async (movieData) => {
    try {
      const form = new URLSearchParams();
      for (const [key, value] of Object.entries(movieData)) {
        if (value) form.append(key, value);
      }
      const res = await fetch('http://localhost:8000/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form
      });
      if (res.ok) {
        const data = await res.json();
        setFlash({ category: 'success', message: data.message });
        fetchMovies(filters); // refresh list
      }
    } catch (err) {
      console.error(err);
      setFlash({ category: 'error', message: 'Failed to add movie' });
    }
  };

  // Toggle Watch Status
  const handleToggleWatch = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/watched/${id}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setFlash({ category: 'success', message: data.message });
        fetchMovies(filters);
      }
    } catch (err) {
      console.error(err);
      setFlash({ category: 'error', message: 'Failed to update status' });
    }
  };

  // Delete Movie
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/delete/${id}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setFlash({ category: 'success', message: data.message });
        fetchMovies(filters);
      }
    } catch (err) {
      console.error(err);
      setFlash({ category: 'error', message: 'Failed to delete movie' });
    }
  };

  // Edit Movie
  const handleEdit = async (updatedMovie) => {
    try {
      const form = new URLSearchParams();
      for (const [key, value] of Object.entries(updatedMovie)) {
        if (value && key !== 'id' && key !== 'created_at' && key !== 'watched_at' && key !== 'is_watched') {
          form.append(key, value);
        }
      }
      const res = await fetch(`http://localhost:8000/api/edit/${updatedMovie.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form
      });
      if (res.ok) {
        const data = await res.json();
        setFlash({ category: 'success', message: data.message });
        setEditingMovie(null); // close dialog
        fetchMovies(filters);
      }
    } catch (err) {
      console.error(err);
      setFlash({ category: 'error', message: 'Failed to update movie' });
    }
  };

  return (
    <main className="container">
      <Header />
      
      {flash?.message && (
        <FlashMessage 
          message={flash.message} 
          category={flash.category} 
          onClose={() => setFlash(null)} 
        />
      )}

      <AddMovieCard onAdd={handleAddMovie} />
      
      <FilterBar filters={filters} onFilterChange={setFilters} />
      
      <MovieTable 
        movies={movies} 
        onEdit={setEditingMovie}
        onToggleWatch={handleToggleWatch}
        onDelete={handleDelete}
      />
      
      <Pagination page={1} totalPages={1} onPageChange={(p) => setFilters({...filters, page: p})} />
      
      <EditMovieDialog 
        movie={editingMovie} 
        onClose={() => setEditingMovie(null)} 
        onSave={handleEdit} 
      />
    </main>
  );
}
