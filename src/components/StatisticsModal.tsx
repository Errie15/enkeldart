'use client';

import React from 'react';
import { Player, calculatePlayerStatistics } from '../utils/dartGameUtils';
import { useGameContext } from '../contexts/GameContext';

interface StatisticsModalProps {
  player: Player;
  onClose: () => void;
}

export default function StatisticsModal({ player, onClose }: StatisticsModalProps) {
  const { gameSettings } = useGameContext();
  const stats = calculatePlayerStatistics(player);
  
  // Beräkna Around the Clock statistik
  const totalThrows = player.history 
    ? player.history.reduce((total, round) => total + round.length, 0) 
    : 0;
  
  const totalHits = player.hitsInOrder?.length || 0;
  const accuracy = totalThrows > 0 ? (totalHits / totalThrows) * 100 : 0;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Statistik: {player.name}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 py-4">
          <div className="grid grid-cols-1 gap-4">
            {gameSettings.gameMode === 'standard' ? (
              <>
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Slutresultat
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200">
                    Spelet avslutades på <span className="font-bold">{stats.totalThrows} kast</span>
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                    Genomsnitt per runda
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-bold">{stats.averagePerRound.toFixed(1)} poäng</span> per runda (3 kast)
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">
                    Genomsnitt per kast
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-bold">{stats.averagePerThrow.toFixed(1)} poäng</span> per kast
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Slutresultat
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200">
                    Träffade alla mål på <span className="font-bold">{totalThrows} kast</span>
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                    Träffsäkerhet
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-bold">{accuracy.toFixed(1)}%</span> av kasten träffade målet
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">
                    Träffade nummer
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-bold">{player.hitsInOrder?.join(', ')}</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
} 