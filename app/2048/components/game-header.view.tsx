// app/2048/components/game-header.view.tsx
import React from 'react';
import { useGameContext } from '../context/game-context';
import { RefreshCw } from 'lucide-react';

const GameHeader: React.FC = () => {
    const { score, highScore, initializeBoard } = useGameContext();

    return (
        <div className="game-header">
            <div className="header-left">
                <h1>2048</h1>
                <button
                    className="new-game-button"
                    onClick={initializeBoard}
                    aria-label="New Game"
                >
                    <RefreshCw size={16} />
                    New Game
                </button>
            </div>

            <div className="game-scores">
                <div className="score-container">
                    <div className="score-label">SCORE</div>
                    <div className="score-value">{score}</div>
                </div>
                <div className="score-container">
                    <div className="score-label">BEST</div>
                    <div className="score-value">{highScore}</div>
                </div>
            </div>
        </div>
    );
};

export default GameHeader;