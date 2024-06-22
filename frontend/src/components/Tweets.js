import React, { useState, useEffect, useRef, useCallback } from 'react';
import { XEmbed } from 'react-social-media-embed';

const Tweets = () => {
  const allTweetUrls = [
    "https://twitter.com/BradHarizz/status/1772337689980977675",
    "https://x.com/wu223r20n3/status/1798618558332874763",
    "https://x.com/_rakyatmerdeka/status/1787693845934690517",
    "https://twitter.com/dhemit_is_back/status/1770650429967544703",
    "https://twitter.com/dekade_08/status/1770728922881073223",
    "https://twitter.com/hani_titik/status/1769664069680992546",
    "https://twitter.com/catchmeupid/status/1770656685641916675",
    "https://twitter.com/Boediantar4/status/1768159096874901524",
    "https://twitter.com/C4k_D3pp/status/1770702110050386428",
    "https://twitter.com/abu_waras/status/1769992336443138351",
    "https://twitter.com/tijabar/status/1768563444771672227",
    "https://twitter.com/dhemit_is_back/status/1770514888915554433",
    "https://twitter.com/akupadi5/status/1770716496328827295",
    "https://twitter.com/Malika6027/status/1768892631713825001",
    "https://x.com/ariel_heryanto/status/1649319133023174656",
  ];
  
  const [tweets, setTweets] = useState(allTweetUrls);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollButtonRef = useRef(null);

  const handleScroll = useCallback(() => {
    setIsScrolling(window.scrollY > 0);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.head.appendChild(script);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (loadingIndex < tweets.length) {
      // Load the script for the next tweet
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.head.appendChild(script);

      setLoadingIndex(prevIndex => prevIndex + 1);
    }
  }, [tweets, loadingIndex]);

  return (
    <div className="container" style={{ marginTop: "80px" }}>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {tweets.slice(0, loadingIndex).map((tweetUrl, index) => (
          <div key={tweetUrl} className="col"> 
            <div className="card shadow">
              <XEmbed url={tweetUrl} />
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

export default React.memo(Tweets);
