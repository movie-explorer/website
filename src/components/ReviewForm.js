import React, { useState } from 'react';
import '../styles/ReviewForm.css';

const ReviewForm = ({ onSubmit }) => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ reviewText, rating, date: new Date().toLocaleString(), email: 'user@example.com' });
        setReviewText('');
        setRating(0);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                        <button
                            type="button"
                            key={index}
                            className={index <= (hover || rating) ? "on" : "off"}
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
    );
};

export default ReviewForm;