import React, { useEffect, useState } from "react";
import './Search.css';
import { Link } from "react-router-dom";

export default function TeamSearch({ page = true, predictionTeam, setPredictionTeam }) {
    const [teams, setTeams] = useState([]);
    const [teamSearch, setTeamSearch] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5555/teams')
            .then(response => response.json())
            .then(data => {
                setTeams(data);
                setFilteredTeams(data.slice(0, 10));
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
            });

    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setTeamSearch(searchTerm);

        const filtered = teams.filter(team => team.full_name.toLowerCase().includes(searchTerm));
        setFilteredTeams(filtered.slice(0, 10));
    }

    const handleTeamPrediction = (team) => {
        setPredictionTeam(team);
        console.log(team);
    }

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search teams..."
                value={teamSearch}
                onChange={handleSearch}
                className="search-bar"
            />
            <ul className="search-results">
                {page ? filteredTeams.map(team => (
                    <Link to={`/team-page/${team.abbreviation}/${team.id}`} key={team.id}>
                        <li>{team.full_name}</li>
                    </Link>
                ))
                :
                filteredTeams.map(team => (
                    <li key={team.id} onClick={() => handleTeamPrediction(team)}>{team.full_name}</li>
                ))}
            </ul>
        </div>
    );
}
