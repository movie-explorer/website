import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';
import { useUser } from '../components/UserProvider.js';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '', // Käyttäjätunnus
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('https://moviexplorer.site/login', {
                username: formData.username,
                password: formData.password
            });
    
            const userData = response.data;
            const authToken = userData.token;
    
            login(userData, authToken); 
            setSuccess('Login successful');
            setError(''); 
            navigate('/');
    
        } catch (err) {
            if (err.response && err.response.data) {
                const errorData = err.response.data;
 
                if (errorData.username) {
                    setError('Incorrect username');
                } else if (errorData.password) {
                    setError('Incorrect password');
                } else {
                    setError('Incorrect password or username');
                }
            } else {
                setError('An error occurred');
            }
        }
    };
    
    

    return (
        <div className="auth-container">
            <h3 className="auth-header">Sign in</h3>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
                <div className="signup-link">
                    <Link to='/signup'>No account? <span>Sign up</span></Link>
                </div>
            </form>
        </div>
    );
}
