'use client';

import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';

export default function GameSetup() {
  const { players, setPlayerCount, updatePlayerName, startGame, gameSettings, setDoubleOut } = useGameContext();
  const [tempCount, setTempCount] = useState(players.length.toString());

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    setTempCount(e.target.value);
    if (count >= 1 && count <= 10) {
      setPlayerCount(count);
    }
  };

  const handleNameChange = (index: number, name: string) => {
    updatePlayerName(index, name);
  };

  const handleDoubleOutChange = (value: boolean) => {
    setDoubleOut(value);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Nytt spel</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Antal spelare:
          </label>
          <select
            value={tempCount}
            onChange={handlePlayerCountChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Utgångsregel:
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleDoubleOutChange(true)}
              className={`flex-1 py-3 rounded-lg ${
                gameSettings.doubleOut
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
              }`}
            >
              Dubbel ut
            </button>
            <button
              onClick={() => handleDoubleOutChange(false)}
              className={`flex-1 py-3 rounded-lg ${
                !gameSettings.doubleOut
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
              }`}
            >
              Singel ut
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Spelarnamn:
          </label>
          <div className="space-y-3">
            {players.map((player, index) => (
              <input
                key={player.id}
                type="text"
                value={player.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Spelare ${index + 1}`}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={startGame}
          className="w-full p-4 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 shadow"
        >
          Börja spela
        </button>
      </div>
    </div>
  );
} 