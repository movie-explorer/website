import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import MovieShowtimes from './pages/Showtimes'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <nav>
          <Link to="/">Home</Link> | <Link to="/showtimes">Showtimes</Link>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/showtimes" element={<MovieShowtimes />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
