import React, { useEffect, useState } from 'react';
import '../styles/news.css';

const News = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const keyword = 'hollywood, movies, tv series, entertainment';

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`https://newsapi.org/v2/everything?q=${keyword}&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`);
                const data = await response.json();
                const shuffledArticles = data.articles.sort(() => Math.random() - 0.5);
                setNewsArticles(shuffledArticles || []);
            } catch (error) {
                console.error('Error fetching news:', error);
                setNewsArticles([]);
            }
        };

        fetchNews();
    }, [keyword]);

    const nextArticle = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsArticles.length);
    };

    const prevArticle = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + newsArticles.length) % newsArticles.length);
    };

    if (newsArticles.length === 0) {
        return <p>Loading latest news...</p>;
    }

    const currentArticle = newsArticles[currentIndex];

    return (
        <div className="news-container">
            <h1 className="news-main-title">Latest Hollywood News</h1>
            <h2 className="news-title">{currentArticle.title}</h2>
            <p className="news-text">{currentArticle.description}</p>
            <a href={currentArticle.url} target="_blank" rel="noopener noreferrer">Read more</a>
            {currentArticle.urlToImage && <img src={currentArticle.urlToImage} alt={currentArticle.title} className="news-image" />}
            <div className="news-buttons">
                <button onClick={prevArticle} disabled={newsArticles.length <= 1} className="news-button">Previous</button>
                <button onClick={nextArticle} disabled={newsArticles.length <= 1} className="news-button">Next</button>
            </div>
        </div>
    );
};

export default News;