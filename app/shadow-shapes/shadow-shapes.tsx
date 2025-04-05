"use client";
import React, { useState, useRef } from "react";
import "./shadow-shapes.css";

interface Shape {
  id: number;
  x: number;
  y: number;
  size: number;
  name: string;
  discoveryTime: number;
  transformedImage: string;
}

interface Position {
  x: number;
  y: number;
}

const shadowShapes: Shape[] = [
  {
    id: 1,
    x: 15,
    y: 20,
    size: 100,
    name: "Owl",
    discoveryTime: 0,
    transformedImage: "🦉",
  },
  {
    id: 2,
    x: 75,
    y: 25,
    size: 120,
    name: "Dragon",
    discoveryTime: 0,
    transformedImage: "🐉",
  },
  {
    id: 3,
    x: 30,
    y: 70,
    size: 90,
    name: "Rabbit",
    discoveryTime: 0,
    transformedImage: "🐇",
  },
  {
    id: 4,
    x: 60,
    y: 60,
    size: 110,
    name: "Spider",
    discoveryTime: 0,
    transformedImage: "🕷️",
  },
  {
    id: 5,
    x: 85,
    y: 85,
    size: 80,
    name: "Bat",
    discoveryTime: 0,
    transformedImage: "🦇",
  },
  {
    id: 6,
    x: 40,
    y: 40,
    size: 130,
    name: "Snake",
    discoveryTime: 0,
    transformedImage: "🐍",
  },
];

const ShadowShapes: React.FC = () => {
  const [flashlightPosition, setFlashlightPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [discovered, setDiscovered] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFlashlightPosition({ x, y });

    checkShapeIllumination(x, y);
  };

  const checkShapeIllumination = (x: number, y: number) => {
    if (!gameAreaRef.current) return;

    shadowShapes.forEach((shape) => {
      if (discovered.includes(shape.id)) return;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const shapeX = (shape.x / 100) * gameAreaRef.current.offsetWidth;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const shapeY = (shape.y / 100) * gameAreaRef.current.offsetHeight;

      const distance = Math.sqrt(
        Math.pow(x - shapeX, 2) + Math.pow(y - shapeY, 2)
      );

      if (distance < 80) {
        setDiscovered((prev) => [...prev, shape.id]);
        setScore((prev) => prev + 100);

        const audio = new Audio("/discovery-sound.mp3");
        audio.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setDiscovered([]);
    setScore(0);
  };

  return (
    <div className="gameContainer">
      {!gameStarted ? (
        <div className="startScreen">
          <h1>Shadow Shapes</h1>
          <p>
            Move your cursor around to shine your flashlight and discover the
            hidden creatures!
          </p>
          <button onClick={startGame} className="startButton">
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="gameHeader">
            <h2>Shadow Shapes</h2>
            <div className="scoreBoard">
              <span>Score: {score}</span>
              <span>
                Found: {discovered.length}/{shadowShapes.length}
              </span>
            </div>
          </div>

          <div
            ref={gameAreaRef}
            className="gameArea"
            onMouseMove={handleMouseMove}
          >
            <div
              className="flashlight"
              style={{
                left: `${flashlightPosition.x}px`,
                top: `${flashlightPosition.y}px`,
              }}
            />

            {shadowShapes.map((shape) => (
              <div
                key={shape.id}
                className={`shadowShape ${
                  discovered.includes(shape.id) ? "discovered" : ""
                }`}
                style={{
                  left: `${shape.x}%`,
                  top: `${shape.y}%`,
                  width: `${shape.size}px`,
                  height: `${shape.size}px`,
                }}
              >
                {discovered.includes(shape.id) && (
                  <div className="transformedShape">
                    <span className="emoji">{shape.transformedImage}</span>
                    <span className="shapeName">{shape.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {discovered.length === shadowShapes.length && (
            <div className="gameComplete">
              <h2>Congratulations!</h2>
              <p>You found all the shadow shapes!</p>
              <p>Final Score: {score}</p>
              <button onClick={startGame} className="restartButton">
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const ShadowShapesPage: React.FC = () => {
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Shadow Shapes Game
      </h1>
      <ShadowShapes />
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p>
          Move your cursor to shine your flashlight and discover hidden
          creatures!
        </p>
      </div>
    </div>
  );
};

export default ShadowShapesPage;
