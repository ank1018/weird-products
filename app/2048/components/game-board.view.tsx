import React, { useEffect, useRef } from 'react';
import { useGameContext } from '../context/game-context';

interface GameBoardProps {
    isModalOpen: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ isModalOpen }) => {
    const { board, moveTiles, gameOver } = useGameContext();
    const boardRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const minSwipeDistance = 50;
    const isSwiping = useRef(false);
    const lastSwipeTime = useRef(0);
    const SWIPE_COOLDOWN = 300; // 300ms cooldown between swipes

    useEffect(() => {
        const board = boardRef.current;
        if (!board) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (gameOver || isModalOpen || isSwiping.current) {
                e.preventDefault();
                return;
            }
            const touch = e.touches[0];
            touchStartX.current = touch.clientX;
            touchStartY.current = touch.clientY;
            isSwiping.current = true;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isSwiping.current) {
                e.preventDefault();
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!isSwiping.current || gameOver || isModalOpen) {
                isSwiping.current = false;
                return;
            }

            const now = Date.now();
            if (now - lastSwipeTime.current < SWIPE_COOLDOWN) {
                isSwiping.current = false;
                return;
            }

            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;

            const deltaX = touchEndX - touchStartX.current;
            const deltaY = touchEndY - touchStartY.current;

            // Calculate the absolute distances
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);

            // Check if swipe distance is sufficient
            if (Math.max(absDeltaX, absDeltaY) < minSwipeDistance) {
                isSwiping.current = false;
                return; // Swipe too short
            }

            // Determine direction based on the larger movement
            if (absDeltaX > absDeltaY) {
                // Horizontal swipe
                if (deltaX > 0) {
                    moveTiles('right');
                } else {
                    moveTiles('left');
                }
            } else {
                // Vertical swipe
                if (deltaY > 0) {
                    moveTiles('down');
                } else {
                    moveTiles('up');
                }
            }

            lastSwipeTime.current = now;
            isSwiping.current = false;
        };

        const handleTouchCancel = () => {
            isSwiping.current = false;
        };

        board.addEventListener('touchstart', handleTouchStart, { passive: false });
        board.addEventListener('touchmove', handleTouchMove, { passive: false });
        board.addEventListener('touchend', handleTouchEnd, { passive: false });
        board.addEventListener('touchcancel', handleTouchCancel, { passive: true });

        return () => {
            board.removeEventListener('touchstart', handleTouchStart);
            board.removeEventListener('touchmove', handleTouchMove);
            board.removeEventListener('touchend', handleTouchEnd);
            board.removeEventListener('touchcancel', handleTouchCancel);
        };
    }, [moveTiles, gameOver, isModalOpen]);

    return (
        <div
            className="game-board"
            ref={boardRef}
            style={{
                touchAction: isModalOpen ? 'auto' : 'none',
                pointerEvents: isModalOpen ? 'none' : 'auto'
            }}
        >
            {board.map((row, i) => (
                <div key={i} className="board-row">
                    {row.map((tile) => (
                        <div
                            key={tile.id}
                            className={`tile tile-${tile.value} ${tile.merged ? 'merged' : ''} ${tile.new ? 'new' : ''}`}
                        >
                            <div className="tile-content">
                                {tile.value !== 0 && tile.value}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GameBoard;
