import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Header from './components/Header.js';
import Home from './pages/Home.js';
import Group from './pages/Group.js';
import Auth from './pages/Auth.js';
import ErrorPage from "./pages/ErrorPage.js";
import Footer from "./components/Footer.js";

export default function App() {
    return (
        <Router>
            <div className="app">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/group" element={<Group />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/signup" element={<Auth />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}