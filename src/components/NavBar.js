import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import avatar from "./images/username-icon.jpg";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedUserName && storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
          body {
            font-family: 'Roboto', sans-serif;
          }
          .username {
            color: black;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }
          .account-dropdown .dropdown-toggle {
            color: black !important;
          }
          .account-dropdown .dropdown-toggle::after {
            border-top-color: black;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          }
          .account-dropdown .dropdown-menu a {
            color: black;
          }
        `}
      </style>
      <Navbar expand="lg" className="custom-navbar" fixed="top">
        <Navbar.Brand as={Link} to="/">
          Observer KPU
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/election-data">
              Election Data
            </Nav.Link>
            <Nav.Link as={Link} to="/predictions">
              Predictions
            </Nav.Link>
            <Nav.Link as={Link} to="/news">
              News
            </Nav.Link>
            <Nav.Link as={Link} to="/tweets">
              Tweets
            </Nav.Link>
            <Nav.Link as={Link} to="/instagram-posts">
              Instagram Posts
            </Nav.Link>
            <Nav.Link as={Link} to="/chatbot">
              Chatbot
            </Nav.Link>
            {isLoggedIn ? (
              <NavDropdown
                title={<><img src={avatar} alt="avatar" width="30" height="30" /> <span className="username">{userName}</span></>}
                id="user-nav-dropdown"
                className="account-dropdown"
              >
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown
                title="Login/Register"
                id="login-register-dropdown"
                className="account-dropdown"
              >
                <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/signup">Register</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavBar;
