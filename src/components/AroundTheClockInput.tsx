'use client';

import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';

export default function AroundTheClockInput() {
  const { registerHit, currentPlayer, nextPlayer, gameSettings } = useGameContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [throwsLeft, setThrowsLeft] = useState(3);
  const [statusMessage, setStatusMessage] = useState('');
  
  if (!currentPlayer) return null;
  
  const handleNumberClick = (num: number) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const isLastThrow = throwsLeft === 1;
    
    // Registrera träffen
    registerHit(num);
    
    // Uppdatera antal kast kvar
    setThrowsLeft(prev => Math.max(0, prev - 1));
    
    // Om spelaren träffade sitt mål, visa meddelande
    if (num === currentPlayer.currentTarget) {
      setStatusMessage(`Träff på ${num}! Nästa mål: ${currentPlayer.currentTarget! + 1}`);
      
      setTimeout(() => {
        setIsSubmitting(false);
        
        if (isLastThrow) {
          setStatusMessage('Turen går vidare...');
          setTimeout(() => {
            nextPlayer();
            setThrowsLeft(3);
            setStatusMessage('');
          }, 800);
        }
      }, 500);
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        
        if (isLastThrow) {
          setStatusMessage('Turen går vidare...');
          setTimeout(() => {
            nextPlayer();
            setThrowsLeft(3);
            setStatusMessage('');
          }, 800);
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
          className={`w-16 h-16 rounded-full text-xl font-bold flex items-center justify-center
            ${isTarget ? 'border-4 border-yellow-400' : 'border-none'}
            ${isCompleted ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-white hover:bg-gray-700'}
          `}
        >
          {i}
        </button>
      );
    }
    
    // Andra raden: 9-16
    const secondRow = [];
    for (let i = 9; i <= 16; i++) {
      const isTarget = i === currentPlayer.currentTarget;
      const isCompleted = currentPlayer.hitsInOrder?.includes(i);
      
      secondRow.push(
        <button
          key={i}
          onClick={() => handleNumberClick(i)}
          disabled={isSubmitting || isCompleted || throwsLeft === 0}
          className={`w-16 h-16 rounded-full text-xl font-bold flex items-center justify-center
            ${isTarget ? 'border-4 border-yellow-400' : 'border-none'}
            ${isCompleted ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-white hover:bg-gray-700'}
          `}
        >
          {i}
        </button>
      );
    }
    
    // Tredje raden: 17-20 (och bulls om aktiverat)
    const thirdRow = [];
    for (let i = 17; i <= 20; i++) {
      const isTarget = i === currentPlayer.currentTarget;
      const isCompleted = currentPlayer.hitsInOrder?.includes(i);
      
      thirdRow.push(
        <button
          key={i}
          onClick={() => handleNumberClick(i)}
          disabled={isSubmitting || isCompleted || throwsLeft === 0}
          className={`w-16 h-16 rounded-full text-xl font-bold flex items-center justify-center
            ${isTarget ? 'border-4 border-yellow-400' : 'border-none'}
            ${isCompleted ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-white hover:bg-gray-700'}
          `}
        >
          {i}
        </button>
      );
    }
    
    // Lägg till bullseye-knappar om de behövs, i en separat rad
    const bullsRow = [];
    if (gameSettings.includeOuterBull) {
      if (gameSettings.combinedBullseye) {
        // Kombinerad bull (21) med delad färg (grön/röd)
        const isBullTarget = currentPlayer.currentTarget === 21;
        const isBullCompleted = currentPlayer.hitsInOrder?.includes(21);
        
        bullsRow.push(
          <button
            key="combinedBull"
            onClick={() => handleNumberClick(21)}
            disabled={isSubmitting || isBullCompleted || throwsLeft === 0}
            className={`w-16 h-16 rounded-full text-xl font-bold flex items-center justify-center relative overflow-hidden
              ${isBullTarget ? 'border-4 border-yellow-400' : 'border-none'}
              ${isBullCompleted ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-white hover:bg-gray-700'}
            `}
          >
            {isBullTarget && <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-pulse"></div>}
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
            className={`w-16 h-16 rounded-full text-xl font-bold flex items-center justify-center
              ${isOuterBullTarget ? 'border-4 border-yellow-400' : 'border-none'}
              ${isOuterBullCompleted ? 'bg-gray-700 text-gray-400' : 'bg-green-600 text-white hover:bg-green-500'}
            `}
          >
            {isOuterBullTarget && <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-pulse"></div>}
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
            className={`w-16 h-16 rounded-full text-xl font-bold flex items-center justify-center relative
              ${isInnerBullTarget ? 'border-4 border-yellow-400' : 'border-none'}
              ${isInnerBullCompleted ? 'bg-gray-700 text-gray-400' : 'bg-red-600 text-white hover:bg-red-500'}
            `}
          >
            {isInnerBullTarget && <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-pulse"></div>}
            Bull
          </button>
        );
      }
    }
    
    numbers.push(
      <div key="row1" className="flex justify-center gap-4 mb-4">{firstRow}</div>,
      <div key="row2" className="flex justify-center gap-4 mb-4">{secondRow}</div>,
      <div key="row3" className="flex justify-center gap-4 mb-4">{thirdRow}</div>
    );
    
    if (bullsRow.length > 0) {
      numbers.push(<div key="bulls" className="flex justify-center gap-4">{bullsRow}</div>);
    }
    
    return numbers;
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-6 bg-gray-900 rounded-lg shadow">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-300">
              Kast kvar: {throwsLeft}
            </div>
            <div className="text-lg font-bold text-blue-300">
              {currentPlayer.name} <span className="text-gray-300">Mål: {currentPlayer.currentTarget}</span>
            </div>
          </div>
          
          {throwsLeft < 3 && (
            <button
              onClick={handleNextPlayer}
              className="px-3 py-1 text-white font-bold rounded-lg text-sm bg-gray-700 hover:bg-gray-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Byter...' : 'Nästa spelare'}
            </button>
          )}
        </div>
        
        {statusMessage && (
          <div className="mb-4 p-2 bg-blue-900 text-blue-300 rounded-lg text-sm font-medium text-center">
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