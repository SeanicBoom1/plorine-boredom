"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('purple');
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('plorine_theme') || 'dark';
    const savedAccent = localStorage.getItem('plorine_accent') || 'purple';
    setTheme(savedTheme);
    setAccentColor(savedAccent);
  }, []);

  const handleSave = (newTheme: string, newAccent: string) => {
    setTheme(newTheme);
    setAccentColor(newAccent);
    localStorage.setItem('plorine_theme', newTheme);
    localStorage.setItem('plorine_accent', newAccent);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#0f0e17' : '#f4f4f6',
      color: theme === 'dark' ? '#fffffe' : '#151421',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Settings</h1>
          <Link href="/" style={{
            background: theme === 'dark' ? '#151421' : '#ffffff',
            color: theme === 'dark' ? '#fffffe' : '#151421',
            padding: '10px 18px',
            borderRadius: '12px',
            textDecoration: 'none',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}>
            ← Back Home
          </Link>
        </div>

        {savedMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
            color: '#0f0e17',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            Settings updated successfully!
          </div>
        )}

        <div style={{
          background: theme === 'dark' ? '#151421' : '#ffffff',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Theme Mode</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleSave('dark', accentColor)} style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                background: theme === 'dark' ? '#a78bfa' : '#1f1e2e',
                color: theme === 'dark' ? '#0f0e17' : '#fffffe',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Dark Mode
              </button>
              <button onClick={() => handleSave('light', accentColor)} style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                background: theme === 'light' ? '#a78bfa' : '#e4e4e7',
                color: '#0f0e17',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Light Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}