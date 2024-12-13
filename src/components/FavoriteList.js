import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useUser } from './UserProvider.js';
import { useNavigate } from 'react-router-dom';
import '../styles/FavoriteList.css';

export const addFavorite = async (movieID, token, setError, title) => {
	if (!token) {
		alert('Please sign in to add favorites');
		return;
	}

	try {
		const response = await axios.post(
			'https://moviexplorer.site/favorites',
			JSON.stringify({ movieID: parseInt(movieID), title: title }),
			{
				headers: {
					Authorization: token,
					'Content-Type': 'application/json',
				},
			}
		);

		if (response.status === 200) {
			return response.data.message;
		}
	} catch (err) {
		if (err.response) {
			if (err.response.status === 400) {
				setError('Invalid movie ID');
			} else if (err.response.status === 500) {
				setError('Server error occurred');
			} else {
				setError(`Error: ${err.response.data.error || 'Unknown error'}`);
			}
		} else {
			setError('Error adding favorite');
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

	const handleDeleteFavorite = async (movieID) => {
		if (!movieID) {
			setError('Movie ID is required');
			return;
		}

		try {
			await axios.delete('https://moviexplorer.site/favorites', {
				headers: {
					Authorization: token,
					'Content-Type': 'application/json',
				},
				data: {
					movieID: movieID,
				},
			});

			fetchFavoriteMovies();
		} catch (err) {
			if (err.response) {
				if (err.response.status === 500) {
					setError('Server error occurred');
				} else {
					setError('Failed to delete favorite movie');
				}
			} else {
				setError('Network error occurred');
			}
		}
	};

	const fetchFavoriteMovies = useCallback(async () => {
		if (!user || !token) {
			setError('User not authenticated');
			navigate('/login');
			return;
		}

		setIsLoading(true);
		try {
			const response = await axios.get('https://moviexplorer.site/favorites', {
				headers: {
					Authorization: token,
					'Content-Type': 'application/json',
				},
			});

			if (response.status === 200) {
				setFavorites(response.data.favorites || []);
				setError(null);
			}
		} catch (err) {
			if (err.response) {
				if (err.response.status === 500) {
					setError('Server error occurred');
				} else {
					setError(err.response.data.error || 'Error fetching favorites');
				}
			} else {
				setError('Error connecting to server');
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
				<table className="favorites-table">
					<thead>
						<tr>
							<th>Movie:</th>
							<th>Delete from list:</th>
						</tr>
					</thead>
					<tbody>
						{favorites.map((movie) => (
							<tr key={movie.movieid}>
								<td>{movie.title}</td>
								<td>
									<button
										onClick={() => handleDeleteFavorite(movie.movieid)}
										className="remove-button">
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default FavoriteList;