import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.js';
import Home from './pages/Home.js';
import Group from './pages/Group.js';
import Login from './pages/Login.js';
import ErrorPage from "./pages/ErrorPage.js";
import Footer from "./components/Footer.js";
import Signup from './pages/Signup.js';
import MovieInfo from "./pages/MovieInfo.js";
import MovieShowtimes from './pages/MovieShowtime.js';
import ProfilePage from "./pages/ProfilePage.js";
import SharePage from './pages/SharePage.js'; 
import { UserProvider } from './components/UserProvider.js';
import Refresh from './components/Refresh.js'; 

function App() {
    return (
        <UserProvider>
            <Router>
                <div className="app">
                    <Refresh /> 
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/group" element={<Group />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/movieinfo" element={<MovieInfo />} />
                        <Route path="/showtimes" element={<MovieShowtimes/>} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/share-favorites" element={<SharePage />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
