'use client';

import React, { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';

export default function AroundTheClockInput() {
  const { registerHit, currentPlayer, nextPlayer, gameSettings } = useGameContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [throwsLeft, setThrowsLeft] = useState(3);
  const [statusMessage, setStatusMessage] = useState('');
  const [pendingNextPlayer, setPendingNextPlayer] = useState(false);
  
  useEffect(() => {
    if (!currentPlayer) return;
    if (pendingNextPlayer && throwsLeft === 0) {
      setStatusMessage('Turen går vidare...');
      setTimeout(() => {
        nextPlayer();
        setThrowsLeft(3);
        setStatusMessage('');
        setIsSubmitting(false);
        setPendingNextPlayer(false);
      }, 800);
    }
  }, [pendingNextPlayer, throwsLeft, nextPlayer, currentPlayer]);

  if (!currentPlayer) return null;
  
  const handleNumberClick = (num: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const isLastThrow = throwsLeft === 1;
    registerHit(num);
    setThrowsLeft(prev => Math.max(0, prev - 1));
    if (num === currentPlayer.currentTarget) {
      setStatusMessage(`Träff på ${num}! Nästa mål: ${currentPlayer.currentTarget! + 1}`);
      setTimeout(() => {
        setIsSubmitting(false);
        if (isLastThrow) {
          setPendingNextPlayer(true);
        }
      }, 500);
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        if (isLastThrow) {
          setPendingNextPlayer(true);
        }
      }, 300);
    }
  };
  
  const handleNextPlayer = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setStatusMessage('Byter spelare...');
    setTimeout(() => {
      nextPlayer();
      setThrowsLeft(3);
      setStatusMessage('');
      setIsSubmitting(false);
    }, 500);
  };
  
  // Skapa layout för dartbrädan
  const renderNumbers = () => {
    const numbers = [];

    // Första raden: 1-8
    const firstRow = [];
    for (let i = 1; i <= 8; i++) {
      const isTarget = i === currentPlayer.currentTarget;
      const isCompleted = currentPlayer.hitsInOrder?.includes(i);
      firstRow.push(
        <button
          key={i}
          onClick={() => handleNumberClick(i)}
          disabled={isSubmitting || isCompleted || throwsLeft === 0}
          style={{
            background: isTarget ? 'var(--secondary)' : 'var(--accent)',
            color: isTarget ? 'var(--accent)' : 'var(--text)',
            border: isTarget ? '2px solid var(--detail)' : 'none',
            fontWeight: isTarget ? 700 : 500,
            opacity: isCompleted ? 0.5 : 1,
          }}
          className="w-10 h-10 rounded-full text-base font-bold flex items-center justify-center"
        >
          {i}
        </button>
      );
    }

    // Andra raden: 9-12
    const secondRow = [];
    for (let i = 9; i <= 12; i++) {
      const isTarget = i === currentPlayer.currentTarget;
      const isCompleted = currentPlayer.hitsInOrder?.includes(i);
      secondRow.push(
        <button
          key={i}
          onClick={() => handleNumberClick(i)}
          disabled={isSubmitting || isCompleted || throwsLeft === 0}
          style={{
            background: isTarget ? 'var(--secondary)' : 'var(--accent)',
            color: isTarget ? 'var(--accent)' : 'var(--text)',
            border: isTarget ? '2px solid var(--detail)' : 'none',
            fontWeight: isTarget ? 700 : 500,
            opacity: isCompleted ? 0.5 : 1,
          }}
          className="w-10 h-10 rounded-full text-base font-bold flex items-center justify-center"
        >
          {i}
        </button>
      );
    }

    // Tredje raden: 13-16
    const thirdRow = [];
    for (let i = 13; i <= 16; i++) {
      const isTarget = i === currentPlayer.currentTarget;
      const isCompleted = currentPlayer.hitsInOrder?.includes(i);
      thirdRow.push(
        <button
          key={i}
          onClick={() => handleNumberClick(i)}
          disabled={isSubmitting || isCompleted || throwsLeft === 0}
          style={{
            background: isTarget ? 'var(--secondary)' : 'var(--accent)',
            color: isTarget ? 'var(--accent)' : 'var(--text)',
            border: isTarget ? '2px solid var(--detail)' : 'none',
            fontWeight: isTarget ? 700 : 500,
            opacity: isCompleted ? 0.5 : 1,
          }}
          className="w-10 h-10 rounded-full text-base font-bold flex items-center justify-center"
        >
          {i}
        </button>
      );
    }

    // Fjärde raden: 17-20
    const fourthRow = [];
    for (let i = 17; i <= 20; i++) {
      const isTarget = i === currentPlayer.currentTarget;
      const isCompleted = currentPlayer.hitsInOrder?.includes(i);
      fourthRow.push(
        <button
          key={i}
          onClick={() => handleNumberClick(i)}
          disabled={isSubmitting || isCompleted || throwsLeft === 0}
          style={{
            background: isTarget ? 'var(--secondary)' : 'var(--accent)',
            color: isTarget ? 'var(--accent)' : 'var(--text)',
            border: isTarget ? '2px solid var(--detail)' : 'none',
            fontWeight: isTarget ? 700 : 500,
            opacity: isCompleted ? 0.5 : 1,
          }}
          className="w-10 h-10 rounded-full text-base font-bold flex items-center justify-center"
        >
          {i}
        </button>
      );
    }

    // Bullseye-rad
    const bullsRow = [];
    if (gameSettings.includeOuterBull) {
      if (gameSettings.combinedBullseye) {
        const isBullTarget = currentPlayer.currentTarget === 21;
        const isBullCompleted = currentPlayer.hitsInOrder?.includes(21);
        bullsRow.push(
          <button
            key="combinedBull"
            onClick={() => handleNumberClick(21)}
            disabled={isSubmitting || isBullCompleted || throwsLeft === 0}
            style={{
              background: isBullTarget ? 'var(--secondary)' : 'var(--accent)',
              color: isBullTarget ? 'var(--accent)' : 'var(--text)',
              border: isBullTarget ? '2px solid var(--detail)' : 'none',
              fontWeight: isBullTarget ? 700 : 500,
              opacity: isBullCompleted ? 0.5 : 1,
            }}
            className="w-10 h-10 rounded-full text-base font-bold flex items-center justify-center relative overflow-hidden"
          >
            {isBullTarget && <div className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-pulse"></div>}
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full bg-green-600"></div>
              <div className="w-1/2 h-full bg-red-600"></div>
            </div>
            <span className="z-10">Y/B</span>
          </button>
        );
      } else {
        // Yttre bull (21)
        const isOuterBullTarget = currentPlayer.currentTarget === 21;
        const isOuterBullCompleted = currentPlayer.hitsInOrder?.includes(21);
        bullsRow.push(
          <button
            key="outerBull"
            onClick={() => handleNumberClick(21)}
            disabled={isSubmitting || isOuterBullCompleted || throwsLeft === 0}
            style={{
              background: isOuterBullTarget ? 'var(--secondary)' : 'var(--accent)',
              color: isOuterBullTarget ? 'var(--accent)' : 'var(--text)',
              border: isOuterBullTarget ? '2px solid var(--detail)' : 'none',
              fontWeight: isOuterBullTarget ? 700 : 500,
              opacity: isOuterBullCompleted ? 0.5 : 1,
            }}
            className="w-10 h-10 rounded-full text-base font-bold flex items-center justify-center"
          >
            {isOuterBullTarget && <div className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-pulse"></div>}
            Yttre
          </button>
        );
        // Inner bull (22)
        const isInnerBullTarget = currentPlayer.currentTarget === 22;
        const isInnerBullCompleted = currentPlayer.hitsInOrder?.includes(22);
        bullsRow.push(
          <button
            key="innerBull"
            onClick={() => handleNumberClick(22)}
            disabled={isSubmitting || isInnerBullCompleted || throwsLeft === 0}
            style={{
              background: isInnerBullTarget ? 'var(--secondary)' : 'var(--accent)',
              color: isInnerBullTarget ? 'var(--accent)' : 'var(--text)',
              border: isInnerBullTarget ? '2px solid var(--detail)' : 'none',
              fontWeight: isInnerBullTarget ? 700 : 500,
              opacity: isInnerBullCompleted ? 0.5 : 1,
            }}
            className="w-10 h-10 rounded-full text-base font-bold flex items-center justify-center relative"
          >
            {isInnerBullTarget && <div className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-pulse"></div>}
            Bull
          </button>
        );
      }
    }

    numbers.push(
      <div key="row1" className="flex justify-center gap-1 mb-2">{firstRow}</div>,
      <div key="row2" className="flex justify-center gap-1 mb-2">{secondRow}</div>,
      <div key="row3" className="flex justify-center gap-1 mb-2">{thirdRow}</div>,
      <div key="row4" className="flex justify-center gap-1 mb-2">{fourthRow}</div>
    );
    if (bullsRow.length > 0) {
      numbers.push(<div key="bulls" className="flex justify-center gap-1">{bullsRow}</div>);
    }
    return numbers;
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-6 rounded-lg shadow" style={{ background: 'var(--bg)' }}>
        <div className="mb-4 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="text-sm font-medium" style={{ color: 'var(--detail)' }}>
              Kast kvar: {throwsLeft}
            </div>
            <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
              {currentPlayer.name} <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>Mål: {currentPlayer.currentTarget}</span>
            </div>
          </div>
          
          {throwsLeft < 3 && (
            <button
              onClick={handleNextPlayer}
              style={{ background: 'var(--secondary)', color: 'var(--bg)' }}
              className="px-3 py-1 font-bold rounded-lg text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Byter...' : 'Nästa spelare'}
            </button>
          )}
        </div>
        
        {statusMessage && (
          <div className="mb-4 p-2 rounded-lg text-sm font-medium text-center" style={{ background: 'var(--accent)', color: 'var(--text)' }}>
            {statusMessage}
          </div>
        )}
        
        <div className="mb-4">
          {renderNumbers()}
        </div>
        
        <div className="pt-2 border-t border-gray-700">
          <div className="text-center text-sm text-gray-400 mb-2">
            Träffa {currentPlayer.currentTarget} för att gå vidare.
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Klarat:</span>
              <span className="text-green-400 ml-2">
                {currentPlayer.hitsInOrder?.join(', ') || 'Inga än'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Kvar:</span>
              <span className="text-blue-400 ml-2">
                {Array.from(
                  { length: 
                    gameSettings.includeOuterBull 
                      ? (gameSettings.combinedBullseye ? 21 : 22) - (currentPlayer.currentTarget || 1) + 1 
                      : 20 - (currentPlayer.currentTarget || 1) + 1 
                  }, 
                  (_, i) => i + (currentPlayer.currentTarget || 1)
                ).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 