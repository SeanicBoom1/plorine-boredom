'use client';

import { useState, useEffect } from 'react';

const FONTS = [
  'system-ui, -apple-system, sans-serif',
  'Courier New, monospace',
  'Georgia, serif',
  'Impact, sans-serif',
  'Comic Sans MS, cursive, sans-serif',
  'Trebuchet MS, sans-serif',
  'Brush Script MT, cursive'
];

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [streak, setStreak] = useState(0);
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Auth flow states
  const [authMode, setAuthMode] = useState(null);
  const [tempName, setTempName] = useState('');
  const [tempPass, setTempPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Streak Alarm notification state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Title font cycling state
  const [currentFont, setCurrentFont] = useState(FONTS[0]);

  useEffect(() => {
    // Check stored user session first
    const savedUser = localStorage.getItem('plorine_username');
    if (savedUser) {
      setUsername(savedUser);
      setIsModalOpen(false); // Explicitly keep modal closed if logged in
    } else {
      setIsModalOpen(true);
    }

    // Check and update streak logic
    const lastPlayDate = localStorage.getItem('plorine_last_date');
    const currentStreak = parseInt(localStorage.getItem('plorine_streak') || '0', 10);
    const today = new Date().toDateString();

    if (lastPlayDate) {
      const lastDate = new Date(lastPlayDate);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        const newStreak = currentStreak + 1;
        setStreak(newStreak);
        localStorage.setItem('plorine_streak', newStreak.toString());
        localStorage.setItem('plorine_last_date', today);
        setAlertMessage(`🔥 Streak Alarm! Day ${newStreak} unlocked! You're on fire!`);
        setShowAlert(true);
      } else if (diffDays > 1) {
        setStreak(1);
        localStorage.setItem('plorine_streak', '1');
        localStorage.setItem('plorine_last_date', today);
        setAlertMessage(`⚠️ Streak Reset! Day 1 started. Don't miss tomorrow!`);
        setShowAlert(true);
      } else {
        setStreak(currentStreak || 1);
      }
    } else {
      setStreak(1);
      localStorage.setItem('plorine_streak', '1');
      localStorage.setItem('plorine_last_date', today);
      setAlertMessage(`🎉 Welcome to Plorine! Day 1 streak started.`);
      setShowAlert(true);
    }

    // Randomize title font every 2.5 seconds
    const fontInterval = setInterval(() => {
      const randomFont = FONTS[Math.floor(Math.random() * FONTS.length)];
      setCurrentFont(randomFont);
    }, 2500);

    return () => clearInterval(fontInterval);
  }, []);

  const handleAction = (e) => {
    e.preventDefault();
    const cleanName = tempName.trim();
    const cleanPass = tempPass.trim();

    if (!cleanName || !cleanPass) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    const passKey = `plorine_pass_${cleanName.toLowerCase()}`;
    const savedPass = localStorage.getItem(passKey);

    if (authMode === 'signup') {
      if (savedPass) {
        setErrorMsg('This nickname is already taken! Choose another or log in.');
        return;
      }
      localStorage.setItem(passKey, cleanPass);
      localStorage.setItem('plorine_username', cleanName);
      setUsername(cleanName);
      setIsModalOpen(false);
    } else if (authMode === 'login') {
      if (!savedPass) {
        setErrorMsg('Nickname not found. Please sign up first.');
        return;
      }
      if (savedPass === cleanPass) {
        localStorage.setItem('plorine_username', cleanName);
        setUsername(cleanName);
        setIsModalOpen(false);
      } else {
        setErrorMsg('Incorrect password!');
      }
    }
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem('plorine_username');
    setUsername('');
    setTempName('');
    setTempPass('');
    setErrorMsg('');
    setAuthMode(null);
    setIsModalOpen(true);
  };

  const games = [
    { title: 'Wordle', desc: 'Guess the hidden daily word in 6 tries before class ends.', icon: '🟩', href: '/wordle', tag: 'Popular' },
    { title: 'Trivia', desc: 'Test your general knowledge with quick-fire questions.', icon: '🧠', href: '/trivia', tag: 'New' },
    { title: 'Clicker', desc: 'Mindless tapping to make numbers go up.', icon: '⚡', href: '/clicker', tag: 'Classic' },
    { title: 'Retro Snake', desc: 'The timeless arcade game hidden in plain sight.', icon: '🐍', href: '/snake', tag: 'Arcade' },
    { title: 'Mini 2048', desc: 'Slide tiles and try not to get stuck.', icon: '🔢', href: '/2048', tag: 'Puzzle' },
    { title: 'Color Match', desc: 'Test your reaction speed with chaotic colors.', icon: '🎨', href: '/color-match', tag: 'Fast' },
  ];

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0f0e17',
      color: '#fffffe',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 20px 40px 20px',
      position: 'relative'
    }}>
      {/* Streak Alarm Banner Notification */}
      {showAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
          color: '#0f0e17',
          padding: '12px 24px',
          borderRadius: '16px',
          fontWeight: 'bold',
          boxShadow: '0 10px 30px rgba(167, 139, 250, 0.4)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <span>{alertMessage}</span>
          <button onClick={() => setShowAlert(false)} style={{
            background: '#0f0e17',
            color: '#fffffe',
            border: 'none',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}>✕</button>
        </div>
      )}

      {/* Auth Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 14, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#151421',
            padding: '40px',
            borderRadius: '28px',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            width: '100%',
            maxWidth: '380px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Plorine ID</h2>
            <p style={{ color: '#a7a9be', fontSize: '0.95rem', marginBottom: '24px' }}>
              {authMode === null ? 'Choose an option to continue.' : authMode === 'signup' ? 'Create a secure new profile.' : 'Log in to your profile.'}
            </p>

            {authMode === null ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => { setAuthMode('signup'); setErrorMsg(''); }} style={{
                  background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
                  color: '#0f0e17',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  Sign Up
                </button>
                <button onClick={() => { setAuthMode('login'); setErrorMsg(''); }} style={{
                  background: '#1f1e2e',
                  color: '#fffffe',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '14px',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input
                  type="text"
                  placeholder="Nickname..."
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={15}
                  style={{
                    background: '#1f1e2e',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    color: '#fffffe',
                    fontSize: '1rem',
                    outline: 'none',
                    textAlign: 'center'
                  }}
                />
                <input
                  type="password"
                  placeholder="Password / PIN..."
                  value={tempPass}
                  onChange={(e) => setTempPass(e.target.value)}
                  style={{
                    background: '#1f1e2e',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    color: '#fffffe',
                    fontSize: '1rem',
                    outline: 'none',
                    textAlign: 'center'
                  }}
                />

                {errorMsg && <div style={{ color: '#fb7185', fontSize: '0.85rem', fontWeight: '600' }}>{errorMsg}</div>}

                <button type="submit" style={{
                  background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
                  color: '#0f0e17',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '6px'
                }}>
                  {authMode === 'signup' ? 'Create Account' : 'Log In'}
                </button>

                <button type="button" onClick={() => { setAuthMode(null); setErrorMsg(''); }} style={{
                  background: 'transparent',
                  color: '#a7a9be',
                  border: 'none',
                  padding: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}>
                  ← Back
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Top Bar with User Profile & Streak */}
      <div style={{ width: '100%', maxWidth: '920px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#151421',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1rem' }}>👤</span>
            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#a78bfa' }}>{username || 'Guest'}</span>
          </div>
          <button onClick={handleSwitchAccount} style={{
            background: '#151421',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            color: '#a7a9be',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}>
            Switch
          </button>
        </div>

        <div style={{
          background: '#151421',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>🔥</span>
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fffffe' }}>{streak} Day Streak</span>
        </div>
      </div>

      {/* Header section with randomly shifting font title */}
      <div style={{ textAlign: 'center', marginBottom: '50px', maxWidth: '600px' }}>
        <h1 style={{ 
          fontSize: '3.8rem', 
          fontWeight: '900', 
          letterSpacing: '-2px',
          marginBottom: '12px', 
          fontFamily: currentFont,
          background: 'linear-gradient(135deg, #a78bfa, #f472b6)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          transition: 'font-family 0.3s ease'
        }}>
          Plorine
        </h1>
        <p style={{ color: '#a7a9be', fontSize: '1.25rem', lineHeight: '1.5' }}>
          A box of interactive toys and games to pass the time when class gets boring.
        </p>
      </div>

      {/* Toy shelf grid layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '920px',
        marginBottom: '60px'
      }}>
        {games.map((game, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <a 
              key={index} 
              href={game.href} 
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                background: isHovered ? '#1a1926' : '#151421',
                padding: '28px',
                borderRadius: '24px',
                textDecoration: 'none',
                color: '#fffffe',
                boxShadow: isHovered ? '0 12px 40px rgba(167, 139, 250, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.2)',
                border: `1px solid ${isHovered ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255, 255, 255, 0.04)'}`,
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '2.4rem' }}>{game.icon}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: 'rgba(167, 139, 250, 0.1)',
                    color: '#a78bfa',
                    padding: '4px 10px',
                    borderRadius: '20px'
                  }}>
                    {game.tag}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>{game.title}</h2>
                <p style={{ color: '#a7a9be', fontSize: '0.95rem', lineHeight: '1.5' }}>{game.desc}</p>
              </div>
            </a>
          );
        })}
      </div>

      <footer style={{ color: '#6b6e82', fontSize: '0.9rem' }}>
        Built for class-time survival.
      </footer>
    </main>
  );
}