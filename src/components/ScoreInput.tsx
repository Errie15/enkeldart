'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { evaluateExpression } from '../utils/mathExpressionParser';

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
      className="w-full h-12 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 shadow"
      disabled={isSubmitting || playerChangePending.current}
    >
      {num}
    </button>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-md font-bold text-gray-800 dark:text-white">Kast kvar: {throwsLeft}</span>
        </div>
        <div className="mb-3 flex justify-between items-center">
          {throwsLeft < 3 && !pendingNextPlayer && (
            <button
              onClick={handleNextPlayer}
              className={`px-3 py-1 text-white font-bold rounded-lg text-sm ml-auto ${
                isSubmitting || playerChangePending.current
                  ? 'bg-gray-400 dark:bg-gray-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              disabled={isSubmitting || playerChangePending.current}
            >
              {isSubmitting ? 'Byter...' : 'Nästa spelare'}
            </button>
          )}
        </div>

        {statusMessage && (
          <div className="mb-3 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium text-center">
            {statusMessage}
          </div>
        )}

        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg mb-4 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold dark:text-white">{currentScore || '0'}</span>
            {calculatedValue !== null && (
              <span className="text-sm text-gray-600 dark:text-gray-300">= {calculatedValue}</span>
            )}
          </div>
          {currentScore && (
            <button 
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
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
            className={`w-full h-12 text-white font-bold rounded-lg shadow ${
              isSubmitting || playerChangePending.current 
                ? 'bg-red-400 dark:bg-red-700' 
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
            }`}
            disabled={throwsLeft === 0 || isSubmitting || playerChangePending.current}
          >
            {isSubmitting ? 'Registrerar...' : 'Miss'}
          </button>
          
          {renderNumberButton(0)}
          
          <button
            onClick={handleOperatorClick}
            className="w-full h-12 bg-gray-500 text-white text-xl font-bold rounded-lg hover:bg-gray-600 active:bg-gray-700 shadow"
            disabled={isSubmitting || playerChangePending.current}
          >
            x
          </button>
        </div>
        
        <div className="mt-2">
          <button
            onClick={handleSubmit}
            className={`w-full h-12 text-white text-md font-bold rounded-lg shadow ${
              isSubmitting || playerChangePending.current
                ? 'bg-green-400 dark:bg-green-700' 
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
            }`}
            disabled={throwsLeft === 0 || isSubmitting || playerChangePending.current || !currentScore}
          >
            {isSubmitting ? 'Registrerar...' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}
