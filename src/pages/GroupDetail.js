import React, { useState, useEffect } from 'react';
import { addMovieToGroup } from '../services/api.js';

export default function GroupDetail({ group, onRemoveGroup }) {
    const [movies, setMovies] = useState(group.movies || []);
    const [newMovie, setNewMovie] = useState('');
    const [newShowtime, setNewShowtime] = useState({});
    const token = 'Bearer <Your Auth Token>'; // Replace with your actual token logic

    const handleAddMovie = async () => {
        if (newMovie.trim() === '') {
            alert('Movie name cannot be empty.');
            return;
        }
        const tmdbID = 123; // Replace with actual TMDb ID logic
        const result = await addMovieToGroup(group.id, newMovie, tmdbID, token);

        if (result.message === 'Movie added and linked to group successfully') {
            setMovies([...movies, { name: newMovie, showtimes: [] }]);
            setNewMovie('');
        } else {
            alert(result.error || 'Failed to add movie');
        }
    };

    return (
        <div className="group-detail">
            <h2>{group.name} - Group Details</h2>

            <section className="movie-section">
                <h3>Movies</h3>
                <ul>
                    {movies.map((movie, index) => (
                        <li key={index}>{movie.name}</li>
                    ))}
                </ul>

                <div>
                    <input
                        type="text"
                        value={newMovie}
                        onChange={(e) => setNewMovie(e.target.value)}
                        placeholder="Enter movie name"
                    />
                    <button onClick={handleAddMovie}>Add Movie</button>
                </div>
            </section>
        </div>
    );
}
