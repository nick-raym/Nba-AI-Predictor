import React from 'react';
import { Link } from 'react-router-dom'; 
import "./Navbar.css"


export default function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/account" className="nav-link">Account</Link>
                </li>
                <li className="nav-item">
                    <Link to="/predictions" className="nav-link">Predictions</Link>
                </li>
                <li className="nav-item">
                    <Link to="/home" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/about" className="nav-link">About</Link>
                </li>
            </ul>
        </nav>
    )
}