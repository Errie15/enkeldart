'use client';

import React from 'react';
import { useGameContext } from '../contexts/GameContext';
import { Player } from '../utils/dartGameUtils';

export default function PlayerScoreboard() {
  const { players, currentPlayerIndex, getCheckoutOptions, nextPlayer } = useGameContext();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        {players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            isActive={index === currentPlayerIndex}
            checkoutOptions={getCheckoutOptions(player)}
          />
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button
          onClick={nextPlayer}
          style={{ background: 'var(--accent)', color: 'var(--text)' }}
          className="px-6 py-2 font-bold rounded-lg shadow"
        >
          {players.length === 1 ? "Nästa omgång" : "Nästa spelare"}
        </button>
      </div>
    </div>
  );
}

function PlayerCard({ player, isActive, checkoutOptions }: { 
  player: Player; 
  isActive: boolean;
  checkoutOptions: string[];
}) {
  // Get the last round of throws
  const lastRound = player.history[player.history.length - 1] || [];
  
  // Calculate round score
  const roundScore = lastRound.reduce((sum, score) => sum + (score > 0 ? score : 0), 0);
  
  // Check if there was a bust
  const hasBust = lastRound.some(score => score < 0);

  return (
    <div
      className={`p-4 rounded-lg shadow relative`}
      style={{
        background: isActive ? 'var(--secondary)' : 'var(--bg)',
        border: isActive ? '2px solid var(--accent)' : 'none',
      }}
    >
      {isActive && (
        <div
          className="absolute -top-3 -left-2 text-xs px-2 py-1 rounded-full font-bold z-10 animate-pulse"
          style={{ background: 'var(--accent)', color: 'var(--text)' }}
        >
          Aktiv spelare
        </div>
      )}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold" style={{ color: isActive ? 'var(--accent)' : 'var(--text)' }}>
          {player.name}
        </h3>
        <div className="text-2xl font-bold" style={{ color: 'var(--accent)', fontWeight: 700 }}>{player.score}</div>
      </div>
      
      {isActive && (
        <>
          {lastRound.length > 0 && (
            <div className="mt-2 flex justify-between text-sm">
              <div className="flex space-x-2">
                {lastRound.map((score, idx) => (
                  <span 
                    key={idx} 
                    className={`px-2 py-1 rounded ${
                      score < 0 
                        ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300' 
                        : score === 0
                          ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          : 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}
                  >
                    {score === 0 ? 'Miss' : Math.abs(score)}
                  </span>
                ))}
              </div>
              {!hasBust && (
                <span className="px-2 py-1 bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
                  {roundScore}
                </span>
              )}
              {hasBust && (
                <span className="px-2 py-1 bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300 rounded">
                  Bust!
                </span>
              )}
            </div>
          )}
          
          {checkoutOptions.length > 0 && (
            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Möjliga utgångar:</p>
              <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                {checkoutOptions.map((option, idx) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
} 