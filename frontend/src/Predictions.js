import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Predictions.css"

export default function Predictions() {
    const [selectedPrediction, setSelectedPrediction] = useState('');

    const handlePredictionChange = (event) => {
        setSelectedPrediction(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Selected Prediction:", selectedPrediction);
    }

    return (
        <div>
            <h1>Predictions Page</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="prediction">Select a Prediction:</label>
                <select id="prediction" value={selectedPrediction} onChange={handlePredictionChange}>
                    <option value="">Select</option>
                    <option value="Prediction 1">Prediction 1</option>
                    <option value="Prediction 2">Prediction 2</option>
                    <option value="Prediction 3">Prediction 3</option>
                </select>
                <button type="submit">Predict</button>
            </form>
            <Link to="/home">Home</Link>
        </div>
    );
}