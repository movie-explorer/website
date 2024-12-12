import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import RandomMovie from "../components/RandomMovie.js";
import News from "../components/news.js";

function Home() {
    return (
        <>
            <header className="banner">
                <img
                    src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Clapperboard for movie production"
                    className="banner-image"
                />
            </header>

            <main className="main-content">
                <div className="banner-text banner-below">
                    <h1>Welcome to Movie Explorer!</h1>
                </div>

                <div className="container main-grid">
                    <section className="main-section">
                        <div className="info-section">
                            <h2>Your one-stop destination for movie information and showtimes!</h2>
                            <p>Explore the latest movies, showtimes, and entertainment news. Stay updated and discover your next favorite movie!</p>
                        </div>

                        <div className="news-section">
                            <News />
                        </div>
                    </section>

                    <aside className="sidebar">
                        <h2>Trending Now</h2>
                        <div className="random-movie-container">
                            <RandomMovie />
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
}

export default Home;