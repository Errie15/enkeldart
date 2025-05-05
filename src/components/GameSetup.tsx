'use client';

import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';

export default function GameSetup() {
  const { 
    players, 
    setPlayerCount, 
    updatePlayerName, 
    startGame, 
    gameSettings, 
    setDoubleOut,
    setInitialScore,
    setGameMode,
    setIncludeOuterBull,
    setCombinedBullseye
  } = useGameContext();
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

  const handleInitialScoreChange = (score: number) => {
    setInitialScore(score);
  };

  const handleGameModeChange = (mode: 'standard' | 'aroundTheClock') => {
    setGameMode(mode);
  };

  const handleIncludeOuterBullChange = (include: boolean) => {
    setIncludeOuterBull(include);
  };

  const handleCombinedBullseyeChange = (combined: boolean) => {
    if (combined) {
      setIncludeOuterBull(true); // Ensure inclusion of bullseye when using combined mode
    }
    setCombinedBullseye(combined);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Nytt spel</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Spelläge:
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleGameModeChange('standard')}
              className={`flex-1 py-3 rounded-lg ${
                gameSettings.gameMode === 'standard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => handleGameModeChange('aroundTheClock')}
              className={`flex-1 py-3 rounded-lg ${
                gameSettings.gameMode === 'aroundTheClock'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
              }`}
            >
              Around the Clock
            </button>
          </div>
        </div>
        
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
        
        {gameSettings.gameMode === 'standard' && (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Startpoäng:
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleInitialScoreChange(301)}
                  className={`flex-1 py-3 rounded-lg ${
                    gameSettings.initialScore === 301
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
                  }`}
                >
                  301
                </button>
                <button
                  onClick={() => handleInitialScoreChange(501)}
                  className={`flex-1 py-3 rounded-lg ${
                    gameSettings.initialScore === 501
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
                  }`}
                >
                  501
                </button>
              </div>
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
          </>
        )}
        
        {gameSettings.gameMode === 'aroundTheClock' && (
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Inkludera bullseye:
            </label>
            <div className="flex space-x-2 mb-3">
              <button
                onClick={() => handleIncludeOuterBullChange(true)}
                className={`flex-1 py-3 rounded-lg ${
                  gameSettings.includeOuterBull
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
                }`}
              >
                Ja
              </button>
              <button
                onClick={() => handleIncludeOuterBullChange(false)}
                className={`flex-1 py-3 rounded-lg ${
                  !gameSettings.includeOuterBull
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
                }`}
              >
                Nej (1-20)
              </button>
            </div>
            
            {gameSettings.includeOuterBull && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Typ av bullseye:
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCombinedBullseyeChange(false)}
                    className={`flex-1 py-3 rounded-lg ${
                      !gameSettings.combinedBullseye
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
                    }`}
                  >
                    Separata (21-22)
                  </button>
                  <button
                    onClick={() => handleCombinedBullseyeChange(true)}
                    className={`flex-1 py-3 rounded-lg ${
                      gameSettings.combinedBullseye
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
                    }`}
                  >
                    Kombinerad (Y/B)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
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