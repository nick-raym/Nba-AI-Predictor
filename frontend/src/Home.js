import React from "react"
import "./Home.css"
export default function Home() {
    return (
        <div className="container">
            <header className="header">
                <h1>Welcome to our Home Page</h1>
            </header>

            <div className="main-content">
                <section className="section">
                    <h2>About Us</h2>
                    <p>NBA PREDICTIONS</p>
                </section>

                <section className="section">
                    <h2>Our Services</h2>
                    <p>NBA PREDICTIONS</p>
                </section>

                <section className="section">
                    <h2>Contact Us</h2>
                    <p>Nlhrayman@gmail.com</p>
                </section>
            </div>

            <footer className="footer">
                <p>&copy; 2024 Home Page. All rights reserved.</p>
            </footer>
        </div>
    )
}