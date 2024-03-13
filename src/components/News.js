import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const News = () => {
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://newsapi.org/v2/everything', {
                    params: {
                        q: 'Pilpres Indonesia',
                        sortBy: 'publishedAt',
                        page: page,
                        apiKey: '61bd1dca695c469aaf72ff22a357e87c',
                    },
                });
                setNews((prevNews) => [...prevNews, ...response.data.articles]);
                setHasMore(response.data.articles.length > 0);
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
                setPage((prevPage) => prevPage + 1);
            }
        };

        observer.current = new IntersectionObserver(handleObserver, options);
        if (observer.current && !loading) {
            observer.current.observe(document.querySelector('#observerElement'));
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [loading, hasMore]);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Latest News about Presidential Vote in Indonesia</h1>
            <div className="row">
                {news.map((article, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={article.urlToImage} className="card-img-top" alt={article.title} />
                            <div className="card-body">
                                <h5 className="card-title">{article.title}</h5>
                                <p className="card-text">{article.description}</p>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Read more</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div id="observerElement" style={{ height: '10px', visibility: 'hidden' }}></div>
            {loading && <p className="text-center">Loading...</p>}
        </div>
    );
};

export default News;
