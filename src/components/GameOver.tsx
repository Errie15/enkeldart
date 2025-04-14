'use client';

import React, { useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';

export default function GameOver() {
  const { winner, resetGame } = useGameContext();

  useEffect(() => {
    // Create and play a win sound using the AudioContext API
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const audioContext = new (
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
        
        
        // Create a victory sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.5);
      }
    } catch (e) {
      console.log('Error with audio:', e);
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Spelet är slut!</h2>
        
        {winner && (
          <div className="py-8">
            <div className="text-xl text-gray-700 dark:text-gray-300 mb-2">
              Vinnare:
            </div>
            <div className="text-3xl font-bold text-green-600">
              {winner.name}
            </div>
            <div className="mt-4 text-lg text-gray-700 dark:text-gray-300">
              Från {winner.initialScore} till 0
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={resetGame}
            className="w-full p-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 shadow"
          >
            Nytt spel
          </button>
        </div>
      </div>
    </div>
  );
} 