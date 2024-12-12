import React, { useState } from 'react';
import '../styles/MovieShowtime.css';
import { fetchShowtimes } from '../services/api.js';

const theaters = new Map([
  ["Kaikki", 1029],
  ["Pääkaupunkiseutu", 1014],
  ["Espoo", 1012],
  ["Espoo: OMENA", 1039],
  ["Espoo: SELLO", 1038],
  ["Helsinki", 1002],
  ["Helsinki: ITIS", 1045],
  ["Helsinki: KINOPALATSI", 1031],
  ["Helsinki: MAXIM", 1032],
  ["Helsinki: TENNISPALATSI", 1033],
  ["Vantaa: FLAMINGO", 1013],
  ["Jyväskylä: FANTASIA", 1015],
  ["Kuopio: SCALA", 1016],
  ["Lahti: KUVAPALATSI", 1017],
  ["Lappeenranta: STRAND", 1041],
  ["Oulu: PLAZA", 1018],
  ["Pori: PROMENADI", 1019],
  ["Tampere", 1021],
  ["Tampere: CINE ATLAS", 1034],
  ["Tampere: PLEVNA", 1035],
  ["Turku ja Raisio", 1047],
  ["Turku: KINOPALATSI", 1022],
  ["Raisio: LUXE MYLLY", 1046]
]);

const MovieShowtimes = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState('16.12.2024'); 
  const [selectedTheater, setSelectedTheater] = useState(1018); 

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTheaterChange = (event) => {
    setSelectedTheater(parseInt(event.target.value, 10)); 
  };

  const loadShowtimes = async () => {
    setLoading(true);
    setError(null);
    console.log("Selected Theater ID:", selectedTheater);
    try {
      const moviesArray = await fetchShowtimes(date, selectedTheater);
      console.log("Movies Loaded:", moviesArray); 
      setMovies(moviesArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movie-showtimes">
      <h1>Showtimes</h1>
      <div className="filters-container">
        <div className="filter-box">
          <label>
            Select Date:
            <input
              type="text"
              value={date}
              onChange={handleDateChange}
              placeholder="dd.mm.yyyy"
              pattern="\d{2}.\d{2}.\d{4}"
            />
          </label>
        </div>
        <div className="filter-box">
          <label>
            Theaters:
            <select value={selectedTheater} onChange={handleTheaterChange}>
              {[...theaters.entries()].map(([name, id]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <button onClick={loadShowtimes} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Showtimes'}
      </button>
      {error && <div className="error">{error}</div>}
      <div className="movies-container">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))
        ) : (
          !loading && <p>No showtimes available for {date} at {theaters.get(selectedTheater)}.</p>
        )}
      </div>
    </div>
  );
};

const MovieCard = ({ movie }) => (
  <div className="movie-card">
    <img src={movie.poster} alt={`${movie.title} poster`} className="movie-poster" />
    <h3>{movie.title}</h3>
    <p><strong>Showtime:</strong> {new Date(movie.showtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    <p><strong>Language:</strong> {movie.language}</p>
    <p><strong>Subtitles:</strong> {movie.subtitles}</p>
    <p><strong>Rating:</strong> {movie.rating}</p>
    <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
    <p><strong>Auditorium:</strong> {movie.auditorium}</p>
    <a href={movie.link} target="_blank" rel="noopener noreferrer">More details</a>
  </div>
);


export default MovieShowtimes; 