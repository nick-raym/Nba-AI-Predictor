import React, { useEffect, useState } from "react";
import { Link, Navigate, redirect, useNavigate, useParams } from "react-router-dom";
import "./PlayerPage.css";
import Seasons from "./Seasons.js";
import FantasyStatsPicker from "./FantasyStats.js";
import Loading from "./Loading.js";

export default function PlayerPage() {
    const { playerId } = useParams();
    const [player, setPlayer] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [seasonNum, setSeasonNum] = useState(0);

    useEffect(() => {
        fetch('http://localhost:5555/player-info/' + playerId)
            .then(response => response.json())
            .then(data => {
                setPlayer(data[0]);
                setSeasonNum(data[0].FROM_YEAR); // Set start year
                // console.log(data[0].FROM_YEAR)
            })
            .catch(error => {
                console.error('Error fetching player info:', error);
            });
    }, [playerId]);

    useEffect(() => {
        if (player && player.FROM_YEAR && player.TO_YEAR) {
            fetch('http://localhost:5555/player-stats/' + playerId + "/" + player.FROM_YEAR + "/" + player.TO_YEAR)
                .then(response => response.json())
                .then(data => {
                    var arraySeasons = Object.keys(data).map(key => {
                        return data[key];
                    })
                    setSeasons(arraySeasons);
                })
                .catch(error => {
                    console.error('Error fetching seasons:', error);
                });
        }
    }, [player, playerId]);

    const handleImportStats = (()=>{
        
    })

    return (
        <div>
        <div className="player-container">
            <h1>{player.DISPLAY_FIRST_LAST}</h1>
            <div className="player-info">
                <p><strong>Birthdate:</strong> {player.BIRTHDATE}</p>
                <p><strong>Country:</strong> {player.COUNTRY}</p>
                <p><strong>Height:</strong> {player.HEIGHT}</p>
                <p><strong>Weight:</strong> {player.WEIGHT}</p>
                <p><strong>Position:</strong> {player.POSITION}</p>
                <p><strong>Team:</strong> <Link to={`/team-page/${player.TEAM_ABBREVIATION}/${player.TEAM_ID}`}>{player.TEAM_NAME}</Link></p>
                <p><strong>Jersey:</strong> {player.JERSEY}</p>
                <p><strong>Seasons of Experience:</strong> {player.SEASON_EXP}</p>
                <p><strong>Last Affiliation:</strong> {player.LAST_AFFILIATION}</p>
                {/* Add more relevant player information here */}
                <Link to={`/predict-points/${playerId}/${player.DISPLAY_FIRST_LAST}`}><button onClick={handleImportStats} style={{marginTop:"50px"}}>Import Last Game Stats</button></Link>
            </div>
            <div className="fantasy-stats-container">
                <FantasyStatsPicker player_Id={playerId}/>
            </div>
            
        </div>
        
        <div className="seasons" style={{marginBottom:"50px"}}>
                {/* Pass start year as prop to Seasons component */}
                {seasons.map((season, index) => (
                    <Seasons key={index} season={season} startDate={seasonNum + index} />
                ))}
                
        </div>
        {!seasons.length>0?<Loading/>:null}
        </div>
    );
}
