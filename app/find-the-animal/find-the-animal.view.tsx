"use client";
import React, { useState, useRef, useEffect } from "react";
import "./find-the-animal.css";
import NavBarView from "../nav-bar/nav-bar.view";
import Description from "./find-the-animal-description";

interface Animal {
  name: string;
  image: string;
  soundPath: string;
}

interface Position {
  x: number;
  y: number;
}

const animals: Animal[] = [
  {
    name: "crow",
    image: "/doodle-crow.png",
    soundPath: "/crow-sfx-318131.mp3",
  },
  {
    name: "duck",
    image: "/doodle-duck.png",
    soundPath: "/duck-quack-112941.mp3",
  },
];

const MAX_GUESSES = 15;

const FindTheInvisibleAnimal: React.FC = () => {
  const [distance, setDistance] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [animalFound, setAnimalFound] = useState(false);
  const [animalPosition, setAnimalPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [score, setScore] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [foundPosition, setFoundPosition] = useState<Position | null>(null);
  const [clickPosition, setClickPosition] = useState<Position | null>(null);
  const [guesses, setGuesses] = useState(0);

  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const celebrationRef = useRef<HTMLAudioElement | null>(null);

  const selectRandomAnimal = (): Animal =>
    animals[Math.floor(Math.random() * animals.length)];

  const startGame = () => {
    const newX = Math.floor(Math.random() * 80) + 10;
    const newY = Math.floor(Math.random() * 80) + 10;
    setAnimalPosition({ x: newX, y: newY });
    setGameStarted(true);
    setAnimalFound(false);
    setCurrentAnimal(selectRandomAnimal());
    setDistance(100);
    setFoundPosition(null);
    setClickPosition(null);
    setGuesses(0);

    if (audioRef.current) {
      audioRef.current.play();
      audioRef.current.currentTime = 0;
    }
    if (ambienceRef.current) {
      ambienceRef.current.play();
      ambienceRef.current.currentTime = 0;
    }
  };

  const calculateDistance = (mouseX: number, mouseY: number): number => {
    if (!gameAreaRef.current) return 100;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const animalX = (animalPosition.x / 100) * rect.width;
    const animalY = (animalPosition.y / 100) * rect.height;
    const dx = mouseX - (rect.left + animalX);
    const dy = mouseY - (rect.top + animalY);
    const distToAnimal = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.sqrt(rect.width ** 2 + rect.height ** 2);
    return Math.min(100, Math.floor((distToAnimal / maxDist) * 100));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameStarted || animalFound || guesses >= MAX_GUESSES) return;
    const newDistance = calculateDistance(e.clientX, e.clientY);
    setDistance(newDistance);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!gameStarted || animalFound || guesses >= MAX_GUESSES) return;
    const touch = e.touches[0];
    const newDistance = calculateDistance(touch.clientX, touch.clientY);
    setDistance(newDistance);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !gameStarted ||
      animalFound ||
      guesses >= MAX_GUESSES ||
      !gameAreaRef.current
    )
      return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const dist = calculateDistance(mouseX, mouseY);
    setGuesses((prev) => prev + 1);

    if (dist < 5) {
      const foundX = (animalPosition.x / 100) * rect.width;
      const foundY = (animalPosition.y / 100) * rect.height;
      setFoundPosition({ x: foundX, y: foundY });
      setClickPosition({ x: foundX, y: foundY });
      foundAnimal();
    }
  };

  useEffect(() => {
    if (!audioEnabled || !currentAnimal || animalFound) return;

    const audio = new Audio(currentAnimal.soundPath);
    audio.loop = true;
    audio.volume = 1.0;
    audio.load();
    audioRef.current = audio;
    audio.play().catch(console.error);

    const ambience = new Audio("/jungle-ambience.mp3");
    ambience.loop = true;
    ambience.volume = 0.2;
    ambience.load();
    ambienceRef.current = ambience;
    ambience.play().catch(console.error);

    return () => {
      audio.pause();
      ambience.pause();
    };
  }, [audioEnabled, currentAnimal]);

  useEffect(() => {
    if (!audioRef.current || animalFound) return;
    // const volume = 1 - distance / 100;
    // const rate = 1 + (100 - distance) / 150;
    audioRef.current.volume = Math.max(0.05, 1 - distance / 80);
    audioRef.current.playbackRate = Math.min(2, 0.5 + (100 - distance) / 40);
  }, [distance, animalFound]);

  const foundAnimal = () => {
    setAnimalFound(true);
    setScore((prev) => prev + 1);
    if (audioRef.current) audioRef.current.pause();
    if (ambienceRef.current) ambienceRef.current.pause();

    const cheer = new Audio("/celebration.mp3");
    cheer.volume = 0.8;
    cheer.load();
    celebrationRef.current = cheer;
    cheer.play().catch(console.error);
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
  };

  const getDistanceLabel = (): string => {
    if (distance < 10) return "🔥 Very Hot";
    if (distance < 25) return "🌡️ Warm";
    if (distance < 50) return "🧊 Cold";
    return "❄️ Freezing";
  };

  return (
    <>
      <NavBarView />
      <div className="container">
        <div className="header">
          <h1>Find the Invisible Animal</h1>
          <p>
            Click to guess! You only get {MAX_GUESSES - guesses} guesses left.
          </p>
        </div>

        <div className="controls">
          <button onClick={toggleAudio}>
            {audioEnabled ? "Mute Sound" : "Enable Sound"}
          </button>
          <div className="central-text">
            <strong className="score">Score: {score}</strong>
            {currentAnimal && gameStarted && (
              <span>Find the {currentAnimal.name}</span>
            )}
          </div>
          <button onClick={startGame}>
            {gameStarted ? "New Game" : "Start Game"}
          </button>
        </div>

        <div
          ref={gameAreaRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onClick={handleClick}
          className={`game-area ${
            animalFound || (guesses >= MAX_GUESSES && !animalFound)
              ? "disabled"
              : ""
          }`}
        >
          {!gameStarted ? (
            <div className="center-text">Click Start Game to begin!</div>
          ) : animalFound && currentAnimal && foundPosition ? (
            <img
              src={currentAnimal.image}
              alt={currentAnimal.name}
              className="doodle-animal animate-pop"
              style={{
                left: `${clickPosition?.x || 0}px`,
                top: `${clickPosition?.y || 0}px`,
                transform: "translate(-50%, -50%) scale(1)",
                position: "absolute",
              }}
            />
          ) : guesses >= MAX_GUESSES && !animalFound ? (
            <div className="lost-message">
              😢 You ran out of guesses!
              <button className="restart-button" onClick={startGame}>
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="distance-bar">
                <div
                  className="bar-fill"
                  style={{ width: `${100 - distance}%` }}
                ></div>
              </div>
              <div className="distance-label">{getDistanceLabel()}</div>
            </>
          )}
        </div>

        <div className="footer">
          <p>
            The sound gets louder and more frequent as you get closer to the
            animal!
          </p>
        </div>
      </div>
      <Description />
    </>
  );
};

export default FindTheInvisibleAnimal;
