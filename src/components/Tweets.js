import React, { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const Tweets = () => {
  const [tweetUrls, setTweetUrls] = useState([
    "https://twitter.com/Mdy_Asmara1701/status/1770653112573063212",
    "https://twitter.com/ZAEffendy/status/1770471023886151906",
    "https://twitter.com/dhemit_is_back/status/1770650429967544703",
    "https://twitter.com/dekade_08/status/1770728922881073223",
    "https://twitter.com/hani_titik/status/1769664069680992546",
    "https://twitter.com/catchmeupid/status/1770656685641916675",
    "https://twitter.com/Chynthia_K/status/1770690509855682792",
    "https://twitter.com/ommi_siregar/status/1770366095142310106",
    "https://twitter.com/Boediantar4/status/1768159096874901524",
    "https://twitter.com/C4k_D3pp/status/1770702110050386428",
    "https://twitter.com/abu_waras/status/1769992336443138351",
    "https://twitter.com/tijabar/status/1768563444771672227",
    "https://twitter.com/dhemit_is_back/status/1770514888915554433",
    "https://twitter.com/akupadi5/status/1770716496328827295",
    "https://twitter.com/Malika6027/status/1768892631713825001"
  ]);
  const [hasMore, setHasMore] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollButtonRef = useRef(null);

  const fetchMoreData = () => {
    // Simulating an API call to fetch more tweets
    setTimeout(() => {
      const newTweets = [
        "https://twitter.com/new_tweet_1",
        "https://twitter.com/new_tweet_2",
        "https://twitter.com/new_tweet_3",
        "https://twitter.com/new_tweet_4"
      ];
      setTweetUrls([...tweetUrls, ...newTweets]);
      setHasMore(false); // In a real scenario, you should set this based on whether there are more tweets to fetch
    }, 1500);
  };

  const handleScroll = () => {
    setIsScrolling(true);
    if (window.scrollY === 0) {
      setIsScrolling(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    script.setAttribute('async', true);
    document.head.appendChild(script);

    window.addEventListener('scroll', handleScroll);

    return () => {
      document.head.removeChild(script);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="container">
      <InfiniteScroll
        dataLength={tweetUrls.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more tweets to show.</p>}
      >
        <div className="row">
          {tweetUrls.map((tweetUrl, index) => (
            <div key={index} className="col-md-6 mb-3">
              <blockquote className="twitter-tweet">
                <a href={tweetUrl}></a>
              </blockquote>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {isScrolling && (
        <button
          ref={scrollButtonRef}
          className="btn btn-dark btn-floating"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          <span style={{ transform: 'rotate(180deg)' }}>▲</span>
        </button>
      )}
    </div>
  );
};

export default Tweets;
    