import React, { useEffect, useState } from 'react';
import TeamSearch from './TeamSearch'; // Assuming TeamSearch is a component for searching teams
import "./FantasyStats.css"

const FantasyStatsPicker = ({ player_Id }) => {
    const [selectedOption, setSelectedOption] = useState('OVERALL');
    const [fantasyStats, setFantasyStats] = useState([])

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        fetch('http://localhost:5555/player-fantasy-info/' + player_Id)
            .then(response => response.json())
            .then(data => {
                setFantasyStats(data)
                console.log(data)
            })
    }, [player_Id])

    return (
        <div>
            <h2 style={{marginLeft:"60px", marginBottom:"30px"}}>Current Season Stats</h2>
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
                {selectedOption === 'VS OPPONENT' && <TeamSearch page={false} />}
                {selectedOption === 'OVERALL' &&
                    <div>
                        {typeof fantasyStats['Overall'] === 'object' && Object.keys(fantasyStats['Overall']).length > 0 ?
                            <div className='overall-stats'>
                                <p style={{ marginLeft: "80px", marginTop: "20px", marginBottom: "25px" }}>Stats From: {fantasyStats['Overall'][0].GROUP_VALUE} Season</p>
                                <div style={{ display: "flex", justifyContent: "space-between",padding:"0px 25px" }}>
                                    <div>
                                        <p>PTS: {Math.round(fantasyStats['Overall'][0].PTS)}</p>
                                        <p>AST: {Math.round(fantasyStats['Overall'][0].AST)}</p>
                                        <p>REB: {Math.round(fantasyStats['Overall'][0].REB)}</p>
                                        <p>BLKS: {Math.round(fantasyStats['Overall'][0].BLK)}</p>
                                        <p>STL: {Math.round(fantasyStats['Overall'][0].STL)}</p>
                                        <p>GP: {Math.round(fantasyStats['Overall'][0].GP)}</p>
                                        <p>TOV: {Math.round(fantasyStats['Overall'][0].TOV)}</p>
                                    </div>
                                    <div className='side-items'>
                                        <p>WINS: {Math.round(fantasyStats['Overall'][0].W)}</p>
                                        <p>LOSSES: {Math.round(fantasyStats['Overall'][0].L)}</p>
                                        <p>+/-: {Math.round(fantasyStats['Overall'][0].PLUS_MINUS)}</p>
                                        <p>FG %: {(fantasyStats['Overall'][0].FG_PCT * 100).toFixed(2)}</p>
                                        <p>FG3 %: {(fantasyStats['Overall'][0].FG3_PCT * 100).toFixed(2)}</p>
                                        <p>MIN: {(fantasyStats['Overall'][0].MIN).toFixed(2)}</p>
                                        <p>FT %: {(fantasyStats['Overall'][0].FT_PCT * 100).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                                <br></br>
                                <span style={{ textAlign: "center", marginLeft: "150px" }}><strong>N/A</strong></span>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
};

export default FantasyStatsPicker;
