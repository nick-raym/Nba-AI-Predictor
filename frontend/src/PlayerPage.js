import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PlayerPage.css";
import Seasons from "./Seasons";

export default function PlayerPage() {
    // Accessing the player ID from the URL
    const { playerId } = useParams();
    const [player, setPlayer] = useState([]);
    const [seasons, setSeasons] = useState([]);

    // Use the player ID to fetch player data
    useEffect(() => {
        fetch('http://localhost:5555/player-info' + "/" + playerId)
            .then(response => response.json())
            .then(data => {
                setPlayer(data[0]);
            })
            .catch(error => {
                console.error('Error fetching player info:', error);
            });
    }, [playerId,]);

    // Use the player's start and end years to fetch seasons data
    useEffect(() => {
        // Check if player is not empty and has FROM_YEAR and TO_YEAR properties
        if (player && player.FROM_YEAR && player.TO_YEAR) {
            fetch('http://localhost:5555/player-stats' + "/" + playerId + "/" + player.FROM_YEAR + "/" + player.TO_YEAR)
                .then(response => response.json())
                .then(data => {
                    var arraySeasons = Object.keys(data).map(key => {
                        return data[key];
                    })
                    console.log(arraySeasons)
                    setSeasons(arraySeasons);
                })
                .catch(error => {
                    console.error('Error fetching seasons:', error);
                });
        }
    }, [player,playerId]);

    

    return (
        <div className="player-container">
            <h1>{player.DISPLAY_FIRST_LAST}</h1>
            <div className="player-info">
                <p><strong>Birthdate:</strong> {player.BIRTHDATE}</p>
                <p><strong>Country:</strong> {player.COUNTRY}</p>
                <p><strong>Height:</strong> {player.HEIGHT}</p>
                <p><strong>Weight:</strong> {player.WEIGHT}</p>
                <p><strong>Position:</strong> {player.POSITION}</p>
                <p><strong>Team:</strong> {player.TEAM_NAME}</p>
                <p><strong>Jersey:</strong> {player.JERSEY}</p>
                <p><strong>Seasons of Experience:</strong> {player.SEASON_EXP}</p>
                <p><strong>Last Affiliation:</strong> {player.LAST_AFFILIATION}</p>
                {/* Add more relevant player information here */}
            </div>
            <div className="seasons">
                {/* {seasons.map((season)=>{<Seasons season={season}/>})} */}
            </div>
        </div>
    );
}
