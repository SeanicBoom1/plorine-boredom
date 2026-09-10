'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function ClickerPage() {
  const [score, setScore] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [cursorCost, setCursorCost] = useState(15);
  const [powerCost, setPowerCost] = useState(50);
  const [theme, setTheme] = useState('dark');

  // Anti-cheat / Auto-clicker detector states
  const [isLocked, setIsLocked] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const clickTimesRef = useRef([]);

  // Load saved progress and theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('plorine_theme') || 'dark';
    setTheme(savedTheme);

    const savedScore = localStorage.getItem('plorine_clicker_score');
    const savedAuto = localStorage.getItem('plorine_clicker_auto');
    const savedPower = localStorage.getItem('plorine_clicker_power');
    const savedCursorCost = localStorage.getItem('plorine_clicker_ccost');
    const savedPowerCost = localStorage.getItem('plorine_clicker_pcost');

    if (savedScore) setScore(Number(savedScore));
    if (savedAuto) setAutoClickers(Number(savedAuto));
    if (savedPower) setClickPower(Number(savedPower));
    if (savedCursorCost) setCursorCost(Number(savedCursorCost));
    if (savedPowerCost) setPowerCost(Number(savedPowerCost));
  }, []);

  // Save progress to localStorage on change
  useEffect(() => {
    localStorage.setItem('plorine_clicker_score', score);
    localStorage.setItem('plorine_clicker_auto', autoClickers);
    localStorage.setItem('plorine_clicker_power', clickPower);
    localStorage.setItem('plorine_clicker_ccost', cursorCost);
    localStorage.setItem('plorine_clicker_pcost', powerCost);
  }, [score, autoClickers, clickPower, cursorCost, powerCost]);

  // Auto-clicker passive income loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickers > 0) {
        setScore((prev) => prev + autoClickers);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickers]);

  // Manual Click Handler with high threshold for natural fast clickers
  const handleClick = () => {
    if (isLocked) return;

    const now = Date.now();
    clickTimesRef.current = clickTimesRef.current.filter((time) => now - time < 1000);
    clickTimesRef.current.push(now);

    if (clickTimesRef.current.length > 22) {
      setIsLocked(true);
      setWarningMsg('🚨 Actual macro detected! Even for you, that was inhuman.');
      
      setTimeout(() => {
        clickTimesRef.current = [];
        setIsLocked(false);
        setWarningMsg('');
      }, 3000);
      return;
    }

    setScore((prev) => prev + clickPower);
  };

  // Trigger celebratory confetti blast
  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#a78bfa', '#f472b6', '#ffffff']
    });
  };

  const buyAutoClicker = () => {
    if (score >= cursorCost) {
      setScore((prev) => prev - cursorCost);
      setAutoClickers((prev) => prev + 1);
      setCursorCost((prev) => Math.floor(prev * 1.35));
      triggerConfetti();
    }
  };

  const buyPower = () => {
    if (score >= powerCost) {
      setScore((prev) => prev - powerCost);
      setClickPower((prev) => prev + 1);
      setPowerCost((prev) => Math.floor(prev * 1.5));
      triggerConfetti();
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
      position: 'relative'
    }}>
      {/* Anti-cheat Warning Banner */}
      {warningMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          background: '#ef4444',
          color: '#fffffe',
          padding: '12px 24px',
          borderRadius: '16px',
          fontWeight: 'bold',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease'
        }}>
          {warningMsg}
        </div>
      )}

      {/* Top bar */}
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <Link href='/' style={{ color: isDark ? '#a7a9be' : '#52525b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>← Back</Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '900', background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Clicker</h1>
        <div style={{ width: '50px' }}></div>
      </div>

      {/* Score Card */}
      <div style={{
        background: isDark ? '#151421' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(167, 139, 250, 0.2)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '24px',
        padding: '24px',
        width: '100%',
        maxWidth: '440px',
        textAlign: 'center',
        marginBottom: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}>
        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#a78bfa', marginBottom: '4px' }}>
          {score.toLocaleString()}
        </div>
        <div style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '0.95rem' }}>
          Pixels &bull; {autoClickers} auto/sec
        </div>
      </div>

      {/* Big Click Button */}
      <div style={{ width: '100%', maxWidth: '440px', marginBottom: '30px' }}>
        <button
          onClick={handleClick}
          style={{
            width: '100%',
            padding: '40px 0',
            background: isLocked ? '#374151' : 'linear-gradient(135deg, #a78bfa, #f472b6)',
            color: '#0f0e17',
            border: 'none',
            borderRadius: '24px',
            fontSize: '1.5rem',
            fontWeight: '900',
            cursor: isLocked ? 'not-allowed' : 'pointer',
            boxShadow: isLocked ? 'none' : '0 10px 25px rgba(167, 139, 250, 0.3)',
            transition: 'transform 0.1s ease',
            opacity: isLocked ? 0.7 : 1,
          }}
          onMouseDown={(e) => { if (!isLocked) e.currentTarget.style.transform = 'scale(0.97)'; }}
          onMouseUp={(e) => { if (!isLocked) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isLocked ? 'LOCKED (Macro Detected)' : 'CLICK ME!'}
        </button>
      </div>

      {/* Upgrades Section */}
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: isDark ? '#a7a9be' : '#52525b', marginBottom: '4px' }}>Upgrades</h2>
        
        {/* Auto Clicker Upgrade */}
        <button
          onClick={buyAutoClicker}
          disabled={score < cursorCost}
          style={{
            background: isDark ? '#151421' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(167, 139, 250, 0.2)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '16px',
            padding: '16px 20px',
            color: isDark ? '#fffffe' : '#151421',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: score >= cursorCost ? 'pointer' : 'not-allowed',
            opacity: score >= cursorCost ? 1 : 0.6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <div style={{ 
              background: isDark ? 'rgba(167, 139, 250, 0.1)' : 'rgba(167, 139, 250, 0.15)', 
              padding: '10px', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a78bfa'
            }}>
              <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <rect x='3' y='11' width='18' height='10' rx='2'></rect>
                <circle cx='12' cy='5' r='2'></circle>
                <path d='M12 7v4'></path>
                <line x1='8' y1='15' x2='8' y2='17'></line>
                <line x1='16' y1='15' x2='16' y2='17'></line>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>Auto-Cursor</div>
              <div style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '0.85rem' }}>Generates +1 pixel/sec</div>
            </div>
          </div>
          <div style={{ fontWeight: '800', color: '#f472b6' }}>{cursorCost} Pixels</div>
        </button>

        {/* Click Power Upgrade */}
        <button
          onClick={buyPower}
          disabled={score < powerCost}
          style={{
            background: isDark ? '#151421' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(167, 139, 250, 0.2)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '16px',
            padding: '16px 20px',
            color: isDark ? '#fffffe' : '#151421',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: score >= powerCost ? 'pointer' : 'not-allowed',
            opacity: score >= powerCost ? 1 : 0.6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <div style={{ 
              background: isDark ? 'rgba(244, 114, 182, 0.1)' : 'rgba(244, 114, 182, 0.15)', 
              padding: '10px', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f472b6'
            }}>
              <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'></polygon>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>Power Click</div>
              <div style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '0.85rem' }}>+{clickPower} power per click</div>
            </div>
          </div>
          <div style={{ fontWeight: '800', color: '#f472b6' }}>{powerCost} Pixels</div>
        </button>
      </div>
    </main>
  );
}