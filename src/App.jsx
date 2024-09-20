import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

const API_KEY = import.meta.env.VITE_API_KEY;

const genresList = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10749, name: 'Romance' },
  { id: 37, name: 'Western' },
];

const ratingsList = [
  { id: 1, label: '1 to 5', value: '1,5' },
  { id: 2, label: '5 or above', value: '5,10' },
  { id: 3, label: '6 or above', value: '6,10' },
  { id: 4, label: '7 or above', value: '7,10' },
  { id: 5, label: '8 or above', value: '8,10' },
  { id: 6, label: '9 or above', value: '9,10' },
];

const App = () => {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [selectedRating, setSelectedRating] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');

  const fetchMovie = async (genre, rating) => {
    try {
      const randomPage = Math.floor(Math.random() * 500) + 1;
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${randomPage}&with_genres=${genre}&vote_average.gte=${rating.split(',')[0]}&vote_average.lte=${rating.split(',')[1]}`);
      return response.data;
    } catch (err) {
      setError('Error fetching movie data.');
      return null;
    }
  };
  
  const fetchTrailer = async (movieId) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`);
      const trailers = response.data.results;
      const trailer = trailers.find((vid) => vid.type === 'Trailer');
      return trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';
    } catch (err) {
      setError('Error fetching trailer data.');
      return '';
    }
  };
  

  const fetchRandomMovie = async () => {
    const data = await fetchMovie(selectedGenre, selectedRating);
    if (data && data.results.length > 0) {
      const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
      setMovie(randomMovie);
      setTrailerUrl(await fetchTrailer(randomMovie.id));
      setError('');
    } else {
      setError('No movies found. Try with different ratings/genre.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Cinemart :)</h1>
      <div className="flex-container">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="dropdown"
        >
          <option value={0}>Select Genre</option>
          {genresList.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="dropdown"
        >
          <option value=''>Select IMDb Rating</option>
          {ratingsList.map((rating) => (
            <option key={rating.id} value={rating.value}>
              {rating.label}
            </option>
          ))}
        </select>
        {selectedGenre > 0 && selectedRating && (
          <button onClick={fetchRandomMovie} className="button">
            Suggest
          </button>
        )}
      </div>
      {movie && (
        <div className="movie-info">
          <div className="movie-card">
            <h2 className="movie-title">{movie.title} ({movie.release_date.split('-')[0]})</h2>
            <p className="movie-type">Rating: {movie.vote_average}</p>
            {movie.poster_path && (
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="poster" />
            )}
          </div>
          
          <div className="movie-description">
            <h3>Description:</h3>
            <p>{movie.overview || 'No description available for this movie.'}</p>
          </div>

          {trailerUrl && (
            <div className="trailer-section">
              <h3>Trailer:</h3>
              <iframe
                width="400"
                height="205"
                src={trailerUrl}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <ScrollingText />
    </div>
  );
};

const ScrollingText = () => {
  return (
    <div className="scroll-container">
      <div className="scrolling-text">
        {Array(10).fill(null).map((_, i) => (
          <span key={i}>| A cute little app which will potentially save you hours! :) | </span>
        ))}
      </div>
    </div>
  );
};

export default App;
