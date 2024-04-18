import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="container">
            <header className="header">
                <h1>Welcome to Nba Predictions</h1>
            </header>

            <div className="main-content">
                <section className="section">
                    <h2>About Us</h2>
                    <Link to="/about">About Page</Link>
                </section>

                <section className="section">
                    <h2>Our Services</h2>
                    <Link to="/predict-points">PTS Prediction</Link>
                </section>

                <section className="section">
                    <h2>Contact Info</h2>
                    <p>Nlhrayman@gmail.com</p>
                </section>
            </div>

            <footer className="footer">
                <p>&copy; 2024 Home Page. All rights reserved.</p>
            </footer>
        </div>
    );
}
