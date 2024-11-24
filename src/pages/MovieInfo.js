import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/MovieInfo.css';
import noPhotoPoster from '../media/noPhotoPoster.png';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const options = {
    method: 'GET',
    url: `${TMDB_BASE_URL}/search/multi`,
    params: {
        query: 'search_term',
        include_adult: 'false',
        language: 'en-US',
        page: '1',
    },
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY2}`,
    },
};

Modal.setAppElement('#root');

function MovieInfo() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showMovies, setShowMovies] = useState(true);
    const [showTV, setShowTV] = useState(true);
    const [showPeople, setShowPeople] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // What if you had a universal remote...
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        searchMovies(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        searchMovies(newPage);
    };

    const openModal = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMovie(null);
        setIsModalOpen(false);
    };

    const filteredMovies = movies.filter((item) => {
        if (item.media_type === 'movie') return showMovies;
        if (item.media_type === 'tv') return showTV;
        if (item.media_type === 'person') return showPeople;
        return false;
    });

    return (
        <div className="movie-info-container">
            <button
                className="movie-info-header"
                onClick={() => {
                    setMovies([]);
                    setSearchQuery('');
                    setFilter('all');
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

            {filteredMovies.length > 0 && (
                <>
                    <div className="movies-section">
                        {filteredMovies.map((movie) => (
                            <div key={movie.id} className="movie-info-card">
                                <img
                                    src={
                                        movie.media_type === 'person'
                                            ? movie.profile_path
                                                ? `https://image.tmdb.org/t/p/w500${movie.profile_path}`
                                                : noPhotoPoster
                                            : movie.poster_path
                                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                : noPhotoPoster
                                    }
                                    alt={movie.title || movie.name}
                                    className="movie-info-poster"
                                    onClick={() => openModal(movie)}
                                />
                                <div className="movie-details">
                                    <h2 className="movie-title">{movie.title || movie.name}</h2>
                                    {movie.media_type === 'person' ? (
                                        <p className="movie-text">Known for: {movie.known_for_department}</p>
                                    ) : (
                                        <>
                                            <p className="movie-text">
                                                Release Date:{' '}
                                                {movie.release_date || movie.first_air_date
                                                    ? new Date(movie.release_date || movie.first_air_date).toLocaleDateString('fi-FI')
                                                    : 'N/A'}
                                            </p>
                                            <p className="movie-text">
                                                Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
                                            </p>
                                            <p className="vote-count">
                                                {movie.vote_count ? `(${movie.vote_count} votes)` : ''}
                                            </p>
                                        </>
                                    )}
                                    <p className="movie-text">Type: {movie.media_type.toUpperCase()}</p>
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
                        <p>
                            {selectedMovie.overview
                                ? selectedMovie.overview
                                : 'No overview available.'}
                        </p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default MovieInfo;