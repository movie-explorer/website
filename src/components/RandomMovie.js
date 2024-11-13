import React, { useEffect, useState } from 'react';
import '../styles/RandomMovie.css';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const filmID = Math.floor(Math.random() * 1000);

export default function RandomMovie() {
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/movie/${filmID}?api_key=${API_KEY}`)
            .then((response) => setMovie(response.data))
            .catch((error) => {
                console.error(error);
                setError("Couldn't fetch movie data");
            });
    }, []);

    return (
        <div className="randomMovie-card">
            {error ? (
                <p>{error}</p>
            ) : movie ? (
                <>
                    <img
                        className="movie-image"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                    <div className="movie-title">{movie.title} | {movie.vote_average.toFixed(1)}</div>
                    <p className="movie-description">{movie.overview}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
