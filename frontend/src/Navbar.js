import React from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css";
import nba_image from './Assets/image1_0.jpg'

export default function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                <Link to="/home" className="nav-link"> <img src={nba_image} alt="Image 1" className="nav-image" /> </Link>
                </li>
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
                <li className="nav-item">
                    <Link to="/search" className="nav-link">Search</Link>
                </li>
                <li className="nav-item">
                    <Link to="/team-search" className="nav-link">Teams</Link>
                </li>
                
                
            </ul>
        </nav>
    )
}
