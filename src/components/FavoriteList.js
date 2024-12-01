import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/FavoriteList.css";
import { useUser } from "./UserProvider.js";

export function fetchFavoriteMovies(token) {
    return axios.get("https://moviexplorer.site/favorites", {
        headers: {
            Authorization: token,
        },
    });
}

export function addFavorite(movieID, token) {
    return axios.post(
        "https://moviexplorer.site/favorites",
        { movieID: movieID },
        {
            headers: {
                Authorization: token,
            },
        }
    );
}

export function removeFavorite(movieID, token) {
    return axios.delete(`https://moviexplorer.site/favorites/${movieID}`, {
        headers: {
            Authorization: token,
        },
    });
}

export default function FavoriteList() {
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useUser();

    const loadUserFavorites = async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await fetchFavoriteMovies(token);
            const movies = Array.isArray(response.data) ? response.data : [];
            setFavoriteMovies(movies);
            setError(null);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError("Failed to load favorites");
            setFavoriteMovies([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUserFavorites();
    }, [token]);

    const handleRemoveFavorite = async (movieID) => {
        if (!token) return;

        try {
            await removeFavorite(movieID, token);
            setFavoriteMovies(prevMovies =>
                prevMovies.filter(movie => movie.movieID !== movieID)
            );
            setError(null);
        } catch (error) {
            console.error("Error removing favorite:", error);
            setError("Failed to remove favorite");
        }
    };

    if (isLoading) {
        return <div>Loading favorites...</div>;
    }

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
                <button onClick={loadUserFavorites}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="favorites-list">
            {favoriteMovies.length === 0 ? (
                <p>No favorite movies yet</p>
            ) : (
                <ul>
                    {favoriteMovies.map((movie) => (
                        <li key={movie.movieID} className="favorite-item">
                            <div className="movie-info">
                                <span>{movie.title}</span>
                                <button
                                    onClick={() => handleRemoveFavorite(movie.movieID)}
                                    className="remove-button"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
