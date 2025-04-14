'use client';

import React, { useEffect, useRef } from 'react';
import { useGameContext } from '../contexts/GameContext';
import GameSetup from './GameSetup';
import PlayerScoreboard from './PlayerScoreboard';
import ScoreInput from './ScoreInput';
import GameOver from './GameOver';

export default function DartGame() {
  const { gameState, gameSettings, currentPlayer } = useGameContext();
  const prevHistoryLengthRef = useRef<number>(0);
  
  // Play sound on bust
  useEffect(() => {
    if (gameState === 'playing' && currentPlayer && currentPlayer.history && currentPlayer.history.length > 0) {
      const lastRound = currentPlayer.history[currentPlayer.history.length - 1] || [];
      
      // Only play sound if we have a new bust (history length changed)
      if (lastRound.some(score => score < 0) && 
          (prevHistoryLengthRef.current !== currentPlayer.history.length || 
           prevHistoryLengthRef.current === 0)) {
        
        try {
          if (typeof window !== 'undefined' && 'AudioContext' in window) {
            const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

            
            // Create a "bust" sound - a quick descending tone
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
          }
        } catch (e) {
          console.log('Error with audio:', e);
        }
      }
      
      // Update the ref for the next render
      prevHistoryLengthRef.current = currentPlayer.history.length;
    }
  }, [gameState, currentPlayer]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-md mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Enkelt Dartspel
        </h1>
        
        {gameState === 'playing' && (
          <div className="mt-4 flex justify-center">
            <div className={`px-4 py-2 rounded-full ${
              gameSettings.doubleOut 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            }`}>
              {gameSettings.doubleOut ? 'Dubbel ut' : 'Singel ut'}
            </div>
          </div>
        )}
      </div>
      
      {gameState === 'setup' && <GameSetup />}
      
      {gameState === 'playing' && (
        <div className="space-y-6">
          <PlayerScoreboard />
          <ScoreInput />
        </div>
      )}
      
      {gameState === 'finished' && <GameOver />}
    </div>
  );
} 