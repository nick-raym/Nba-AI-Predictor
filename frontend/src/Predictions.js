import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Predictions.css"
import Search from './Search';
import TeamSearch from './TeamSearch';

export default function Predictions() {
    const [selectedPrediction, setSelectedPrediction] = useState('');
    const [selected2ndPlayerPrediction, setSelected2ndPlayerPrediction] = useState('');
    const [predictionPlayer, setPredictionPlayer] = useState(null);

    const handlePredictionChange = (event) => {
        setSelectedPrediction(event.target.value);
        console.log("Selected Prediction:", event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Selected Prediction:", selectedPrediction);
    }

    const handleChangePlayer = () => {
        setPredictionPlayer(null); // Reset prediction player when changing
        // setSelectedPrediction(null)
    }

    const handleSecondPrediction = (event) => {
        setSelected2ndPlayerPrediction(event.target.value);
    }

    return (
        <div>
            <h1>Predictions Page</h1>
            <form onSubmit={handleSubmit} style={{textAlign:'center'}}>
                <label htmlFor="prediction">Select a Prediction:</label>
                <select id="prediction" value={selectedPrediction} onChange={handlePredictionChange}>
                    <option value="">Select</option>
                    <option value="Prediction 1">Player Prediction</option>
                    <option value="Prediction 2">Team Prediction</option>
                    <option value="Prediction 3">Season Prediction</option>
                </select>

                {selectedPrediction === "Prediction 1" && !predictionPlayer ? (
                    <Search page={false} predictionPlayer={predictionPlayer} setPredictionPlayer={setPredictionPlayer} />
                ) : null 
                }

                {predictionPlayer && selectedPrediction === "Prediction 1"? (
                    <div>
                        <h1>Chosen Player: {predictionPlayer.full_name}</h1>
                        <button onClick={handleChangePlayer}>Change Player</button>
                    </div>
                ) : null}

                {predictionPlayer && selectedPrediction === "Prediction 1" ? (
                    <select id="second-prediction" style={{ marginTop: "15px" }} value={selected2ndPlayerPrediction} onChange={handleSecondPrediction}>
                        <option value="">Select</option>
                        <option value="Prediction 1">Predict Avg Stats Vs Team</option>
                        <option value="Prediction 2">Predict ...</option>
                        <option value="Prediction 3">Predict ...</option>
                    </select>
                ) : null}
                {selected2ndPlayerPrediction && selectedPrediction === "Prediction 1" ? <TeamSearch page={false} /> : null}
            </form>
            <Link to="/home">Home</Link>
        </div>
    );
}
