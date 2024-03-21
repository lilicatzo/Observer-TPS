import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [expanded, setExpanded] = useState(false);

    const closeNav = () => setExpanded(false);

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" expanded={expanded} style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
            <Navbar.Brand as={Link} to="/" onClick={closeNav}>Observer TPS</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(!expanded)} />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/Home" onClick={closeNav}>Home</Nav.Link>
                    <Nav.Link as={Link} to="/election-data" onClick={closeNav}>Election Data</Nav.Link>
                    <Nav.Link as={Link} to="/predictions" onClick={closeNav}>Predictions</Nav.Link>
                    <Nav.Link as={Link} to="/news" onClick={closeNav}>News</Nav.Link>
                    {/* Add this new Nav.Link for Twitter API */}
                    <Nav.Link as={Link} to="/tweets" onClick={closeNav}>Tweets</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;
