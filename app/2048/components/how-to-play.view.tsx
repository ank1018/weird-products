import React, { useEffect } from 'react';
import { X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';

interface HowToPlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const HowToPlay: React.FC<HowToPlayProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <div
            className="how-to-play-modal"
            onTouchMove={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
        >
            <style>{`
                .how-to-play-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease-out;
                    touch-action: pan-y;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }

                .how-to-play-content {
                    background: #faf8ef;
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    animation: slideIn 0.3s ease-out;
                    touch-action: pan-y;
                    -webkit-overflow-scrolling: touch;
                }

                .close-button {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: none;
                    border: none;
                    color: #776e65;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .close-button:hover {
                    background: rgba(119, 110, 101, 0.1);
                    transform: rotate(90deg);
                }

                .how-to-play-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                    padding-right: 40px;
                }

                .how-to-play-header h2 {
                    color: #776e65;
                    margin: 0;
                    font-size: 24px;
                }

                .instruction-card {
                    background: white;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 16px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .instruction-card h3 {
                    color: #776e65;
                    margin: 0 0 12px 0;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .instruction-card p {
                    color: #776e65;
                    margin: 0;
                    line-height: 1.5;
                }

                .controls-demo {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                    margin: 16px 0;
                    justify-items: center;
                }

                .control-key {
                    background: #eee4da;
                    border: 2px solid #bbada0;
                    border-radius: 6px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #776e65;
                    font-weight: bold;
                }

                .example-tiles {
                    display: flex;
                    gap: 8px;
                    margin: 16px 0;
                }

                .example-tile {
                    width: 60px;
                    height: 60px;
                    background: #eee4da;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: #776e65;
                }

                .example-tile.merged {
                    background: #f2b179;
                    color: #f9f6f2;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideIn {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 480px) {
                    .how-to-play-content {
                        padding: 20px;
                        width: 95%;
                    }

                    .instruction-card {
                        padding: 12px;
                    }

                    .control-key {
                        width: 36px;
                        height: 36px;
                    }

                    .example-tile {
                        width: 50px;
                        height: 50px;
                    }
                }
            `}</style>

            <div className="how-to-play-content">
                <button className="close-button" onClick={onClose} aria-label="Close">
                    <X size={24} />
                </button>

                <div className="how-to-play-header">
                    <HelpCircle size={24} color="#776e65" />
                    <h2>How to Play 2048</h2>
                </div>

                <div className="instruction-card">
                    <h3>Objective</h3>
                    <p>Combine tiles with the same number to create a tile with the number 2048. Keep combining tiles until you reach 2048!</p>
                </div>

                <div className="instruction-card">
                    <h3>Controls</h3>
                    <p>Use arrow keys or swipe to move all tiles in that direction.</p>
                    <div className="controls-demo">
                        <div></div>
                        <div className="control-key"><ArrowUp size={20} /></div>
                        <div></div>
                        <div className="control-key"><ArrowLeft size={20} /></div>
                        <div className="control-key"><ArrowDown size={20} /></div>
                        <div className="control-key"><ArrowRight size={20} /></div>
                    </div>
                </div>

                <div className="instruction-card">
                    <h3>Movement</h3>
                    <p>When you move tiles, all tiles slide as far as possible in the chosen direction. A tile cannot stop in the middle of the board.</p>
                </div>

                <div className="instruction-card">
                    <h3>Merging Tiles</h3>
                    <p>When two tiles with the same number collide, they merge into one tile with the sum of their values.</p>
                    <div className="example-tiles">
                        <div className="example-tile">2</div>
                        <div className="example-tile">2</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>→</div>
                        <div className="example-tile merged">4</div>
                    </div>
                </div>

                <div className="instruction-card">
                    <h3>Scoring</h3>
                    <p>Your score increases by the value of the new tile created by merging. For example, merging two 4 tiles gives you 8 points.</p>
                </div>

                <div className="instruction-card">
                    <h3>Game Over</h3>
                    <p>The game ends when you can no longer make any moves. Try to reach 2048 before that happens!</p>
                </div>
            </div>
        </div>
    );
};

export default HowToPlay; 