import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../styles/Login.css';
import axios from 'axios';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '', // Lisätty käyttäjänimi
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; 
        if (!passwordRegex.test(formData.password)) {
            setError('Password must contain at least one uppercase letter, one number, and be at least 8 characters long.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('https://moviexplorer.site/register', {
                username: formData.username, 
                email: formData.email,
                password: formData.password
            });
            setSuccess('Registration successful! Redirecting to login...');
            setError('');
            setTimeout(() => navigate('/login'), 2000); 
        } catch (err) {
            setError(err.response?.data || 'An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <h3 className="auth-header">Sign up</h3>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                </div>
                <p className="password-info">
                    Password must contain at least one uppercase letter, one number, and be at least 8 characters long.
                </p>
                <button type="submit" className="login-button">Sign up</button>
                <div className="signup-link">
                    <Link to='/login'>Already have an account? <span>Login</span></Link>
                </div>
            </form>
        </div>
    );
}
