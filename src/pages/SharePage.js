import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function SharePage() {
    const [searchParams] = useSearchParams();
    const username = searchParams.get('username');
    const token = localStorage.getItem('token');
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (!username || !token) {
            return;
        }

        const fetchFavorites = async () => {
            try {
                const response = await axios.get('https://moviexplorer.site/favorites', {
                    headers: {
                        Authorization: token, 
                        'x-username': username, 
                    },
                });

                if (response.status === 200) {
                    setFavorites(response.data.favorites);
                } else if (response.status === 400) {
                    console.error('Bad request: Target username is required.');
                } else if (response.status === 500) {
                    console.error('Internal server error.');
                }
            } catch (err) {
                console.error('Error fetching favorites:', err);
            }
        };

        fetchFavorites();
    }, [username, token]);

    return (
        <div>
            <h2>{username ? `${username}'s Favorite Movies` : 'Favorite Movies'}</h2>
            <ul>
                {favorites.length > 0 ? (
                    favorites.map((movie) => (
                        <li key={movie.movieID}>{movie.title}</li>
                    ))
                ) : (
                    <p>No favorite movies found.</p>
                )}
            </ul>
        </div>
    );
}

export default SharePage;
