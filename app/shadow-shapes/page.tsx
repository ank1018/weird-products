"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import './styles.css';
import NavBarView from '../nav-bar/nav-bar.view';
import GoogleAd from '../google-ads/google-ads.view';
import Footer from '../footer/footer.view';

interface Shape {
  id: number;
  type: 'circle' | 'square' | 'triangle' | 'star' | 'hexagon';
  color: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  points: number;
  size: number;
  rotation: number;
  isSpecial: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

interface DifficultySettings {
  shapeSpawnInterval: number;
  maxShapes: number;
  shapeSpeed: number;
  rotationSpeed: number;
  specialShapeChance: number;
  timeLimit: number;
}

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    shapeSpawnInterval: 2000,
    maxShapes: 5,
    shapeSpeed: 1,
    rotationSpeed: 1,
    specialShapeChance: 0.05,
    timeLimit: 90
  },
  medium: {
    shapeSpawnInterval: 1500,
    maxShapes: 6,
    shapeSpeed: 1.5,
    rotationSpeed: 2,
    specialShapeChance: 0.1,
    timeLimit: 75
  },
  hard: {
    shapeSpawnInterval: 1000,
    maxShapes: 7,
    shapeSpeed: 2,
    rotationSpeed: 3,
    specialShapeChance: 0.15,
    timeLimit: 60
  },
  extreme: {
    shapeSpawnInterval: 750,
    maxShapes: 8,
    shapeSpeed: 2.5,
    rotationSpeed: 4,
    specialShapeChance: 0.2,
    timeLimit: 45
  }
};

export default function ShadowShapesGame() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const COLORS = useMemo(() => ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9F1C', '#FF69B4'], []);
  const SHAPES = [
    { type: 'circle' as const, points: 10, size: 40 },
    { type: 'square' as const, points: 15, size: 40 },
    { type: 'triangle' as const, points: 20, size: 40 },
    { type: 'star' as const, points: 30, size: 45 },
    { type: 'hexagon' as const, points: 25, size: 45 }
  ];

  useEffect(() => {
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const settings = DIFFICULTY_SETTINGS[difficulty];
    const interval = setInterval(() => {
      const shapeType = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const isSpecial = Math.random() < settings.specialShapeChance;

      const newShape: Shape = {
        id: Date.now(),
        type: shapeType.type as Shape['type'],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        position: {
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        },
        velocity: {
          x: (Math.random() - 0.5) * settings.shapeSpeed,
          y: (Math.random() - 0.5) * settings.shapeSpeed
        },
        points: isSpecial ? shapeType.points * 2 : shapeType.points,
        size: shapeType.size,
        rotation: Math.random() * 360,
        isSpecial
      };
      setShapes(prev => [...prev, newShape].slice(-settings.maxShapes));
    }, settings.shapeSpawnInterval);

    return () => clearInterval(interval);
  }, [gameOver, difficulty]);

  useEffect(() => {
    if (gameOver) return;

    const settings = DIFFICULTY_SETTINGS[difficulty];
    const moveInterval = setInterval(() => {
      setShapes(prev => prev.map(shape => {
        const newX = shape.position.x + shape.velocity.x;
        const newY = shape.position.y + shape.velocity.y;

        if (newX <= 0 || newX >= 90) shape.velocity.x *= -1;
        if (newY <= 0 || newY >= 90) shape.velocity.y *= -1;

        return {
          ...shape,
          position: {
            x: Math.max(0, Math.min(90, newX)),
            y: Math.max(0, Math.min(90, newY))
          },
          rotation: shape.rotation + settings.rotationSpeed
        };
      }));
    }, 16);

    return () => clearInterval(moveInterval);
  }, [gameOver, difficulty]);

  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('highScore', score.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, score, highScore, difficulty]);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setShapes(prevShapes => {
        const newShapes = [...prevShapes];
        const randomIndex = Math.floor(Math.random() * newShapes.length);
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        newShapes[randomIndex] = {
          ...newShapes[randomIndex],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          type: randomShape.type
        };
        return newShapes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, COLORS, SHAPES]);

  const handleShapeClick = (shape: Shape) => {
    if (gameOver) return;

    setShapes(prev => prev.filter(s => s.id !== shape.id));
    const pointsEarned = shape.points * multiplier;
    setScore(prev => prev + pointsEarned);
    setCombo(prev => prev + 1);
    
    if (shape.isSpecial) {
      setMultiplier(prev => Math.min(prev + 0.5, 3));
    }
  };

  const resetGame = () => {
    setShapes([]);
    setScore(0);
    setTimeLeft(DIFFICULTY_SETTINGS[difficulty].timeLimit);
    setGameOver(false);
    setCombo(0);
    setMultiplier(1);
  };

  const startGame = () => {
    setShowInstructions(false);
    resetGame();
    setGameStarted(true);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    if (!showInstructions) {
      resetGame();
    }
  };

  return (
    <>
    <div className="game-container">
      <NavBarView />
      {showInstructions ? (
        <div className="instructions">
          <h2>Shape Blaster</h2>
          <div className="difficulty-selector">
            <h3>Select Difficulty:</h3>
            <div className="difficulty-buttons">
              {Object.keys(DIFFICULTY_SETTINGS).map((level) => (
                <button
                  key={level}
                  className={`difficulty-button ${difficulty === level ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange(level as Difficulty)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="instruction-list">
            <p>1. Click on moving shapes to earn points</p>
            <p>2. Different shapes have different point values</p>
            <p>3. Build combos for bonus points</p>
            <p>4. Special shapes increase your multiplier</p>
            <p>5. You have {DIFFICULTY_SETTINGS[difficulty].timeLimit} seconds to beat the high score!</p>
          </div>
          <div className="high-score">High Score: {highScore}</div>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div className="score">Score: {score}</div>
            <div className="combo">Combo: {combo}x</div>
            <div className="multiplier">Multiplier: {multiplier.toFixed(1)}x</div>
            <div className="timer">Time: {timeLeft}s</div>
            <div className="difficulty-display">Difficulty: {difficulty}</div>
            <button onClick={resetGame} className="reset-button">
              Reset
            </button>
          </div>

          <div className="game-area" ref={gameAreaRef}>
            {shapes.map(shape => (
              <div
                key={shape.id}
                className={`shape ${shape.type} ${shape.isSpecial ? 'special' : ''}`}
                style={{
                  backgroundColor: shape.color,
                  left: `${shape.position.x}%`,
                  top: `${shape.position.y}%`,
                  width: `${shape.size}px`,
                  height: `${shape.size}px`,
                  transform: `rotate(${shape.rotation}deg)`
                }}
                onClick={() => handleShapeClick(shape)}
              />
            ))}

            {gameOver && (
              <div className="game-over">
                <h2>Game Over!</h2>
                <p>Final Score: {score}</p>
                <p>Difficulty: {difficulty}</p>
                {score > highScore && <p className="new-high-score">New High Score! 🎉</p>}
                <button onClick={resetGame} className="restart-button">
                  Play Again
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
            <GoogleAd slot={"4077644091"} className="ad-bottom" />
            <Footer />
</>
  );
}