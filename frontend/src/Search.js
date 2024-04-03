import { useEffect, useState } from "react";
import './Search.css'

export default function Search() {
    const [players, setPlayers] = useState([]);
    const [playerSearch, setPlayerSearch] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5555/players')
            .then(response => response.json())
            .then(data => {
                setPlayers(data);
                setFilteredPlayers(data.slice(0, 10));
            })
            .catch(error => {
                console.error('Error fetching players:', error);
            });
        
    }, []);
    

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase(); 
        setPlayerSearch(searchTerm);
        
        const filtered = players.filter(player => player.full_name.toLowerCase().includes(searchTerm));
        setFilteredPlayers(filtered.slice(0, 10));}
    

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search players..."
                value={playerSearch}
                onChange={handleSearch}
                className="search-bar"
            />
            <ul className="search-results">
                {filteredPlayers.map(player => (
                    <li key={player.id}>{player.full_name}</li>
                ))}
            </ul>
        </div>
    );
}
