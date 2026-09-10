'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Yellow', hex: '#f59e0b' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
];

export default function ColorMatchPage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('plorine_theme') || 'dark';
    setTheme(savedTheme);

    const saved = localStorage.getItem('plorine_colormatch_highscore');
    if (saved) setHighScore(Number(saved));
  }, []);

  const startRound = useCallback(() => {
    // Pick a random target color
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(target);

    // Pick 4 random options including the target
    let shuffled = [...COLORS].sort(() => 0.5 - Math.random()).slice(0, 4);
    if (!shuffled.some(c => c.name === target.name)) {
      shuffled[Math.floor(Math.random() * 4)] = target;
    }
    setOptions(shuffled);
    setTimeLeft(Math.max(2, 5 - Math.floor(score / 5)));
  }, [score]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    startRound();
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 0.1);
    }, 100);

    return () => clearInterval(timer);
  }, [timeLeft, isPlaying, gameOver]);

  const handlePick = (color) => {
    if (!isPlaying) return;

    if (color.name === targetColor.name) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('plorine_colormatch_highscore', newScore.toString());
      }
      startRound();
    } else {
      setGameOver(true);
      setIsPlaying(false);
    }
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
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href='/' style={{ color: isDark ? '#a7a9be' : '#52525b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>← Back</Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '900', background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Color Match</h1>
        <div style={{ width: '40px' }} />
      </div>

      {/* Score Board */}
      <div style={{
        background: isDark ? '#151421' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(167, 139, 250, 0.2)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        padding: '12px 24px',
        width: '100%',
        maxWidth: '380px',
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

      {/* Game Card */}
      <div style={{
        width: '380px',
        height: '380px',
        backgroundColor: isDark ? '#151421' : '#ffffff',
        border: `2px solid ${isDark ? 'rgba(167, 139, 250, 0.3)' : 'rgba(0,0,0,0.15)'}`,
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        {isPlaying ? (
          <>
            {/* Timer Bar */}
            <div style={{ width: '100%', height: '6px', backgroundColor: isDark ? '#1f1e2e' : '#e4e4e7', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${(timeLeft / 5) * 100}%`,
                height: '100%',
                backgroundColor: '#f472b6',
                transition: 'width 0.1s linear'
              }} />
            </div>

            {/* Target Display */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '0.9rem', marginBottom: '8px' }}>MATCH THIS COLOR</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: targetColor.hex }}>
                {targetColor.name}
              </div>
            </div>

            {/* Options Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              width: '100%'
            }}>
              {options.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePick(col)}
                  style={{
                    backgroundColor: col.hex,
                    border: 'none',
                    height: '60px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    transition: 'transform 0.1s ease'
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '14px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: isDark ? '#fffffe' : '#151421' }}>
              {gameOver ? 'Game Over!' : 'Color Match'}
            </h2>
            {gameOver && <p style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '0.95rem' }}>Final Score: {score}</p>}
            <button
              onClick={startGame}
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
                color: '#0f0e17',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '14px',
                fontSize: '0.95rem',
                fontWeight: '900',
                cursor: 'pointer',
              }}
            >
              {gameOver ? 'Play Again' : 'Start Game'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}