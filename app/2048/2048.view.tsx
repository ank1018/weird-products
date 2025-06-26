// app/2048/2048.view.tsx
"use client";
import React, { useState } from 'react';
import NavBarView from '../nav-bar/nav-bar.view';
import GoogleAd from '../google-ads/google-ads.view';
import Footer from '../footer/footer.view';
import GameBoard from './components/game-board.view';
import './styles/2048.css';
import GameHeader from './components/game-header.view';
import GameControls from './components/game-controls.view';
import GameOver from './components/game-over.view';
import { GameProvider } from './context/game-context';
import { HelpCircle } from 'lucide-react';
import HowToPlay from './components/how-to-play.view';

const Game2048: React.FC = () => {
    const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

    return (
        <GameProvider>
            <NavBarView />
            <div className="game-2048-container">
                <div className="game-2048-content">
                    <GameHeader />
                    <GameBoard isModalOpen={isHowToPlayOpen} />
                    <GameControls />
                    <GameOver />
                </div>
                <button
                    className="how-to-play-cta"
                    onClick={() => setIsHowToPlayOpen(true)}
                    aria-label="How to Play"
                >
                    <HelpCircle size={20} />
                    How to Play
                </button>

                <HowToPlay
                    isOpen={isHowToPlayOpen}
                    onClose={() => setIsHowToPlayOpen(false)}
                />
                <GoogleAd slot={"4077644091"} className="ad-bottom" />
                <Footer />
            </div>
        </GameProvider>
    );
};

export default Game2048;