import React from 'react';
import backgroundImage from './bac.jpg';
import logo from './logo.png'; // Import the logo image

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // position: 'fixed',
        height: '100vh',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'white',
        textAlign: 'center',
      }}
    >
      {/* Add the logo image */}
      <img src={logo} alt="Logo" style={{ width: '102px', height: '119px', marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>OBSERVER TPS</h1>
      <h2 style={{ fontSize: '1.5rem' }}>Pantau hasil pemilu Indonesia disini</h2>
    </div>
  );
};

export default Home;
