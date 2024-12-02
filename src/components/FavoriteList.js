import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useUser } from "./UserProvider.js";
import { useNavigate } from "react-router-dom";

export const addFavorite = async (movieID, token, setError) => {
    if (!token) {
        setError("User not authenticated");
        return;
    }

    try {
        const response = await axios.post(
            "https://moviexplorer.site/favorites/",
            JSON.stringify({ movieID: parseInt(movieID) }),
            {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            return response.data.message;
        }
    } catch (err) {
        if (err.response) {
            if (err.response.status === 400) {
                setError("Invalid movie ID");
            } else if (err.response.status === 500) {
                setError("Server error occurred");
            } else {
                setError(`Error: ${err.response.data.error || 'Unknown error'}`);
            }
        } else {
            setError("Error adding favorite");
        }
        console.error(err);
        return null;
    }
};

const FavoriteList = () => {
    const { user, token } = useUser();
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // This list really tells a lot about the user. We should probably keep it private.
    const fetchFavoriteMovies = useCallback(async () => {
        if (!user || !token) {
            setError("User not authenticated");
            navigate("/login");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get("https://moviexplorer.site/favorites", {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
            });

            if (response.status === 200) {
                setFavorites(response.data.favorites || []);
                setError(null);
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 500) {
                    setError("Server error occurred");
                } else {
                    setError(err.response.data.error || "Error fetching favorites");
                }
            } else {
                setError("Error connecting to server");
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user, token, navigate]);

    useEffect(() => {
        if (user && token) {
            fetchFavoriteMovies();
        }
    }, [user, token, fetchFavoriteMovies]);

    // no ticket? no favorites!
    if (!user || !token) {
        return <p>Please log in to view your favorites</p>;
    }

    if (isLoading) {
        return <p>Loading your favorites...</p>;
    }

    return (
        <div>
            {error && <p className="error-message">{error}</p>}
            {favorites.length === 0 ? (
                <p>No favorites yet!</p>
            ) : (
                <ul>
                    {favorites.map((movie) => (
                        <li key={movie.movieID}>
                            {movie.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavoriteList;