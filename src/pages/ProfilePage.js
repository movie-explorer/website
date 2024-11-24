import React, { useState, useEffect } from "react";
import '../styles/ProfilePage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://172.232.152.215:3000/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(response.data.user);
                setFavorites(response.data.favorites);
                setReviews(response.data.reviews);
                setGroups(response.data.groups);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Well this is embarrassing, we could not fetch your profile data.');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem('token');
        // Did you like the new Top Gun movie?
        if (window.confirm("This action cannot be undone")) {
            try {
                const response = await axios.delete('http://172.232.152.215:3000/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="accountInformation">
                <p><strong>Name:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Account created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="accountSettings">
                <p><strong>Account settings:</strong></p>
                <button className="change-password-btn">Change Password</button>
            </div>

            <div className="favoriteMoviesList">
                <p><strong>Favorite Movies:</strong></p>
                {favorites.length > 0 ? (
                    favorites.map((movie, index) => (
                        <p key={index}>{movie.title}</p>
                    ))
                ) : (
                    <p>No favorite movies added yet.</p>
                )}
            </div>

            <div className="reviewsList">
                <p><strong>Your Reviews:</strong></p>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.reviewID}>
                            <p>{review.text}</p>
                            <p>Rating: {review.rating}/10</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>

            <div className="groupsList">
                <p><strong>Groups you're in:</strong></p>
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <p key={group.groupID}>{group.name}</p>
                    ))
                ) : (
                    <p>No groups yet.</p>
                )}
            </div>

            <div className="profilePageImage">
                <img src="https://placehold.co/200x200" alt="someRandomImageFromUIPlan" />
            </div>

            <div className="dangerZone">
                <button className="delete-btn" onClick={handleDeleteAccount}>
                    Delete Account
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;