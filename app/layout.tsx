'use client';

import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isUpsideDown, setIsUpsideDown] = useState(false);

  useEffect(() => {
    const konamiCode = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    let cursor = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === konamiCode[cursor].toLowerCase()) {
        cursor++;
        if (cursor === konamiCode.length) {
          setIsUpsideDown((prev) => !prev);
          cursor = 0;
        }
      } else {
        cursor = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <html lang="en">
      <body
        style={{
          transform: isUpsideDown ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.5s ease',
          minHeight: '100vh',
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}