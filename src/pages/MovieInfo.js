import React, { useState } from 'react';
import axios from 'axios';
import '../styles/MovieInfo.css';
import noPhotoPoster from '../media/noPhotoPoster.png';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const options = {
    method: 'GET',
    url: `${TMDB_BASE_URL}/search/movie`,
    params: { include_adult: 'false', language: 'en-US', page: '1' },
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY2}`,
    },
};

function MovieInfo() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const searchMovies = async (pageNumber = 1) => {
        if (!searchQuery) return;

        try {
            const response = await axios.request({
                ...options,
                params: { ...options.params, page: pageNumber, query: searchQuery },
            });
            const data = response.data;
            setMovies(data.results || []);
            setTotalPages(data.total_pages || 1);
            setError(null);
        } catch (err) {
            setError('Error fetching movies.');
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        searchMovies(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        searchMovies(newPage);
    };

    // What if you had a universal remote...
    const handleHeaderClick = () => {
        setMovies([]);
        setSearchQuery('');
    };


    return (
        <div className="movie-info-container">
            <button
                className="movie-info-header"
                onClick={handleHeaderClick}
                style={{cursor: 'pointer'}}
            >
                Movie info
            </button>
            <form onSubmit={handleSearch} className="movie-info-search-bar">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="movie-info-search-input"
                />
                <button type="submit" className="movie-info-search-button">
                    Search
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {movies.length > 0 && (
                <>
                    <div className="movies-section">
                        {movies.map((movie) => (
                            <div key={movie.id} className="movie-info-card">
                                <img
                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : noPhotoPoster}
                                    alt={movie.title}
                                    className="movie-info-poster"
                                />
                                <div className="movie-details">
                                    <h2 className="movie-title">{movie.title}</h2>
                                    <p className="movie-text">Release
                                        Date: {movie.release_date ? new Date(movie.release_date).toLocaleDateString('fi-FI') : 'N/A'}</p>
                                    <p className="movie-text">Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10</p>
                                    <p className="movie-text">Language: {movie.original_language?.toUpperCase() || 'N/A'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="movie-info-pagination">
                        <button
                            className="movie-info-pagination-button"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            {'<'}
                        </button>
                        <span className="pagination-info">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="movie-info-pagination-button"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            {'>'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default MovieInfo;