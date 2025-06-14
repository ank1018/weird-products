import { useState, useEffect, useCallback } from 'react';

interface Tile {
    value: number;
    id: string;
    merged?: boolean;
    new?: boolean;
}

const BoardSize = 4;

// UUID generator function
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const useGame = () => {
    const [board, setBoard] = useState<Tile[][]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const addRandomTile = useCallback((currentBoard: Tile[][]) => {
        const emptyTiles: { i: number; j: number }[] = [];
        currentBoard.forEach((row, i) => {
            row.forEach((tile, j) => {
                if (tile.value === 0) {
                    emptyTiles.push({ i, j });
                }
            });
        });

        if (emptyTiles.length > 0) {
            const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            currentBoard[i][j] = {
                value,
                id: generateUUID(),
                new: true
            };
        }
    }, []);

    const initializeBoard = useCallback(() => {
        const newBoard = Array(BoardSize)
            .fill(null)
            .map(() =>
                Array(BoardSize)
                    .fill(null)
                    .map(() => ({
                        value: 0,
                        id: generateUUID(),
                    }))
            );

        // Add two initial tiles
        addRandomTile(newBoard);
        addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
    }, [addRandomTile]);

    const checkGameOver = useCallback((currentBoard: Tile[][]) => {
        // Check for empty tiles
        for (let i = 0; i < BoardSize; i++) {
            for (let j = 0; j < BoardSize; j++) {
                if (currentBoard[i][j].value === 0) return false;
            }
        }

        // Check for possible merges
        for (let i = 0; i < BoardSize; i++) {
            for (let j = 0; j < BoardSize; j++) {
                const current = currentBoard[i][j].value;
                if (
                    (i < BoardSize - 1 && current === currentBoard[i + 1][j].value) ||
                    (j < BoardSize - 1 && current === currentBoard[i][j + 1].value)
                ) {
                    return false;
                }
            }
        }
        return true;
    }, []);

    const boardsEqual = (board1: Tile[][], board2: Tile[][]) => {
        for (let i = 0; i < BoardSize; i++) {
            for (let j = 0; j < BoardSize; j++) {
                if (board1[i][j].value !== board2[i][j].value) {
                    return false;
                }
            }
        }
        return true;
    };

    const moveTiles = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver) return;

        const newBoard: Tile[][] = board.map(row => row.map(tile => ({ ...tile })));
        let newScore = score;

        // Helper to move and merge a single line
        const processLine = (tiles: Tile[]): { line: Tile[], scoreIncrease: number } => {
            // Filter out zeros
            const nonZeroTiles = tiles.filter(tile => tile.value !== 0);
            const result: Tile[] = [];
            let scoreIncrease = 0;

            for (let i = 0; i < nonZeroTiles.length; i++) {
                if (i < nonZeroTiles.length - 1 && nonZeroTiles[i].value === nonZeroTiles[i + 1].value) {
                    // Merge tiles
                    const mergedValue = nonZeroTiles[i].value * 2;
                    result.push({
                        value: mergedValue,
                        id: generateUUID(),
                        merged: true,
                    });
                    scoreIncrease += mergedValue;
                    i++; // Skip next tile as it's merged
                } else {
                    result.push({
                        value: nonZeroTiles[i].value,
                        id: generateUUID(),
                    });
                }
            }

            // Fill remaining positions with zeros
            while (result.length < BoardSize) {
                result.push({ value: 0, id: generateUUID() });
            }

            return { line: result, scoreIncrease };
        };

        // Process board based on direction
        for (let i = 0; i < BoardSize; i++) {
            if (direction === 'left') {
                const { line, scoreIncrease } = processLine(newBoard[i]);
                newBoard[i] = line;
                newScore += scoreIncrease;
            } else if (direction === 'right') {
                const reversed = [...newBoard[i]].reverse();
                const { line, scoreIncrease } = processLine(reversed);
                newBoard[i] = line.reverse();
                newScore += scoreIncrease;
            } else if (direction === 'up') {
                const column = [];
                for (let j = 0; j < BoardSize; j++) {
                    column.push(newBoard[j][i]);
                }
                const { line, scoreIncrease } = processLine(column);
                for (let j = 0; j < BoardSize; j++) {
                    newBoard[j][i] = line[j];
                }
                newScore += scoreIncrease;
            } else if (direction === 'down') {
                const column = [];
                for (let j = 0; j < BoardSize; j++) {
                    column.push(newBoard[j][i]);
                }
                const reversed = column.reverse();
                const { line, scoreIncrease } = processLine(reversed);
                const finalLine = line.reverse();
                for (let j = 0; j < BoardSize; j++) {
                    newBoard[j][i] = finalLine[j];
                }
                newScore += scoreIncrease;
            }
        }

        // Check if board actually changed
        if (!boardsEqual(board, newBoard)) {
            addRandomTile(newBoard);
            setBoard(newBoard);
            setScore(newScore);

            if (checkGameOver(newBoard)) {
                setGameOver(true);
            }
        }
    }, [board, score, gameOver, addRandomTile, checkGameOver]);

    // Add keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver) return;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    moveTiles('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    moveTiles('down');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    moveTiles('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    moveTiles('right');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [moveTiles, gameOver]);

    useEffect(() => {
        initializeBoard();
    }, [initializeBoard]);

    return {
        board,
        score,
        gameOver,
        initializeBoard,
        moveTiles,
    };
};