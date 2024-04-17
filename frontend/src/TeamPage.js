import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TeamPage.css";
import { Link } from "react-router-dom";

export default function TeamPage() {
    const { teamAbbreviation, teamId } = useParams();
    const [YBYStats, setYBYStats] = useState([]);
    const [roster, setRoster] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5555/team-roster/${teamAbbreviation}`)
            .then(response => response.json())
            .then(data => {
                setRoster(data);
            })
            .catch(error => {
                console.error('Error fetching team roster:', error);
            });

        fetch(`http://localhost:5555/year-by-year-stats/${teamId}`)
            .then(response => response.json())
            .then(data => {
                setYBYStats(data);
            })
            .catch(error => {
                console.error('Error fetching team stats:', error);
            });

    }, [teamAbbreviation, teamId]);

    const handlePlayerClick = (playerId) => {
        setSelectedPlayer(playerId);
    }

    return (
        <div className="team-container">
            <h1>{teamAbbreviation}</h1>
            <div className="roster">
                <h2>&nbsp;Roster</h2>
                <ul>
                    {roster.map(player => (
                        <Link to={`/player-page/${player.PLAYER_ID}`} key={player.PLAYER_ID}>
                            <li
                                className={selectedPlayer === player.PLAYER_ID ? "selected" : ""}
                                onClick={() => handlePlayerClick(player.PLAYER_ID)}
                            >
                                {player.PLAYER}
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
            <div className="yearly-stats" style={{float:'right'}}>
                <h2>23'-24' Stats</h2>
                <ul>
                    {Array.isArray(YBYStats) ? (
                        YBYStats.map((yearStats) => {
                            if (yearStats.YEAR === "2023-24") {
                                return (
                                    <li key={yearStats.YEAR}>
                                        <p>Wins: {yearStats.WINS}</p>
                                        <p>Losses: {yearStats.LOSSES}</p>
                                        <p>Assists: {yearStats.AST}</p>
                                        <p>Blocks: {yearStats.BLK}</p>
                                        <p>Conference Count: {yearStats.CONF_COUNT}</p>
                                        <p>Conference Rank: {yearStats.CONF_RANK}</p>
                                        <p>Division Rank: {yearStats.DIV_RANK}</p>
                                        <p>Defensive Rebounds: {yearStats.DREB}</p>
                                        <p>Three-Point Attempts: {yearStats.FG3A}</p>
                                        <p>Three-Point Makes: {yearStats.FG3M}</p>
                                        <p>Three-Point Percentage: {yearStats.FG3_PCT}</p>
                                        <p>Field Goals Attempted: {yearStats.FGA}</p>
                                        <p>Field Goals Made: {yearStats.FGM}</p>
                                        <p>Field Goal Percentage: {yearStats.FG_PCT}</p>
                                        <p>Free Throws Attempted: {yearStats.FTA}</p>
                                        <p>Free Throws Made: {yearStats.FTM}</p>
                                        <p>Free Throw Percentage: {yearStats.FT_PCT}</p>
                                        <p>Games Played: {yearStats.GP}</p>
                                        <p>Offensive Rebounds: {yearStats.OREB}</p>
                                        <p>Personal Fouls: {yearStats.PF}</p>
                                        <p>Points: {yearStats.PTS}</p>
                                        <p>Points Rank: {yearStats.PTS_RANK}</p>
                                        <p>Total Rebounds: {yearStats.REB}</p>
                                        <p>Steals: {yearStats.STL}</p>
                                        <p>Turnovers: {yearStats.TOV}</p>
                                        <p>Win Percentage: {yearStats.WIN_PCT}</p>
                                    </li>
                                );
                            } else {
                                return null;
                            }
                        })
                    ) : (
                        <li>No yearly stats available</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
