import React, { useState } from 'react';
import TeamSearch from './TeamSearch'; // Assuming TeamSearch is a component for searching teams

const FantasyStatsPicker = () => {
    const [selectedOption, setSelectedOption] = useState('OVERALL');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div>
            <h2>Select Fantasy Stats</h2>
            <div>
                <label>
                    <input
                        type="radio"
                        value="OVERALL"
                        checked={selectedOption === 'OVERALL'}
                        onChange={handleOptionChange}
                    />
                    OVERALL
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="radio"
                        value="VS OPPONENT"
                        checked={selectedOption === 'VS OPPONENT'}
                        onChange={handleOptionChange}
                    />
                    VS OPPONENT
                </label>
                {selectedOption === 'VS OPPONENT' && <TeamSearch page={false}/>}
            </div>
        </div>
    );
};

export default FantasyStatsPicker;
