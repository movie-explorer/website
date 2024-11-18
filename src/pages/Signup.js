import React from 'react';
import { Link } from "react-router-dom";
import '../styles/Auth.css';

export default function Signup() {
    return (
        <div className="auth-container">
            <h3 className="auth-header">Sign up</h3>
            <form className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Create a password" />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" placeholder="Confirm your password" />
                </div>
                <button type="submit" className="login-button">Sign up</button>
                <div className="signup-link">
                    <Link to='/login'>Already have an account? <span>Login</span></Link>
                </div>
            </form>
        </div>
    );
}
