import React from 'react';
import './About.css';
import qr from "./Assets/frame.png"

const About = () => {
    return (
        <div className="about-section">
            <h2>About</h2>
            <p>
                Welcome to the NBA Prediction Website! This website aims to provide accurate predictions for NBA player performance based on various statistics such as assists, rebounds, plus/minus, minutes played, turnovers, personal fouls, field goal percentage, free throw attempts, and three-point percentage. Whether you're a fantasy basketball enthusiast or just curious about player performance, our prediction tool can help you make informed decisions.
            </p>
            <p>
                Feel free to reach out to me with any questions, feedback, or collaboration opportunities. You can contact me via email at <a href="mailto:Nlhrayman@gmail.com">Nlhrayman@gmail.com</a> or connect with me on GitHub: <a href="https://github.com/nick-raym">Nick_raym</a>.
            </p>
            <img src={qr} style={{height:'220px',width:'180px',marginLeft:'43%',marginTop:'3%'}}/>
        </div>
    );
};

export default About;
