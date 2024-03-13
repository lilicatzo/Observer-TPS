import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Predictions from './components/Predictions';
import ElectionData from './components/ElectionData';
import News from './components/News'; // Import the News component

function App() {
    return (
        <Router>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/predictions" element={<Predictions />} />
                    <Route path="/election-data" element={<ElectionData />} />
                    <Route path="/news" element={<News />} /> {/* Add the Route for News */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
