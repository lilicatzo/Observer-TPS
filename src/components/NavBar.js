import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'black', backdropFilter: 'blur(10px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" style={{ color: 'white' }}>Observer TPS</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/Home" style={{ color: 'white' }}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/election-data" style={{ color: 'white' }}>Election Data</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/predictions" style={{ color: 'white' }}>Predictions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/news" style={{ color: 'white' }}>News</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
