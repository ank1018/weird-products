import React, { createContext, useContext, useState } from 'react';
import { useGame } from '../hooks/use-game';

interface Tile {
    value: number;
    id: string;
    merged?: boolean;
    new?: boolean;
}

interface GameContextType {
    board: Tile[][];
    score: number;
    highScore: number;
    gameOver: boolean;
    moveTiles: (direction: 'up' | 'down' | 'left' | 'right') => void;
    initializeBoard: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [board, setBoard] = useState<Tile[][]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const gameState = useGame();
    return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
}; 