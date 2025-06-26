// app/2048/components/game-over.view.tsx
import React from 'react';
import { useGameContext } from '../context/game-context';

const GameOver: React.FC = () => {
    const { gameOver, initializeBoard } = useGameContext();

    if (!gameOver) return null;

    return (
        <div className="game-over">
            <h2>Game Over!</h2>
            <button onClick={initializeBoard}>Play Again</button>
        </div>
    );
};

export default GameOver;