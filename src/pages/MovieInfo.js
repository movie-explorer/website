import React, { useState, useEffect } from 'react';
import { useUser } from '../components/UserProvider.js';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/MovieInfo.css';
import ReviewForm from "../components/ReviewForm.js";
import noPhotoPoster from '../media/noPhotoPoster.png';
import { addFavorite } from '../components/FavoriteList.js';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

Modal.setAppElement('#root');

function MovieInfo() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showMovies, setShowMovies] = useState(true);
    const [showTV, setShowTV] = useState(true);
    const [showPeople, setShowPeople] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]); 
    const { email, token } = useUser();
    const [favError, setFavError] = useState(null);

    const searchMovies = async (pageNumber = 1) => {
        if (!searchQuery) return;

        try {
            const response = await axios.request({
                method: 'GET',
                url: `${TMDB_BASE_URL}/search/multi`,
                params: {
                    query: searchQuery,
                    include_adult: 'false',
                    language: 'en-US',
                    page: pageNumber,
                },
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY2}`,
                },
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

    const openModal = async (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMovie(null);
        setIsModalOpen(false);
        setReviews([]);
    };

    const filteredMovies = movies.filter((item) => {
        if (item.media_type === 'movie') return showMovies;
        if (item.media_type === 'tv') return showTV;
        if (item.media_type === 'person') return showPeople;
        return false;
    });

    const handleAddToFavorites = async (movie) => {
        console.log(movie)
        const message = await addFavorite(movie.id, token, setFavError, movie.name);
        if (message) {
            alert("Movie added to favorites!");
        }
    };

    return (
        <div className="movie-info-container">
            <button
                className="movie-info-header"
                onClick={() => {
                    setMovies([]);
                    setSearchQuery('');
                    setShowMovies(true);
                    setShowTV(true);
                    setShowPeople(true);
                }}
                style={{ cursor: 'pointer' }}
            >
                Movie Info
            </button>
            <p>Search movies, TV series, or people</p>
            <form onSubmit={handleSearch} className="movie-info-search-bar">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Die Hard"
                    className="movie-info-search-input"
                />
                <button type="submit" className="movie-info-search-button">
                    Search
                </button>
            </form>

            <div className="movie-info-filters">
                <label>
                    <input
                        type="checkbox"
                        checked={showMovies}
                        onChange={() => setShowMovies(!showMovies)}
                    />
                    Movies
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showTV}
                        onChange={() => setShowTV(!showTV)}
                    />
                    TV Series
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showPeople}
                        onChange={() => setShowPeople(!showPeople)}
                    />
                    People
                </label>
            </div>

            {error && <p className="error-message">{error}</p>}
            {favError && <p className="error-message">{favError}</p>}

            {filteredMovies.length > 0 && (
                <div className="movies-section">
                    {filteredMovies.map((movie) => (
                        <div key={movie.id} className="movie-info-card">
                            <img
                                src={movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : noPhotoPoster
                                }
                                alt={movie.title || movie.name}
                                className="movie-info-poster"
                                onClick={() => openModal(movie)}  
                            />
                            <div className="movie-details">
                                <h2 className="movie-title">{movie.title || movie.name}</h2>
                                <p className="movie-text">
                                    {movie.release_date || movie.first_air_date
                                        ? new Date(movie.release_date || movie.first_air_date).toLocaleDateString('fi-FI')
                                        : 'N/A'}
                                </p>
                                <button
                                    className="add-to-favorites-button"
                                    onClick={() => handleAddToFavorites(movie)}
                                >
                                    Add to Favorites
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Movie Overview"
                className="movie-modal"
                overlayClassName="movie-modal-overlay"
            >
                {selectedMovie && (
                    <div>
                        <h2>{selectedMovie.title || selectedMovie.name}</h2>
                        <p>{selectedMovie.overview || 'No overview available.'}</p>
                        <div className="rating">
                            <hr />
                            <h4>Did you watch the movie? Rate it!</h4>
                            <ReviewForm movieId={selectedMovie.id} reviews={reviews} />
                        </div>
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default MovieInfo;
