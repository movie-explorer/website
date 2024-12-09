import React, { useEffect, useState } from 'react';
import '../styles/RandomMovie.css';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export default function RandomMovie() {
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 


    const fetchPopularMovies = async () => {
        setLoading(true);
        setError(null); 

        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
            );

    
            const movies = response.data.results;
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            setMovie(randomMovie);
            setLoading(false);
        } catch (error) {
            setError('🎥 Something went wrong while fetching the movies.');
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopularMovies();
    }, []);

    return (
        <div className="random-movie-card">
            {loading ? (
                <p>Loading...</p> 
            ) : error ? (
                <p>{error}</p> 
            ) : (
                <>
                    <img
                        className="random-movie-image"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                    <div className="random-movie-title">
                        {movie.title} | {movie.vote_average.toFixed(1)}
                    </div>
                    <p className="random-movie-description">{movie.overview}</p>
                </>
            )}
        </div>
    );
}