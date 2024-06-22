import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './style/News.css'; 
import { Button } from 'react-bootstrap'; 

const News = () => {
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const observer = useRef();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://newsapi.org/v2/everything', {
                    params: {
                        q: 'Prabowo OR Gibran OR Anies OR Jokowi OR Ganjar OR Mahfud',
                        pageSize: 10,
                        page: page,
                        apiKey: '127e7aff54134a81a97d3993fbe05ba1',
                        language: 'en'
                    },
                });

                const filteredArticles = response.data.articles.filter(article => article.urlToImage);
                setNews(prevNews => [...prevNews, ...filteredArticles]);
                setHasMore(filteredArticles.length > 0);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching news:', error);
                setLoading(false);
            }
        };

        fetchNews();
    }, [page]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0,
        };

        const handleObserver = (entries) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !loading) {
                setPage(prevPage => prevPage + 1);
            }
        };

        observer.current = new IntersectionObserver(handleObserver, options);
        const observerElement = document.querySelector('#observerElement');
        if (observerElement) {
            observer.current.observe(observerElement);
        }

        return () => {
            if (observer.current && observerElement) {
                observer.current.unobserve(observerElement);
            }
        };
    }, [loading, hasMore]);

    const handleScroll = () => {
        if (window.scrollY > 100) {
            setShowBackToTop(true);
        } else {
            setShowBackToTop(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="news-container">
            <h1 className="news-title">Latest News about Politics in Indonesia</h1>
            <div className="row">
                {news.map((article, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={article.urlToImage} className="card-img-top" alt={article.title} />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{article.title}</h5>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-auto">Read more</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div id="observerElement" style={{ height: '20px' }}></div>
            {loading && <p className="text-center">Loading...</p>}
            {!hasMore && <p className="text-center">No more news available.</p>}
            {showBackToTop && (
                <Button
                    variant="primary"
                    className="back-to-top"
                    onClick={scrollToTop}
                >
                    🔼
                </Button>
            )}
        </div>
    );
};

export default News;
