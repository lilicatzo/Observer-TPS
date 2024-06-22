import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/Login.css";


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
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include" 
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful");
        localStorage.setItem("isLoggedIn", "true"); 
        localStorage.setItem("userName", username);
        localStorage.setItem("userId", data.userId);
        console.log(localStorage.getItem("userId"));
        //c
        localStorage.setItem("isAdmin", data.isAdmin);

        // buat handle klo account admin, langsung redirect bua liat complaints
        if (data.isAdmin) {
          navigate("/seeComplaints");
        } else {
          navigate("/predictions");
        }

      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Login failed, please try again");
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
