import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ReviewForm.css';

const ReviewForm = ({ movieId }) => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [userData, setUserData] = useState({ email: '' });

    const fetchUserReviews = async () => {
        try {
            const response = await axios.get('https://moviexplorer.site/review');
            const userReviews = response.data.reviews;

            const filteredReviews = userReviews.filter(a => a.movied == movieId);
            setReviews(filteredReviews);
        } catch (error) {
            console.error('Error fetching user reviews:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchUserReviews();
    }, [movieId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReview = {
            email: userData.email || '',
            movieID: movieId,
            rating,
            text: reviewText,
        };

        try {
            const response = await axios.post('https://moviexplorer.site/review', newReview);
            alert(response.data.message);
            setReviewText('');
            setRating(0);
            fetchUserReviews();
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
                            <h3>
                                <div className="review-user-email">
                                    {review.email} {/* Displaying the reviewer’s email */}
                                </div>
                            </h3>
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