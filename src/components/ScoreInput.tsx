'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { evaluateExpression } from '../utils/mathExpressionParser';
import { useSpeechRecognition } from '../utils/speechRecognition';

export default function ScoreInput() {
  const { addScore, currentPlayer, nextPlayer } = useGameContext();
  const [currentScore, setCurrentScore] = useState('');
  const [throwsLeft, setThrowsLeft] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);
  const playerChangePending = useRef(false);
  const [pendingNextPlayer, setPendingNextPlayer] = useState(false);
  const lastPlayerId = useRef<string | number | null>(null);
  const speech = useSpeechRecognition();

  useEffect(() => {
    // Återställ kast kvar endast när det är en ny spelare
    if (currentPlayer && currentPlayer.id !== lastPlayerId.current) {
      setThrowsLeft(3);
      setStatusMessage('');
      setIsSubmitting(false);
      playerChangePending.current = false;
      setCurrentScore('');
      setCalculatedValue(null);
      setPendingNextPlayer(false);
      lastPlayerId.current = currentPlayer.id;
    }
  }, [currentPlayer]);
  
  useEffect(() => {
    // Check if input contains operators and calculate result
    if (currentScore && /[x]/.test(currentScore)) {
      const result = evaluateExpression(currentScore);
      setCalculatedValue(result);
    } else {
      setCalculatedValue(null);
    }
  }, [currentScore]);

  useEffect(() => {
    if (throwsLeft === 0) {
      setStatusMessage('Turen går vidare...');
      setTimeout(() => {
        nextPlayer();
        setThrowsLeft(3);
        setStatusMessage('');
        setIsSubmitting(false);
        setPendingNextPlayer(false);
        playerChangePending.current = false;
      }, 800);
    }
  }, [throwsLeft, nextPlayer]);

  useEffect(() => {
    if (speech.transcript) {
      // Försök tolka talet som en siffra (eller uttryck)
      const cleaned = speech.transcript.replace(/[^0-9x]/gi, '').replace(/x/gi, 'x');
      if (cleaned) setCurrentScore(cleaned);
    }
  }, [speech.transcript]);

  const handleNumberClick = (num: number) => {
    if (isSubmitting || playerChangePending.current || currentScore.length >= 10) return;
    const newScore = currentScore + num.toString();
    setCurrentScore(newScore);
  };

  const handleOperatorClick = () => {
    if (isSubmitting || playerChangePending.current || currentScore.length >= 10) return;
    if (currentScore === '') return; // Prevent starting with an operator
    
    // Don't add operator if the last character is already an operator
    const lastChar = currentScore.slice(-1);
    if (/[x]/.test(lastChar)) return;
    
    setCurrentScore(currentScore + 'x');
  };

  const handleDelete = () => {
    if (isSubmitting || playerChangePending.current) return;
    setCurrentScore(currentScore.slice(0, -1));
  };

  const registerScore = (score: number) => {
    addScore(score);
    setCurrentScore('');
    setCalculatedValue(null);
    setThrowsLeft(prev => Math.max(0, prev - 1));
  };
  
  const handleSubmit = () => {
    if (isSubmitting || playerChangePending.current) return;
    if (!currentScore) return;

    let scoreToRegister: number;

    // If we have a calculated value, use that
    if (calculatedValue !== null) {
      scoreToRegister = calculatedValue;
    } else {
      // Otherwise parse the input as a number
      scoreToRegister = parseInt(currentScore);
    }

    // Validate score
    if (isNaN(scoreToRegister) || scoreToRegister < 0 || scoreToRegister > 180) {
      setStatusMessage('Ogiltig poäng. Måste vara mellan 0-180.');
      setTimeout(() => setStatusMessage(''), 2000);
      return;
    }

    setIsSubmitting(true);
    const isLastThrow = throwsLeft === 1;

    setTimeout(() => {
      registerScore(scoreToRegister);

      if (isLastThrow) {
        playerChangePending.current = true;
        setStatusMessage(`${scoreToRegister} poäng registrerat!`);
        setPendingNextPlayer(true);
      } else {
        setIsSubmitting(false);
      }
    }, 100);
  };

  const handleMiss = () => {
    if (isSubmitting || playerChangePending.current) return;

    setIsSubmitting(true);
    const isLastThrow = throwsLeft === 1;

    setTimeout(() => {
      registerScore(0);

      if (isLastThrow) {
        playerChangePending.current = true;
        setStatusMessage('Miss registrerad!');
        setPendingNextPlayer(true);
      } else {
        setIsSubmitting(false);
      }
    }, 100);
  };

  const handleNextPlayer = () => {
    if (isSubmitting || playerChangePending.current) return;
    setIsSubmitting(true);
    playerChangePending.current = true;
    setStatusMessage('Byter spelare...');
    setTimeout(() => {
      nextPlayer();
    }, 500);
  };

  const renderNumberButton = (num: number) => (
    <button
      key={num}
      onClick={() => handleNumberClick(num)}
      style={{ background: 'var(--secondary)', color: 'var(--bg)' }}
      className="w-full h-12 font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 shadow"
      disabled={isSubmitting || playerChangePending.current}
    >
      {num}
    </button>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="p-4 rounded-lg shadow" style={{ background: 'var(--bg)' }}>
        <div className="mb-2 flex justify-between items-center">
          <span className="text-md font-bold" style={{ color: 'var(--detail)' }}>Kast kvar: {throwsLeft}</span>
        </div>
        <div className="mb-3 flex justify-between items-center">
          {throwsLeft < 3 && !pendingNextPlayer && (
            <button
              onClick={handleNextPlayer}
              style={{ background: 'var(--secondary)', color: 'var(--bg)' }}
              className="px-3 py-1 font-bold rounded-lg text-sm ml-auto"
              disabled={isSubmitting || playerChangePending.current}
            >
              {isSubmitting ? 'Byter...' : 'Nästa spelare'}
            </button>
          )}
        </div>

        {statusMessage && (
          <div className="mb-3 p-2 rounded-lg text-sm font-medium text-center" style={{ background: 'var(--accent)', color: 'var(--text)' }}>
            {statusMessage}
          </div>
        )}

        <div className="p-4 rounded-lg mb-4 h-16 flex items-center justify-between" style={{ background: 'var(--secondary)', color: 'var(--bg)' }}>
          <div className="flex flex-col">
            <span className="text-2xl font-bold" style={{ color: 'var(--bg)' }}>{currentScore || '0'}</span>
            {calculatedValue !== null && (
              <span className="text-sm" style={{ color: 'var(--detail)' }}>= {calculatedValue}</span>
            )}
          </div>
          {currentScore && (
            <button 
              onClick={handleDelete}
              style={{ color: 'var(--accent)' }}
              disabled={isSubmitting || playerChangePending.current}
            >
              ⌫
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          {[7, 8, 9].map(renderNumberButton)}
          {[4, 5, 6].map(renderNumberButton)}
          {[1, 2, 3].map(renderNumberButton)}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleMiss}
            style={{ background: 'var(--accent)', color: 'var(--text)' }}
            className="w-full h-12 font-bold rounded-lg shadow"
            disabled={throwsLeft === 0 || isSubmitting || playerChangePending.current}
          >
            {isSubmitting ? 'Registrerar...' : 'Miss'}
          </button>
          
          {renderNumberButton(0)}
          
          <button
            onClick={handleOperatorClick}
            style={{ background: 'var(--secondary)', color: 'var(--bg)' }}
            className="w-full h-12 text-xl font-bold rounded-lg shadow"
            disabled={isSubmitting || playerChangePending.current}
          >
            x
          </button>
        </div>
        
        <div className="mt-2">
          <button
            onClick={handleSubmit}
            style={{ background: 'var(--highlight)', color: 'var(--text)' }}
            className="w-full h-12 text-md font-bold rounded-lg shadow"
            disabled={throwsLeft === 0 || isSubmitting || playerChangePending.current || !currentScore}
          >
            {isSubmitting ? 'Registrerar...' : 'OK'}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={speech.status === 'listening' ? speech.stopListening : speech.startListening}
            style={{ background: 'var(--accent)', color: 'var(--text)', border: 'none', outline: 'none' }}
            className={`rounded-full p-2 shadow ${speech.status === 'listening' ? 'animate-pulse' : ''}`}
            aria-label={speech.status === 'listening' ? 'Stoppa röstinmatning' : 'Starta röstinmatning'}
          >
            {speech.status === 'listening' ? '🎤...' : '🎤'}
          </button>
          <span className="text-sm font-medium" style={{ color: 'var(--detail)' }}>
            {speech.status === 'listening' && 'Lyssnar...'}
            {speech.status === 'unsupported' && 'Taligenkänning stöds ej'}
            {speech.status === 'error' && (speech.error || 'Fel vid taligenkänning')}
            {speech.status === 'idle' && speech.transcript && `Hörde: "${speech.transcript}"`}
          </span>
        </div>
      </div>
    </div>
  );
}
