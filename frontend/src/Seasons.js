import React from "react";
import "./Seasons.css";

export default function Seasons({ season, startDate }) {
    console.log(season);

    const calculateAverages = () => {
        if (!season || season.length === 0) {
            return { averageAST: 0, averageREB: 0, averagePTS: 0 }; // Return default values if season is empty
        }

        let totalAST = 0;
        let totalREB = 0;
        let totalPTS = 0;

        season.forEach(game => {
            // Accumulate stats for each game
            totalAST += game.AST || 0;
            totalREB += game.REB || 0;
            totalPTS += game.PTS || 0;
        });

        // Calculate averages
        const averageAST = totalAST / season.length;
        const averageREB = totalREB / season.length;
        const averagePTS = totalPTS / season.length;

        return { averageAST, averageREB, averagePTS };
    };

    const { averageAST, averageREB, averagePTS } = calculateAverages();

    return (
        <div className="seasons-div">
            <h2 className="seasons-heading">Season {startDate} Averages</h2>
            <div className="seasons-stats">
                <div className="seasons-stat">
                    <h3>Assists</h3>
                    <p>{averageAST.toFixed(2)}</p>
                </div>
                <div className="seasons-stat">
                    <h3>Rebounds</h3>
                    <p>{averageREB.toFixed(2)}</p>
                </div>
                <div className="seasons-stat">
                    <h3>Points</h3>
                    <p>{averagePTS.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}
