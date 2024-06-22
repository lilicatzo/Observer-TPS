import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';

const InstagramPosts = () => {
  const postUrls = [
    "https://www.instagram.com/p/C48Pp5uvtFK/",
    "https://www.instagram.com/p/C4zByjkrY54/",
    "https://www.instagram.com/p/C45CYQWsSkV/",
    "https://www.instagram.com/p/C49cxTwLcym/",
    "https://www.instagram.com/p/C47kqtqLg2B/",
    "https://www.instagram.com/p/C4ymR9gooVu/",
    "https://www.instagram.com/p/C4vb73gvio6/",
    "https://www.instagram.com/p/C49ZhjRo4kJ/",
    "https://www.instagram.com/p/C4zInLKRsyv/",
    "https://www.instagram.com/p/C4vXjHHvVHX/",
    "https://www.instagram.com/p/C4-_9PuJdlJ/"
  ];

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollButtonRef = useRef(null);

  const handleScroll = useCallback(() => {
    setIsScrolling(window.scrollY > 0);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="container" style={{ marginTop: "80px" }}>
      <div className="row">
        {postUrls.map((url, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <InstagramEmbed url={url} maxWidth={110} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {isScrolling && (
        <button
          ref={scrollButtonRef}
          className="btn btn-light btn-floating"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            color: 'black', // Adjust the arrow color
          }}
        >
          <span style={{ fontSize: '20px' }}>⬆️</span>
        </button>
      )}
    </div>
  );
};

export default InstagramPosts;
