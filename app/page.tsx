'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  
  // Theme state
  const [theme, setTheme] = useState('dark');
  
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
    // Check theme
    const savedTheme = localStorage.getItem('plorine_theme') || 'dark';
    setTheme(savedTheme);

    // Check stored user session first
    const savedUser = localStorage.getItem('plorine_username');
    if (savedUser) {
      setUsername(savedUser);
      setIsModalOpen(false);
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
      setErrorMsg("Please fill in all fields.");
      return;
    }

    const passKey = `plorine_pass_${cleanName.toLowerCase()}`;
    const savedPass = localStorage.getItem(passKey);

    if (authMode === 'signup') {
      if (savedPass) {
        setErrorMsg("This nickname is already taken! Choose another or log in.");
        return;
      }
      localStorage.setItem(passKey, cleanPass);
      localStorage.setItem('plorine_username', cleanName);
      setUsername(cleanName);
      setIsModalOpen(false);
    } else if (authMode === 'login') {
      if (!savedPass) {
        setErrorMsg("Nickname not found. Please sign up first.");
        return;
      }
      if (savedPass === cleanPass) {
        localStorage.setItem('plorine_username', cleanName);
        setUsername(cleanName);
        setIsModalOpen(false);
      } else {
        setErrorMsg("Incorrect password!");
      }
    }
  };

  const handleSwitchAccount = () => {
    setTempName('');
    setTempPass('');
    setErrorMsg('');
    setAuthMode(null);
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    // If they were browsing as a guest or already had a username, just close the modal
    const savedUser = localStorage.getItem('plorine_username');
    if (savedUser || username) {
      setIsModalOpen(false);
    } else {
      // Fallback to guest if no username exists at all
      setUsername('Guest');
      setIsModalOpen(false);
    }
  };

  const games = [
    { 
      title: 'Wordle', 
      desc: 'Wordle by New York Times but infinite.', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-line"><path d="M13 21h8"/><path d="m15 5 4 4"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>, 
      href: '/wordle', 
      tag: 'Popular' 
    },
    { 
      title: 'Trivia', 
      desc: 'Test your knowledge on common sense questions.', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>, 
      href: '/trivia', 
      tag: 'New' 
    },
    { 
      title: 'Clicker', 
      desc: 'Basically a clicker game.', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse-pointer-click"><path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/></svg>, 
      href: '/clicker', 
      tag: 'Classic' 
    },
    { 
      title: 'Retro Snake', 
      desc: 'A very hungry serpent that grows longer when fed.', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-worm"><path d="m19 12-1.5 3"/><path d="M19.63 18.81 22 20"/><path d="M6.47 8.23a1.68 1.68 0 0 1 2.44 1.93l-.64 2.08a6.76 6.76 0 0 0 10.16 7.67l.42-.27a1 1 0 1 0-2.73-4.21l-.42.27a1.76 1.76 0 0 1-2.63-1.99l.64-2.08A6.66 6.66 0 0 0 3.94 3.9l-.7.4a1 1 0 1 0 2.55 4.34z"/></svg>, 
      href: '/snake' 
    },
    { 
      title: 'Mini 2048', 
      desc: 'A popular sliding-tile puzzle video game', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers-2"><path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z"/><path d="m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845"/></svg>, 
      href: '/2048' 
    },
    { 
      title: 'Color Match', 
      desc: 'Test your reaction speed with known colors.', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>, 
      href: '/color-match' 
    },
  ];

  const isDark = theme === 'dark';

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#0f0e17' : '#f4f4f6',
      color: isDark ? '#fffffe' : '#151421',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative'
    }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '240px',
        backgroundColor: isDark ? '#151421' : '#ffffff',
        borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'}`,
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#a78bfa', marginBottom: '30px' }}>Plorine</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/" style={{ color: isDark ? '#fffffe' : '#151421', textDecoration: 'none', padding: '10px 14px', borderRadius: '10px', background: 'rgba(167, 139, 250, 0.15)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              Home
            </Link>
            <Link href="/settings" style={{ color: isDark ? '#a7a9be' : '#52525b', textDecoration: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cog"><path d="M11 10.27 7 3.34"/><path d="m11 13.73-4 6.93"/><path d="M12 22v-2"/><path d="M12 2v2"/><path d="M14 12h8"/><path d="m17 20.66-1-1.73"/><path d="m17 3.34-1 1.73"/><path d="M2 12h2"/><path d="m20.66 17-1.73-1"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m3.34 7 1.73 1"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="8"/></svg>
              Settings
            </Link>
          </nav>
        </div>
        <div style={{ color: isDark ? '#6b6e82' : '#a1a1aa', fontSize: '0.8rem' }}>v1.0 Arcade</div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
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

        {/* Auth Modal with Cancel/Go Back option */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: isDark ? 'rgba(15, 14, 23, 0.85)' : 'rgba(244, 244, 246, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: isDark ? '#151421' : '#ffffff',
              color: isDark ? '#fffffe' : '#151421',
              padding: '40px',
              borderRadius: '28px',
              border: `1px solid ${isDark ? 'rgba(167, 139, 250, 0.2)' : 'rgba(0, 0, 0, 0.08)'}`,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Plorine ID</h2>
              <p style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '0.95rem', marginBottom: '24px' }}>
                {authMode === null ? "Choose an option to continue." : authMode === 'signup' ? "Create a secure new profile." : "Log in to your profile."}
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
                    background: isDark ? '#1f1e2e' : '#f4f4f6',
                    color: isDark ? '#fffffe' : '#151421',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    padding: '14px',
                    borderRadius: '14px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    Log In
                  </button>
                  <button onClick={handleCancelModal} style={{
                    background: 'transparent',
                    color: isDark ? '#a7a9be' : '#52525b',
                    border: 'none',
                    padding: '10px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}>
                    ← Cancel / Go Back
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
                      background: isDark ? '#1f1e2e' : '#f4f4f6',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      padding: '14px 16px',
                      borderRadius: '14px',
                      color: isDark ? '#fffffe' : '#151421',
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
                      background: isDark ? '#1f1e2e' : '#f4f4f6',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      padding: '14px 16px',
                      borderRadius: '14px',
                      color: isDark ? '#fffffe' : '#151421',
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
                    color: isDark ? '#a7a9be' : '#52525b',
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
              background: isDark ? '#151421' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'}`,
              padding: '8px 16px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', color: '#a78bfa' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#a78bfa' }}>{username || 'Guest'}</span>
            </div>
            <button onClick={handleSwitchAccount} style={{
              background: isDark ? '#151421' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'}`,
              color: isDark ? '#a7a9be' : '#52525b',
              padding: '8px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}>
              Switch
            </button>
          </div>

          <div style={{
            background: isDark ? '#151421' : '#ffffff',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', color: '#f472b6' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/></svg>
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: isDark ? '#fffffe' : '#151421' }}>{streak} Day Streak</span>
          </div>
        </div>

        {/* Header section with randomly shifting font title */}
        <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '600px' }}>
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
          <p style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '1.25rem', lineHeight: '1.5' }}>
            Stuff made by Sean to escape class boredom.
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
                  background: isHovered ? (isDark ? '#1a1926' : '#ffffff') : (isDark ? '#151421' : '#ffffff'),
                  padding: '28px',
                  borderRadius: '24px',
                  textDecoration: 'none',
                  color: isDark ? '#fffffe' : '#151421',
                  boxShadow: isHovered ? '0 12px 40px rgba(167, 139, 250, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
                  border: `1px solid ${isHovered ? 'rgba(167, 139, 250, 0.3)' : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)')}`,
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
                    <div style={{ color: '#a78bfa', display: 'flex', alignItems: 'center' }}>
                      {game.icon}
                    </div>
                    {game.tag && (
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
                    )}
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>{game.title}</h2>
                  <p style={{ color: isDark ? '#a7a9be' : '#52525b', fontSize: '0.95rem', lineHeight: '1.5' }}>{game.desc}</p>
                </div>
              </a>
            );
          })}
        </div>

        <footer style={{ color: isDark ? '#6b6e82' : '#a1a1aa', fontSize: '0.9rem' }}>
          Built for class-time survival.
        </footer>
      </div>
    </main>
  );
}