import React, { useState } from 'react';
import './PredictPoints.css';

const PredictPoints = () => {
    const [formData, setFormData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]); // Initialize with zeros
    const [predPoints, setPredPoints] = useState(0)

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
            setPredPoints(data.predicted_points)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="predict-points">
            <h2 style={{textAlign:'center',marginRight:'30px'}}>Predict Points</h2>
            <form onSubmit={handleSubmit} className="input-grid">
                {Array.from({ length: 9 }, (_, i) => (
                    <label key={i}>
                        {['Assists', 'Rebounds', 'Plus/Minus', 'Minutes', 'Turnovers', 'Personal Fouls', 'Field Goal %', 'Free Throw Attempts', 'Three-Point %'][i]}:
                        <input
                            type="number"
                            step={i === 6 || i === 8 ? '0.01' : '1'}
                            value={formData[i]} // Access the value at index i
                            onChange={(e) => handleChange(e, i)} // Pass the index along with the event
                        />
                    </label>
                ))}
            <button type="submit" className='btn-pred'>Predict</button>
            </form>
            {predPoints ? <h1 style={{textAlign:'center', marginTop:'100px', marginRight:'30px'}}>Predicted Points: {predPoints}</h1> : null}
        </div>
    );
};

export default PredictPoints;
