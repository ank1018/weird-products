// app/2048/components/game-header.view.tsx
import React from 'react';
import { useGameContext } from '../context/game-context';

const GameHeader: React.FC = () => {
    const { score, initializeBoard } = useGameContext();

    return (
        <div className="game-header">
            <div className="score">Score: {score}</div>
            <h1>2048</h1>
            <button onClick={initializeBoard}>New Game</button>
        </div>
    );
};

export default GameHeader;