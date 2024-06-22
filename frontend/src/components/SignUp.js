import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './style/SignUp.css'; 

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName, username }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registration Success:", result);
        setMessage("Registration successful. Redirecting to login...");
        navigate("/login"); // Redirect to Predictions after successful registration
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed due to server error.");
    }
  };

  return (
    <>
      <div className="signup-container" style={{ width: "800px", margin: "0 auto" }}>
        <h2>Sign Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: "100%" }} // Set the width to 100%
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ width: "100%" }} // Set the width to 100%
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%" }} // Set the width to 100%
          />

          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%" }} // Set the width to 100%
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }} // Set the width to 100%
          />

          <Button variant="primary" type="submit" block>
            Sign Up
          </Button>
          <p>Or do you have an account? Please login:</p>
          <Button variant="link" onClick={() => navigate("/login")} block>
            Login
          </Button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
