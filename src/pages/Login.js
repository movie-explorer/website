import {Link, useNavigate} from "react-router-dom";
import React, { useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Käsitellään syötteet
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Lomakkeen lähetys
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://172.232.152.215:3000/login', {
                username: formData.email,
                password: formData.password
            });

            const token = response.data.token; // Oletetaan, että backend palauttaa tokenin
            localStorage.setItem('token', token); // Tallenna token LocalStorageen
            setSuccess(JSON.stringify(response.data));
            setError('');
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <h3 className="auth-header">Sign in</h3>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form className="login-form" onSubmit={handleSubmit}>
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
