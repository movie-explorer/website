import React, { useState, useEffect } from "react";
import '../styles/ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserProvider.js';
import axios from 'axios';

function ProfilePage() {
    const { user, token, logout } = useUser();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                // Fetch user data from the backend
                const response = await axios.get('https://moviexplorer.site/profile', {
                    headers: {
                        Authorization: token,
                    },
                });
                const { username, email, created_at } = response.data;


                // Update user details in state
                user.username = username;
                user.email = email;
                user.createdAt = created_at;
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Well this is embarrassing, we could not fetch your profile data.');
            }
        };

        fetchUserData();
    }, [token, navigate, user]);

    const handleDeleteAccount = async () => {
        if (window.confirm("This action cannot be undone")) {
            try {
                const response = await axios.delete('https://moviexplorer.site/deleteme', {
                    headers: {
                        Authorization: token,
                    },
                });

                if (response.status === 200) {
                    logout();
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                setError('Could not delete your account.');
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
                <p><strong>Account created:</strong> {user.createdAt}</p>
            </div>

            <div className="accountSettings">
                <p><strong>Account settings:</strong></p>
                <button className="change-password-btn">Change Password</button>
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