import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Predictions from './components/Predictions';
import ElectionData from './components/ElectionData';
import News from './components/News';
import Tweets from './components/Tweets';
import InstagramPosts from './components/InstagramPosts';
import Login from './components/LogIn';
import SignUp from './components/SignUp';
import Chatbot from './components/Chatbot';
import AdminComplaintsPage from './components/AdminComplainPage';
import ComplaintForm from './components/complaintForm';
import { AuthProvider } from './components/AuthContext';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProtectedRoute({ isAdmin, children }) {
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin from local storage or session
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  return (
    <AuthProvider>
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/submit-complaint" element={<ComplaintForm />} />
            <Route
              path="/seeComplaints"
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <AdminComplaintsPage />
                </ProtectedRoute>
              }
            />
            {/* Optionally, redirect any other route to home page */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
