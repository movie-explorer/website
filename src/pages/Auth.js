import { Link } from "react-router-dom";
import React from 'react';
import '../styles/Auth.css';

export default function Auth() {
    return (
        <div className="auth-container">
            <h3 className="auth-header">Sign in</h3>
            <form className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" />
                </div>
                <button type="submit" className="login-button">Login</button>
                <div className="signup-link">
                    <Link to='/signup'>No account? <span>Sign up</span></Link>
                </div>
            </form>
        </div>
    );
}
