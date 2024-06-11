import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Predictions from "./components/Predictions";
import ElectionData from "./components/ElectionData";
import News from "./components/News";
import Tweets from "./components/Tweets";
import InstagramPosts from "./components/InstagramPosts";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp"; // Import the SignUp component
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/election-data" element={<ElectionData />} />
          <Route path="/news" element={<News />} />
          <Route path="/tweets" element={<Tweets />} />
          <Route path="/instagram-posts" element={<InstagramPosts />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
