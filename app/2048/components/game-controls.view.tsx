import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useGameContext } from '../context/game-context';

const GameControls: React.FC = () => {
    const { moveTiles, gameOver } = useGameContext();
    const [, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => (e: React.MouseEvent) => {
        e.preventDefault();
        if (!gameOver) {
            moveTiles(direction);
        }
    };

    return (
        <div className="game-controls">
            <style>{`
                .game-controls {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    margin-top: 20px;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                }
                
                .controls-row {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                
                .control-button {
                    width: 60px;
                    height: 60px;
                    border: 2px solid #8f7a66;
                    border-radius: 6px;
                    background: #bbada0;
                    color: #f9f6f2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.1s ease;
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                }
                
                .control-button:hover {
                    background: #9c8a7a;
                }
                
                .control-button:active {
                    background: #8f7a66;
                    transform: scale(0.95);
                }
                
                .control-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .control-button:disabled:hover {
                    background: #bbada0;
                    transform: none;
                }
                
                .swipe-instruction {
                    margin-top: 20px;
                    text-align: center;
                    color: #776e65;
                    font-size: 14px;
                }

                .how-to-play-cta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 20px;
                    padding: 12px 24px;
                    background: #8f7a66;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    touch-action: manipulation;
                }

                .how-to-play-cta:hover {
                    background: #7f6a56;
                    transform: translateY(-2px);
                }

                .how-to-play-cta:active {
                    transform: translateY(0);
                }
                
                @media (max-width: 480px) {
                    .control-button {
                        width: 50px;
                        height: 50px;
                    }
                    
                    .swipe-instruction {
                        font-size: 12px;
                    }

                    .desktop-controls {
                        display: none;
                    }

                    .how-to-play-cta {
                        position: sticky;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 100;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }
                }
            `}</style>

            <div className="desktop-controls">
                <div className="controls-row">
                    <button
                        onClick={handleMove('up')}
                        className="control-button"
                        disabled={gameOver}
                        aria-label="Move up"
                    >
                        <ArrowUp size={24} />
                    </button>
                </div>
                <div className="controls-row">
                    <button
                        onClick={handleMove('left')}
                        className="control-button"
                        disabled={gameOver}
                        aria-label="Move left"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <button
                        onClick={handleMove('down')}
                        className="control-button"
                        disabled={gameOver}
                        aria-label="Move down"
                    >
                        <ArrowDown size={24} />
                    </button>
                    <button
                        onClick={handleMove('right')}
                        className="control-button"
                        disabled={gameOver}
                        aria-label="Move right"
                    >
                        <ArrowRight size={24} />
                    </button>
                </div>
            </div>

            <div className="swipe-instruction">
                <p>Use arrow keys or swipe to play</p>
                <p>↑ ↓ ← → or 👆 👇 👈 👉</p>
            </div>


        </div>
    );
};

export default GameControls;