import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import Footer from "../components/Footer.js";
import RandomMovie from "../components/RandomMovie.js";


// Raparperitaivas
function Home() {
  return (
      <>
        <div className="banner">
          <img
              src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="ebinBanner"
              className="banner-image"
          />
        </div>

        <main className="main-content">
          <div className="container main-grid">
            <div className="main-section">

              <div className="info-section">
                <h2>Welcome to Movie App!</h2>
                <p>Your one-stop for movie information and showtimes!</p>
                <p>Browse through the latest movies, showtimes, and more.</p>
              </div>

              <div className="action-section">
                <ul>
                  <li>
                    <p>Go to group page:</p>
                    <Link to="/group" className="button">Go to Group</Link>
                  </li>
                  <li>
                    <p>Go to your profile:</p>
                    <Link to="/login" className="button">View Profile</Link>
                  </li>
                </ul>
              </div>

              <div className="search-section">
<input></input>
              </div>
            </div>

            <aside className="sidebar">
              <RandomMovie/>
            </aside>
          </div>
          <Footer/>
        </main>
      </>
  );
}

export default Home;