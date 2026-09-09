'use client';

import { useState, useEffect, useCallback } from 'react';

const BOARD_SIZE = 4;

export default function Game2048Page() {
  const [board, setBoard] = useState(
    () => Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0))
  );
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);

  // Load high score and initialize random tiles on client mount only
  useEffect(() => {
    const saved = localStorage.getItem('plorine_2048_highscore');
    if (saved) setHighScore(Number(saved));

    setBoard(getInitialBoard());
    setIsStarted(true);
  }, []);

  function addRandomTile(currentBoard) {
    const emptyCells = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (currentBoard[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length === 0) return currentBoard;

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const clone = currentBoard.map(row => [...row]);
    clone[r][c] = Math.random() < 0.9 ? 2 : 4;
    return clone;
  }

  function getInitialBoard() {
    let newBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    newBoard = addRandomTile(addRandomTile(newBoard));
    return newBoard;
  }

  const checkGameOver = (currentBoard) => {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (currentBoard[r][c] === 0) return false;
        if (c < BOARD_SIZE - 1 && currentBoard[r][c] === currentBoard[r][c + 1]) return false;
        if (r < BOARD_SIZE - 1 && currentBoard[r][c] === currentBoard[r + 1][c]) return false;
      }
    }
    return true;
  };

  const slideRowLeft = (row) => {
    let arr = row.filter(val => val !== 0);
    let newRow = [];
    let pointsEarned = 0;

    for (let i = 0; i < arr.length; i++) {
      if (i < arr.length - 1 && arr[i] === arr[i + 1]) {
        let mergedVal = arr[i] * 2;
        newRow.push(mergedVal);
        pointsEarned += mergedVal;
        i++;
      } else {
        newRow.push(arr[i]);
      }
    }

    while (newRow.length < BOARD_SIZE) {
      newRow.push(0);
    }
    return { row: newRow, points: pointsEarned };
  };

  const moveLeft = (currentBoard) => {
    let newBoard = [];
    let totalPoints = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      const { row, points } = slideRowLeft(currentBoard[r]);
      newBoard.push(row);
      totalPoints += points;
    }
    return { board: newBoard, points: totalPoints };
  };

  const rotateBoardClockwise = (currentBoard, times = 1) => {
    let b = currentBoard.map(row => [...row]);
    for (let t = 0; t < times; t++) {
      let res = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          res[c][BOARD_SIZE - 1 - r] = b[r][c];
        }
      }
      b = res;
    }
    return b;
  };

  const handleMove = useCallback((direction) => {
    if (!isStarted || gameOver || (won && !keepPlaying)) return;

    let rotations = 0;
    if (direction === 'UP') rotations = 3;
    if (direction === 'RIGHT') rotations = 2;
    if (direction === 'DOWN') rotations = 1;

    let workingBoard = rotateBoardClockwise(board, rotations);
    const { board: movedBoard, points } = moveLeft(workingBoard);
    let finalBoard = rotateBoardClockwise(movedBoard, (4 - rotations) % 4);

    const hasChanged = JSON.stringify(board) !== JSON.stringify(finalBoard);
    if (!hasChanged) return;

    const nextBoardWithTile = addRandomTile(finalBoard);
    const newScore = score + points;
    setScore(newScore);

    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('plorine_2048_highscore', newScore.toString());
    }

    if (!won) {
      const has2048 = nextBoardWithTile.some(row => row.some(val => val >= 2048));
      if (has2048) setWon(true);
    }

    if (checkGameOver(nextBoardWithTile)) {
      setGameOver(true);
    }

    setBoard(nextBoardWithTile);
  }, [board, isStarted, gameOver, won, keepPlaying, score, highScore]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          handleMove('UP');
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          handleMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          handleMove('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  const restartGame = () => {
    setBoard(getInitialBoard());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
  };

  const getTileStyle = (val) => {
    switch (val) {
      case 2: return { background: '#1f1e2e', color: '#a78bfa' };
      case 4: return { background: '#252338', color: '#f472b6' };
      case 8: return { background: '#3b2d54', color: '#fbcfe8' };
      case 16: return { background: '#4c2548', color: '#f472b6' };
      case 32: return { background: '#6b2140', color: '#fff' };
      case 64: return { background: '#9f1239', color: '#fff' };
      case 128: return { background: '#7c3aed', color: '#fff' };
      case 256: return { background: '#6d28d9', color: '#fff' };
      case 512: return { background: '#5b21b6', color: '#fff' };
      case 1024: return { background: '#4c1d95', color: '#fff' };
      case 2048: return { background: 'linear-gradient(135deg, #a78bfa, #f472b6)', color: '#0f0e17' };
      default: return val > 2048 ? { background: '#f472b6', color: '#0f0e17' } : { background: '#151421', color: 'transparent' };
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0f0e17',
      color: '#fffffe',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
    }}>
      {/* Top bar */}
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <a href="/" style={{ color: '#a7a9be', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>← Back</a>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '900', background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mini 2048</h1>
        <button onClick={restartGame} style={{
          background: '#151421',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          color: '#a78bfa',
          padding: '6px 12px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Reset
        </button>
      </div>

      {/* Score Board */}
      <div style={{
        background: '#151421',
        border: '1px solid rgba(167, 139, 250, 0.2)',
        borderRadius: '16px',
        padding: '12px 24px',
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div>
          <div style={{ color: '#a7a9be', fontSize: '0.8rem' }}>SCORE</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#a78bfa' }}>{score}</div>
        </div>
        <div>
          <div style={{ color: '#a7a9be', fontSize: '0.8rem', textAlign: 'right' }}>HIGH SCORE</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#f472b6', textAlign: 'right' }}>{highScore}</div>
        </div>
      </div>

      {/* Game Grid Box */}
      <div style={{
        width: '380px',
        height: '380px',
        backgroundColor: '#151421',
        border: '2px solid rgba(167, 139, 250, 0.3)',
        borderRadius: '20px',
        padding: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '12px',
        position: 'relative',
        boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
        overflow: 'hidden'
      }}>
        {board.flat().map((val, idx) => {
          const tileStyle = getTileStyle(val);
          return (
            <div
              key={idx}
              style={{
                ...tileStyle,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: val >= 1000 ? '1.3rem' : val >= 100 ? '1.6rem' : '1.9rem',
                fontWeight: '900',
                transition: 'all 0.1s ease',
                boxShadow: val > 0 ? 'inset 0 2px 4px rgba(255,255,255,0.05)' : 'none'
              }}
            >
              {val > 0 ? val : ''}
            </div>
          );
        })}

        {/* Win Overlay */}
        {won && !keepPlaying && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(15, 14, 23, 0.88)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            zIndex: 10
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fffffe' }}>You Made 2048! 🎉</h2>
            <button
              onClick={() => setKeepPlaying(true)}
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
              Keep Playing
            </button>
            <button
              onClick={restartGame}
              style={{
                background: 'transparent',
                color: '#a7a9be',
                border: 'none',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Restart
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(15, 14, 23, 0.88)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            zIndex: 10
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fffffe' }}>Game Over!</h2>
            <p style={{ color: '#a7a9be', fontSize: '0.95rem' }}>Score: {score}</p>
            <button
              onClick={restartGame}
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
              Try Again
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', color: '#a7a9be', fontSize: '0.9rem', textAlign: 'center' }}>
        Use <strong style={{ color: '#fffffe' }}>Arrow Keys</strong> or <strong style={{ color: '#fffffe' }}>WASD</strong> to slide tiles.
      </div>
    </main>
  );
}