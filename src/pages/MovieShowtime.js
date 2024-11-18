import React, { useState } from 'react'
import '../styles/MovieShowtime.css'
import { fetchShowtimes } from '../services/api.js'

const MovieShowtimes = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [date, setDate] = useState("01.11.2024") // Default date

  const handleDateChange = (event) => {
    setDate(event.target.value)
  }

  const loadShowtimes = async () => {
    setLoading(true)
    setError(null)
    try {
      const moviesArray = await fetchShowtimes(date)
      setMovies(moviesArray)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="movie-showtimes">
      <h1>Plaza, Oulu - Showtimes</h1>
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
          !loading && <p>No showtimes available for {date}.</p>
        )}
      </div>
    </div>
  )
}

const MovieCard = ({ movie }) => (
  <div className="movie-card">
    <img src={movie.poster} alt={`${movie.title} poster`} className="movie-poster" />
    <h3>{movie.title}</h3>
    <p><strong>Showtime:</strong> {new Date(movie.showtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    <p><strong>Language:</strong> {movie.language}</p>
    <p><strong>Subtitles:</strong> {movie.subtitles}</p>
    <p><strong>Rating:</strong> {movie.rating}</p>
    <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
    <p><strong>Auditorium:</strong> {movie.auditorium}</p>
    <a href={movie.link} target="_blank" rel="noopener noreferrer">More details</a>
  </div>
)

export default MovieShowtimes