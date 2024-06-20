import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = 6;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptcha(result);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful");
        localStorage.setItem("isLoggedIn", "true"); // Set isLoggedIn flag to true
        localStorage.setItem("userName", username);
        localStorage.setItem("userId", data.userId);
        navigate("/predictions");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Login failed due to server error.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/signup");
  };

  useState(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>CAPTCHA:</label>
        <div className="captcha">
          <div>{captcha}</div>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?
        <button onClick={handleRegisterRedirect}>
          Register
        </button>
      </p>

    </div>
  );
}

export default Login;
