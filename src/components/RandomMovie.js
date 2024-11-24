import React, { useEffect, useState } from 'react';
import '../styles/RandomMovie.css';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const filmID = Math.floor(Math.random() * 1000);

export default function RandomMovie() {
	const [movie, setMovie] = useState(null);
	const [error, setError] = useState(null);

	const fetchMovie = async () => {
		try {
			const response = await axios.get(
				`https://api.themoviedb.org/3/movie/${filmID}?api_key=${API_KEY}`
			);
			setMovie(response.data);
		} catch (error) {
			setError('🎥 Looks like this movie is still in production.');
			console.error(error);
		}
	};

	useEffect(() => {
		fetchMovie();
	}, []);

	return (
		<div className="random-movie-card">
			{error ? (
				<p>{error}</p>
			) : movie ? (
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
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
