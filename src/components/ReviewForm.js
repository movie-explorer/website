import React, { useState } from 'react';
import '../styles/ReviewForm.css';

const ReviewForm = () => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviews, setReviews] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a new review object
        const newReview = {
            username: 'Anonymous', // Default username
            reviewText,
            rating,
            date: new Date().toLocaleString(),
        };

        // Update reviews state by adding the new review
        setReviews([...reviews, newReview]);

        // Reset the form
        setReviewText('');
        setRating(0);
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
        <p>No reviews yet. Be the first to review!</p>
    ) : (
        reviews.map((review, index) => (
            <div key={index} className="review">
                <h3>{review.username || "Anonymous"}</h3>
                <p>{review.reviewText}</p>
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
                <small>{review.date}</small>
            </div>
        ))
    )}
</div>
        </div>
    );
};

export default ReviewForm;
