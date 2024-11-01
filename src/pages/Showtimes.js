import React, { useEffect, useState } from 'react'
import { fetchShowtimes } from '../services/api'

const MovieShowtimes = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadShowtimes = async () => {
      try {
        const moviesArray = await fetchShowtimes()
        setMovies(moviesArray)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadShowtimes()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="movie-showtimes">
      <h1>Plaza, Oulu - Showtimes for November 1, 2024</h1>
      <div className="movies-container">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))
        ) : (
          <p>No showtimes available.</p>
        )}
      </div>
    </div>
  )
}

const MovieCard = ({ movie }) => {
  return (
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
}

export default MovieShowtimes