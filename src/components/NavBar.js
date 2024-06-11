import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Import custom CSS for styling

const NavBar = () => {
    const [expanded, setExpanded] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const closeNav = () => setExpanded(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setScrolled(scrollTop > 50); // Adjust the scroll value as needed
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
                    body {
                        font-family: 'Roboto', sans-serif;
                    }
                `}
            </style>
            <Navbar
                expand="lg"
                expanded={expanded}
                className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}
                fixed="top"
            >
                <Navbar.Brand as={Link} to="/" onClick={closeNav}>Observer KPU</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(!expanded)} />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/home" onClick={closeNav}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/election-data" onClick={closeNav}>Election Data</Nav.Link>
                        <Nav.Link as={Link} to="/predictions" onClick={closeNav}>Predictions</Nav.Link>
                        <Nav.Link as={Link} to="/news" onClick={closeNav}>News</Nav.Link>
                        <Nav.Link as={Link} to="/tweets" onClick={closeNav}>Tweets</Nav.Link>
                        <Nav.Link as={Link} to="/instagram-posts" onClick={closeNav}>Instagram Posts</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};

export default NavBar;
