import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../components/UserProvider.js';
import '../styles/ReviewForm.css';

const ReviewForm = ({ movieId }) => {  // Accept movieId as a prop
    const { user, token } = useUser();
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [userData, setUserData] = useState({ email: '' });

    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://moviexplorer.site/profile', {
                headers: {
                    Authorization: token,
                },
            });
            const { email } = response.data;
            setUserData({ email });
            fetchUserReviews(email); 
        } catch (error) {
            console.error('Error fetching user data:', error.response?.data || error.message);
        }
    };

    const fetchUserReviews = async (email) => {
        try {
            const response = await axios.get(`https://moviexplorer.site/review?email=${email}`);
            const userReviews = response.data.reviews;

            const filteredReviews = userReviews.filter(a => a.movied == movieId);
            setReviews(filteredReviews); 
        } catch (error) {
            console.error('Error fetching user reviews:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchUserData();
        }
    }, [user, token, movieId]);  // Re-fetch reviews when movieId changes

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReview = {
            email: userData.email || '',
            movieID: movieId, 
            rating,
            text: reviewText,
        };

        try {
            const response = await axios.post('https://moviexplorer.site/review', newReview, {
                headers: {
                    Authorization: token,
                },
            });
            alert(response.data.message);
            setReviewText('');
            setRating(0);
            fetchUserReviews(userData.email);  
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to submit review.');
        }
    };

    return (
        <div className="review-form-container">
            <form onSubmit={handleSubmit}>
                <div className="star-rating">
                    {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                            <button
                                type="button"
                                key={index}
                                className={index <= (hover || rating) ? 'on' : 'off'}
                                onClick={() => setRating(index)}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(rating)}
                            >
                                <span className="star">&#9733;</span>
                            </button>
                        );
                    })}
                </div>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review here"
                    required
                    className="review-textarea"
                />
                <button type="submit">Submit Review</button>
            </form>

            <div className="reviews">
                {reviews.length === 0 ? (
                    <p>No reviews yet for this movie. Be the first to review!</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className="review">
                            <h3>{review.email}</h3>
                            <p>{review.text}</p>
                            <div className="review-rating">
                                {[...Array(5)].map((star, idx) => (
                                    <span
                                        key={idx}
                                        className={`star ${idx < review.rating ? 'on' : 'off'}`}
                                    >
                                        &#9733;
                                    </span>
                                ))}
                            </div>
                            <small>{new Date(review.createdAt).toLocaleString()}</small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewForm;
