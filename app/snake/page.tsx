'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_FOOD = { x: 5, y: 5 };

export default function SnakePage() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Use refs for direction management to eliminate input lag and race conditions
  const directionRef = useRef(INITIAL_DIRECTION);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);

  // Load high score and theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('plorine_theme') || 'dark';
    setTheme(savedTheme);

    const savedHighScore = localStorage.getItem('plorine_snake_highscore');
    if (savedHighScore) setHighScore(Number(savedHighScore));
  }, []);

  // Generate random food position
  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  // Handle keyboard controls with input buffering & reverse protection
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying && (e.key === ' ' || e.key === 'Enter')) {
        startGame();
        return;
      }

      const currentDir = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir.y === 0) {
            nextDirectionRef.current = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir.y === 0) {
            nextDirectionRef.current = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir.x === 0) {
            nextDirectionRef.current = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir.x === 0) {
            nextDirectionRef.current = { x: 1, y: 0 };
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  // Main game loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const gameInterval = setInterval(() => {
      // Apply buffered direction change at the start of the tick
      directionRef.current = nextDirectionRef.current;
      const currentDir = directionRef.current;

      setSnake((prevSnake) => {
        const head = {
          x: prevSnake[0].x + currentDir.x,
          y: prevSnake[0].y + currentDir.y,
        };

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 1;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('plorine_snake_highscore', newScore.toString());
          }
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 110);

    return () => clearInterval(gameInterval);
  }, [isPlaying, isGameOver, food, score, highScore, generateFood]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
  };

  const startGame = () => {
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const isDark = theme === 'dark';

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#0f0e17' : '#f4f4f6',
      color: isDark ? '#fffffe' : '#151421',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
    }}>
      {/* Top bar */}
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href='/' style={{ color: isDark ? '#a7a9be' : '#52525b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>← Back</Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '900', background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Retro Snake</h1>
        <div style={{ width: '50px' }}></div>
      </div>

      {/* Score Board */}
      <div style={{
        background: isDark ? '#151421' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(167, 139, 250, 0.2)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        padding: '12px 24px',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}>
        <div>
          <div style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '0.8rem' }}>SCORE</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#a78bfa' }}>{score}</div>
        </div>
        <div>
          <div style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '0.8rem', textAlign: 'right' }}>HIGH SCORE</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#f472b6', textAlign: 'right' }}>{highScore}</div>
        </div>
      </div>

      {/* Game Board */}
      <div style={{
        width: `${CANVAS_SIZE}px`,
        height: `${CANVAS_SIZE}px`,
        backgroundColor: isDark ? '#151421' : '#ffffff',
        border: `2px solid ${isDark ? 'rgba(167, 139, 250, 0.3)' : 'rgba(0,0,0,0.15)'}`,
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
      }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);

          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          let backgroundColor = 'transparent';
          if (isHead) backgroundColor = '#a78bfa';
          else if (isSnake) backgroundColor = '#8b5cf6';
          else if (isFood) backgroundColor = '#f472b6';

          return (
            <div
              key={index}
              style={{
                backgroundColor,
                borderRadius: isFood || isSnake ? '4px' : '0px',
                transition: 'background-color 0.05s ease',
              }}
            />
          );
        })}

        {/* Overlay for Start / Game Over */}
        {(!isPlaying || isGameOver) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: isDark ? 'rgba(15, 14, 23, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            zIndex: 10
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: isDark ? '#fffffe' : '#151421' }}>
              {isGameOver ? 'Game Over!' : 'Retro Snake'}
            </h2>
            {isGameOver && (
              <p style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '1.0rem' }}>Final Score: {score}</p>
            )}
            <button
              onClick={startGame}
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
                color: '#0f0e17',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(167, 139, 250, 0.3)',
              }}
            >
              {isGameOver ? 'Play Again' : 'Start Game'}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', color: isDark ? '#a7a9be' : '#52525b', fontSize: '0.9rem', textAlign: 'center' }}>
        Use <strong style={{ color: isDark ? '#fffffe' : '#151421' }}>Arrow Keys</strong> or <strong style={{ color: isDark ? '#fffffe' : '#151421' }}>WASD</strong> to steer.
      </div>
    </main>
  );
}