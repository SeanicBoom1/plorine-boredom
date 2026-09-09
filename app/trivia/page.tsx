'use client';

import { useState, useEffect } from 'react';

const RAW_QUESTIONS = [
  { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], answer: 'Canberra' },
  { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 'Mars' },
  { question: 'What is the chemical symbol for gold?', options: ['Ag', 'Fe', 'Au', 'Cu'], answer: 'Au' },
  { question: 'Who wrote the play "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'], answer: 'William Shakespeare' },
  { question: 'What is the fastest land animal in the world?', options: ['Lion', 'Cheetah', 'Pronghorn', 'Leopard'], answer: 'Cheetah' },
  { question: 'Which country has the largest population in the world?', options: ['India', 'China', 'USA', 'Indonesia'], answer: 'India' },
  { question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], answer: 'Diamond' },
  { question: 'What year did the Titanic sink in the Atlantic Ocean?', options: ['1910', '1912', '1915', '1920'], answer: '1912' },
  { question: 'Which gas makes up the majority of Earth’s atmosphere?', options: ['Oxygen', 'Hydrogen', 'Carbon Dioxide', 'Nitrogen'], answer: 'Nitrogen' },
  { question: 'Who painted the Mona Lisa?', options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'], answer: 'Leonardo da Vinci' },
  { question: 'What is the capital of Japan?', options: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'], answer: 'Tokyo' },
  { question: 'Which ocean is the largest on Earth?', options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'], answer: 'Pacific Ocean' },
  { question: 'How many bones are in the adult human body?', options: ['196', '206', '216', '226'], answer: '206' },
  { question: 'What is the main ingredient in traditional guacamole?', options: ['Tomato', 'Avocado', 'Peas', 'Cilantro'], answer: 'Avocado' },
  { question: 'Which element has the chemical symbol "O"?', options: ['Gold', 'Oxygen', 'Osmium', 'Zinc'], answer: 'Oxygen' },
  { question: 'In what country is the ancient city of Petra located?', options: ['Egypt', 'Jordan', 'Greece', 'Turkey'], answer: 'Jordan' },
  { question: 'What is the smallest planet in our solar system?', options: ['Mars', 'Venus', 'Mercury', 'Pluto'], answer: 'Mercury' },
  { question: 'Who discovered penicillin in 1928?', options: ['Marie Curie', 'Alexander Fleming', 'Albert Einstein', 'Isaac Newton'], answer: 'Alexander Fleming' },
  { question: 'What is the national sport of Canada?', options: ['Basketball', 'Lacrosse', 'Ice Hockey', 'Curling'], answer: 'Ice Hockey' },
  { question: 'Which US state is known as the Sunshine State?', options: ['California', 'Texas', 'Florida', 'Hawaii'], answer: 'Florida' },
  { question: 'What is the tallest mountain in the world?', options: ['K2', 'Mount Kilimanjaro', 'Mount Everest', 'Denali'], answer: 'Mount Everest' },
  { question: 'Which artist cut off part of his own ear in 1888?', options: ['Claude Monet', 'Vincent van Gogh', 'Salvador Dali', 'Rembrandt'], answer: 'Vincent van Gogh' },
  { question: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], answer: 'Ottawa' },
  { question: 'Which superhero is known as the Caped Crusader?', options: ['Superman', 'Iron Man', 'Batman', 'Spider-Man'], answer: 'Batman' },
  { question: 'What is the freezing point of water in Celsius?', options: ['0°C', '32°C', '-10°C', '100°C'], answer: '0°C' },
  { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], answer: 'Mercury' },
  { question: 'What is the largest mammal in the world?', options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'], answer: 'Blue Whale' },
  { question: 'In which fictional city does Batman live?', options: ['Metropolis', 'Gotham City', 'Star City', 'Central City'], answer: 'Gotham City' },
  { question: 'What is the chemical symbol for silver?', options: ['Ag', 'Au', 'Si', 'Pt'], answer: 'Ag' },
  { question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answer: '6' },
  { question: 'Who wrote "Harry Potter"?', options: ['J.R.R. Tolkien', 'J.K. Rowling', 'Stephen King', 'C.S. Lewis'], answer: 'J.K. Rowling' },
  { question: 'What is the longest river in the world?', options: ['Amazon River', 'Nile River', 'Mississippi River', 'Yangtze River'], answer: 'Nile River' },
  { question: 'Which country gifted the Statue of Liberty to the US?', options: ['United Kingdom', 'France', 'Spain', 'Italy'], answer: 'France' },
  { question: 'What is the capital of Italy?', options: ['Venice', 'Milan', 'Rome', 'Florence'], answer: 'Rome' },
  { question: 'Which bird is universally known as a symbol of peace?', options: ['Eagle', 'Dove', 'Swan', 'Owl'], answer: 'Dove' },
  { question: 'What is the currency of the United Kingdom?', options: ['Euro', 'Dollar', 'Pound Sterling', 'Franc'], answer: 'Pound Sterling' },
  { question: 'How many players are on the field for one soccer team?', options: ['9', '10', '11', '12'], answer: '11' },
  { question: 'What is the primary language spoken in Brazil?', options: ['Spanish', 'Portuguese', 'English', 'French'], answer: 'Portuguese' },
  { question: 'Which desert is the largest hot desert in the world?', options: ['Gobi Desert', 'Kalahari Desert', 'Sahara Desert', 'Mojave Desert'], answer: 'Sahara Desert' },
  { question: 'What is the chemical formula for water?', options: ['CO2', 'H2O', 'NaCl', 'O2'], answer: 'H2O' },
  { question: 'Who was the first person to walk on the Moon?', options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'], answer: 'Neil Armstrong' },
  { question: 'What is the capital of Egypt?', options: ['Alexandria', 'Cairo', 'Luxor', 'Giza'], answer: 'Cairo' },
  { question: 'Which metal is liquid at room temperature?', options: ['Iron', 'Mercury', 'Aluminum', 'Lead'], answer: 'Mercury' },
  { question: 'What is the name of the galaxy that contains our solar system?', options: ['Andromeda', 'Milky Way', 'Sombrero', 'Triangulum'], answer: 'Milky Way' },
  { question: 'How many colors are in a rainbow?', options: ['5', '6', '7', '8'], answer: '7' },
  { question: 'Which instrument has 88 keys?', options: ['Guitar', 'Violin', 'Piano', 'Flute'], answer: 'Piano' },
  { question: 'What is the main component of the sun?', options: ['Liquid magma', 'Hydrogen', 'Oxygen', 'Carbon'], answer: 'Hydrogen' },
  { question: 'Which continent is the driest inhabited continent on Earth?', options: ['Africa', 'Australia', 'Antarctica', 'Asia'], answer: 'Australia' },
  { question: 'What is the speed of light approximately?', options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s'], answer: '300,000 km/s' },
  { question: 'Which animal is known as the "Ship of the Desert"?', options: ['Horse', 'Elephant', 'Camel', 'Donkey'], answer: 'Camel' },
  { question: 'What year did World War II end?', options: ['1943', '1945', '1950', '1939'], answer: '1945' },
  { question: 'Which organ in the human body pumps blood?', options: ['Lungs', 'Brain', 'Heart', 'Liver'], answer: 'Heart' },
  { question: 'What is the capital of Spain?', options: ['Barcelona', 'Madrid', 'Seville', 'Valencia'], answer: 'Madrid' },
  { question: 'Which element is diamond made of?', options: ['Carbon', 'Silicon', 'Calcium', 'Graphite'], answer: 'Carbon' },
  { question: 'What is the largest island in the world?', options: ['Madagascar', 'Borneo', 'Greenland', 'New Guinea'], answer: 'Greenland' }
];

// Helper to shuffle array randomly
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function TriviaPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // Shuffle questions and their options on mount/restart
  const startNewGame = () => {
    const randomizedQuestions = shuffleArray(RAW_QUESTIONS).map((q) => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setQuestions(randomizedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsFinished(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleOptionClick = (option) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const correct = option === currentQ.answer;

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
    }, 1000);
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
      {/* Top bar */}
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <a href="/" style={{ color: '#a7a9be', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>← Back</a>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '900', background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Trivia</h1>
        <div style={{ width: '50px' }}></div>
      </div>

      {!isFinished ? (
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', color: '#a7a9be', fontSize: '0.9rem', fontWeight: '600' }}>
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>

          {/* Question Card */}
          <div style={{
            background: '#151421',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            borderRadius: '24px',
            padding: '28px',
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '1.25rem', lineHeight: '1.5', fontWeight: '700' }}>{currentQ.question}</h2>
          </div>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQ.options.map((option, idx) => {
              let bg = '#151421';
              let border = '1px solid rgba(255, 255, 255, 0.05)';

              if (selectedOption !== null) {
                if (option === currentQ.answer) {
                  bg = '#14532d';
                  border = '1px solid #22c55e';
                } else if (option === selectedOption) {
                  bg = '#7f1d1d';
                  border = '1px solid #ef4444';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  style={{
                    background: bg,
                    border: border,
                    color: '#fffffe',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textAlign: 'left',
                    cursor: selectedOption === null ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Completion Card */
        <div style={{
          background: '#151421',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          borderRadius: '24px',
          padding: '40px 32px',
          width: '100%',
          maxWidth: '440px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px' }}>Quiz Complete! 🎉</h2>
          <p style={{ color: '#a7a9be', fontSize: '1.1rem', marginBottom: '24px' }}>
            You scored <strong style={{ color: '#a78bfa' }}>{score}</strong> out of <strong style={{ color: '#fffffe' }}>{questions.length}</strong>
          </p>
          <button
            onClick={startNewGame}
            style={{
              background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
              color: '#0f0e17',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </main>
  );
}