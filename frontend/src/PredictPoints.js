import React, { useState, useEffect } from 'react';
import './PredictPoints.css';
import { useParams } from 'react-router-dom';

const PredictPoints = () => {
    const { playerId=null,playerName=null } = useParams();
    console.log(playerId,playerName)
    const [formData, setFormData] = useState([0, 0, 0, 0, 0, 0, 0]); // Initialize with zeros
    const [predPoints, setPredPoints] = useState(0);
    const [realPoints, setRealPoints] = useState([])

    const handleChange = (e, index) => {
        const newValue = parseFloat(e.target.value); // Parse input value to float
        const newData = [...formData]; // Create a copy of formData
        newData[index] = newValue; // Update the value at the specified index
        setFormData(newData); // Update state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log('Predicted Points:', data.predicted_points);
            setPredPoints(data.predicted_points);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if(playerId && playerName){
            fetch(`http://localhost:5555/last-game-stats/${playerId}`)
                .then(response => response.json())
                .then(data => {
                    setFormData(data['features']);
                    setRealPoints(data['pts'])
                });}
    }, [playerId]);

    return (
        <div className="predict-points">
            <h2>Predict Points</h2>
            <form onSubmit={handleSubmit} className="input-grid">
                {Array.from({ length: 7 }, (_, i) => (
                    <label key={i}>
                        {['Assists', 'Rebounds', 'Plus/Minus', 'Minutes', 'Turnovers', 'Personal Fouls', 'Free Throw Attempts'][i]}:
                        <input
                            type="number"
                            step={i === 6 ? '0.01' : '1'}
                            value={formData[i]} // Access the value at index i
                            onChange={(e) => handleChange(e, i)} // Pass the index along with the event
                        />
                    </label>
                ))}
                <button type="submit" className='btn-pred'>Predict</button>
            </form>
            {predPoints ? <div className="predicted-points">Predicted Points: {predPoints}</div> : null}
            {realPoints && playerName && playerId? <h1 classname='real-points'>Last game pts {playerName}: {realPoints} PTS</h1>:null}
        </div>
    );
};

export default PredictPoints;
