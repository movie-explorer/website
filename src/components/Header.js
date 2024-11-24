import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container header-content">
                <nav>
                    <ul className="nav-list">
                        <li><Link to="/" className="nav-link"><b>Home</b></Link></li>
                        <li><Link to="/movieinfo" className="nav-link">Movie info</Link></li>
                        <li><Link to="/group" className="nav-link">Groups</Link></li>
                        <li><Link to="/showtimes" className="nav-link">Showtime</Link></li>
                    </ul>
                </nav>
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="account-link">Logout</button>
                ) : (
                    <Link to="/login" className="account-link">
                        <svg xmlns="http://www.w3.org/2000/svg" className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        My account
                    </Link>
                )}
            </div>
        </header>
    );
}