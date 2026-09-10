'use client';

import { useState, useEffect } from 'react';

// Expanded valid word list for checking real words
const VALID_WORDS = [
  'CLASS', 'BREAK', 'CHALK', 'STUDY', 'NOTES', 'PAGES', 'BOARD', 'LUNCH', 'SLEEP', 'SMART', 
  'APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EAGLE', 'FLAME', 'GRAPE', 'HOUSE', 'JUICE', 'KNIFE', 
  'LEMON', 'MOUSE', 'NIGHT', 'OCEAN', 'PIANO', 'QUEEN', 'RADIO', 'SMILE', 'TIGER', 'WATER', 
  'GAMES', 'PLORA', 'GHOST', 'SHARK', 'TRAIN', 'VAPOR', 'SPACE', 'BLADE', 'STORM', 'PIXEL',
  'CLOUD', 'PLANT', 'RIVER', 'STONE', 'TOWER', 'WINDY', 'BRICK', 'CHART', 'DRIVE', 'GLOBE',
  'ANGEL', 'BRAVE', 'CANDY', 'DREAM', 'EARTH', 'FLASH', 'GIANT', 'HEART', 'IMAGE', 'LIGHT',
  'MAGIC', 'MUSIC', 'NOVEL', 'PARTY', 'POWER', 'ROYAL', 'SHINE', 'SWEET', 'TRACK', 'WORLD',
  'BLOOM', 'CRAFT', 'FLARE', 'FROST', 'GLOWS', 'HONEY', 'LUNAR', 'ORBIT', 'PULSE', 'SPARK', 
  'STEEL', 'SWIFT', 'TRACE', 'VERVE', 'YOUTH', 'ZEBRA', 'PRESS', 'WORDS', 'AMBER', 'BEAST', 
  'CORAL', 'DAISY', 'EMBER', 'FINCH', 'GROVE', 'HAVEN', 'IVORY', 'JAZZY', 'KAPOK', 'LOTUS', 
  'MAPLE', 'NOBLE', 'PEARL', 'ACORN', 'ALIBI', 'ALIEN', 'ALLEY', 'ALTAR', 'AMUSE', 'ANNEX', 
  'APRON', 'ARENA', 'AROMA', 'ASHEN', 'ASIDE', 'ASTRO', 'ATLAS', 'AUDIO', 'AUDIT', 'AXIOM', 
  'BADGE', 'BAGEL', 'BAKER', 'BANJO', 'BARGE', 'BASIN', 'BATCH', 'BATON', 'BEARD', 'BEFIT', 
  'BEGIN', 'BEING', 'BERRY', 'BIBLE', 'BINGO', 'BIRCH', 'BISON', 'BLACK', 'BLANK', 'BLEAK', 
  'BLEED', 'BLEND', 'BLIMP', 'BLINK', 'BLISS', 'BLITZ', 'BLOCK', 'BLOND', 'BLOOD', 'BLOWN', 
  'BLUFF', 'BLUNT', 'BOAST', 'BOGEY', 'BONUS', 'BOOST', 'BOOTH', 'BOOTS', 'BOUND', 'BOWEL', 
  'BOXER', 'BRACE', 'BRAID', 'BRAIN', 'BRAND', 'BRASS', 'BREAD', 'BREED', 'BRIAR', 'BRIDE', 
  'BRIEF', 'BRINE', 'BRING', 'BRINK', 'BRISK', 'BROAD', 'BROIL', 'BROKE', 'BROOM', 'BROTH', 
  'BROWN', 'BRUSH', 'BUDDY', 'BUGGY', 'BUGLE', 'BUILD', 'BUILT', 'BULLY', 'BUNCH', 'BUNNY', 
  'BURLY', 'BURNT', 'BURST', 'BUSHY', 'BUTCH', 'BUTTE', 'BUXOM', 'BUYER', 'CABIN', 'CABLE', 
  'CADET', 'CAGEY', 'CAMEL', 'CANAL', 'CANOE', 'CANON', 'CAPER', 'CARAT', 'CARGO', 'CAROL', 
  'CARRY', 'CARVE', 'CATCH', 'CATER', 'CAUSAL', 'CEDAR', 'CELLO', 'CHAFE', 'CHAOS', 'CHARM', 
  'CHASE', 'CHEAP', 'CHEAT', 'CHECK', 'CHEEK', 'CHEER', 'CHESS', 'CHEST', 'CHICK', 'CHIEF', 
  'CHILD', 'CHILL', 'CHIRP', 'CHOIR', 'CHOKE', 'CHORD', 'CHORE', 'CHUCK', 'CHUNK', 'CHURN', 
  'CIDER', 'CIGAR', 'CINCH', 'CIRCA', 'CIVIC', 'CIVIL', 'CLAIM', 'CLAMP', 'CLASH', 'CLASP', 
  'CLEAN', 'CLEAR', 'CLEAT', 'CLERK', 'CLICK', 'CLIFF', 'CLIMB', 'CLING', 'CLINK', 
  'CLOAK', 'CLOCK', 'CLONE', 'CLOSE', 'CLOTH', 'CLOUT', 'CLOVE', 'CLOWN', 'CLUCK', 'CLUED', 
  'COACH', 'COAST', 'COCOA', 'COLON', 'COLOR', 'COMET', 'COMIC', 'COMMA', 'CONCH', 'CONDO'
];

export default function WordlePage() {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [shake, setShake] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const randomWord = VALID_WORDS[Math.floor(Math.random() * VALID_WORDS.length)];
    setSolution(randomWord);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  // Track letter status for the virtual keyboard
  const getLetterStatuses = () => {
    const statuses = {};
    guesses.forEach((guess) => {
      if (!guess) return;
      guess.split('').forEach((letter, i) => {
        if (solution[i] === letter) {
          statuses[letter] = 'correct';
        } else if (solution.includes(letter) && statuses[letter] !== 'correct') {
          statuses[letter] = 'present';
        } else if (!solution.includes(letter)) {
          if (!statuses[letter]) statuses[letter] = 'absent';
        }
      });
    });
    return statuses;
  };

  const letterStatuses = getLetterStatuses();

  const submitGuess = () => {
    if (currentGuess.length !== 5) return;

    // Check if it's a real word from our list
    if (!VALID_WORDS.includes(currentGuess)) {
      setShake(true);
      setFlashRed(true);
      showToast('Not a real word. What are you doing 🙏😭');
      setTimeout(() => {
        setShake(false);
        setFlashRed(false);
      }, 400);
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    if (currentGuess === solution) {
      setGameStatus('won');
    } else if (currentRow === 5) {
      setGameStatus('lost');
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentGuess('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== 'playing') return;

      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess(currentGuess + e.key.toUpperCase());
        } else {
          setShake(true);
          setFlashRed(true);
          setTimeout(() => {
            setShake(false);
            setFlashRed(false);
          }, 400);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, currentRow, guesses, solution, gameStatus]);

  const handleVirtualKey = (char) => {
    if (gameStatus !== 'playing') return;

    if (char === 'ENTER') {
      submitGuess();
    } else if (char === 'BACK') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else {
      if (currentGuess.length < 5) {
        setCurrentGuess(currentGuess + char);
      } else {
        setShake(true);
        setFlashRed(true);
        setTimeout(() => {
          setShake(false);
          setFlashRed(false);
        }, 400);
      }
    }
  };

  const getBoxStyle = (rowIdx, colIdx) => {
    const guess = guesses[rowIdx];
    const letter = guess ? guess[colIdx] : (rowIdx === currentRow ? currentGuess[colIdx] : '');
    
    let bg = '#151421';
    let border = '2px solid rgba(255,255,255,0.1)';

    if (rowIdx === currentRow && flashRed) {
      bg = '#7f1d1d';
      border = '2px solid #ef4444';
    } else if (guess) {
      if (solution[colIdx] === letter) {
        bg = '#22c55e';
        border = '2px solid #22c55e';
      } else if (solution.includes(letter)) {
        bg = '#eab308';
        border = '2px solid #eab308';
      } else {
        bg = '#374151';
        border = '2px solid #374151';
      }
    } else if (letter) {
      border = '2px solid rgba(167, 139, 250, 0.5)';
    }

    return {
      width: '56px',
      height: '56px',
      background: bg,
      border: border,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.6rem',
      fontWeight: 'bold',
      color: '#fffffe',
      transition: 'all 0.15s ease'
    };
  };

  const getKeyStyle = (char) => {
    const status = letterStatuses[char];
    let bg = '#222131';
    if (status === 'correct') bg = '#22c55e';
    else if (status === 'present') bg = '#eab308';
    else if (status === 'absent') bg = '#4b5563';

    return {
      background: bg,
      color: '#fffffe',
      border: 'none',
      padding: '12px 14px',
      borderRadius: '10px',
      fontSize: '0.95rem',
      fontWeight: 'bold',
      cursor: 'pointer'
    };
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
      position: 'relative'
    }}>
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }
        .shake-row {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      {/* Roast Toast Notification */}
      {toastMessage && (
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
          {toastMessage}
        </div>
      )}

      {/* Top bar */}
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <a href="/" style={{ color: '#a7a9be', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>← Back</a>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '900', background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Wordle</h1>
        <div style={{ width: '50px' }}></div>
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        {guesses.map((guess, rowIdx) => (
          <div 
            key={rowIdx} 
            className={rowIdx === currentRow && shake ? 'shake-row' : ''}
            style={{ display: 'flex', gap: '10px' }}
          >
            {[0, 1, 2, 3, 4].map((colIdx) => (
              <div key={colIdx} style={getBoxStyle(rowIdx, colIdx)}>
                {guess ? guess[colIdx] : (rowIdx === currentRow ? currentGuess[colIdx] || '' : '')}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Game Over Modal */}
      {gameStatus !== 'playing' && (
        <div style={{
          background: '#151421',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          padding: '24px 32px',
          borderRadius: '20px',
          textAlign: 'center',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{gameStatus === 'won' ? '🎉 You Got It!' : `😢 Game Over!`}</h2>
          <p style={{ color: '#a7a9be', marginBottom: '16px' }}>The word was: <strong style={{ color: '#a78bfa' }}>{solution}</strong></p>
          <button onClick={() => window.location.reload()} style={{
            background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
            color: '#0f0e17',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Play Again</button>
        </div>
      )}

      {/* Keyboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '440px' }}>
        {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
            {rIdx === 2 && <button onClick={() => handleVirtualKey('ENTER')} style={{ ...getKeyStyle('ENTER'), fontSize: '0.75rem' }}>ENTER</button>}
            {row.split('').map((char) => (
              <button key={char} onClick={() => handleVirtualKey(char)} style={getKeyStyle(char)}>
                {char}
              </button>
            ))}
            {rIdx === 2 && <button onClick={() => handleVirtualKey('BACK')} style={{ ...getKeyStyle('BACK'), fontSize: '0.75rem' }}>⌫</button>}
          </div>
        ))}
      </div>
    </main>
  );
}