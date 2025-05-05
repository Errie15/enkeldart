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
      <div className="rounded-lg shadow p-6" style={{ background: 'var(--bg)' }}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text)' }}>Nytt spel</h2>
        
        <div className="mb-6">
          <label className="block mb-2" style={{ color: 'var(--detail)' }}>
            Spelläge:
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleGameModeChange('standard')}
              style={{
                background: gameSettings.gameMode === 'standard' ? 'var(--accent)' : 'var(--secondary)',
                color: gameSettings.gameMode === 'standard' ? 'var(--text)' : 'var(--bg)',
              }}
              className="flex-1 py-3 rounded-lg transition-colors"
            >
              Standard
            </button>
            <button
              onClick={() => handleGameModeChange('aroundTheClock')}
              style={{
                background: gameSettings.gameMode === 'aroundTheClock' ? 'var(--accent)' : 'var(--secondary)',
                color: gameSettings.gameMode === 'aroundTheClock' ? 'var(--text)' : 'var(--bg)',
              }}
              className="flex-1 py-3 rounded-lg transition-colors"
            >
              Around the Clock
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2" style={{ color: 'var(--detail)' }}>
            Antal spelare:
          </label>
          <select
            value={tempCount}
            onChange={handlePlayerCountChange}
            className="w-full p-3 border rounded-lg"
            style={{
              background: 'var(--secondary)',
              color: 'var(--bg)',
              borderColor: 'var(--accent)',
            }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num} style={{ color: 'var(--bg)' }}>
                {num}
              </option>
            ))}
          </select>
        </div>
        
        {gameSettings.gameMode === 'standard' && (
          <>
            <div className="mb-6">
              <label className="block mb-2" style={{ color: 'var(--detail)' }}>
                Startpoäng:
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleInitialScoreChange(301)}
                  style={{
                    background: gameSettings.initialScore === 301 ? 'var(--accent)' : 'var(--secondary)',
                    color: gameSettings.initialScore === 301 ? 'var(--text)' : 'var(--bg)',
                  }}
                  className="flex-1 py-3 rounded-lg transition-colors"
                >
                  301
                </button>
                <button
                  onClick={() => handleInitialScoreChange(501)}
                  style={{
                    background: gameSettings.initialScore === 501 ? 'var(--accent)' : 'var(--secondary)',
                    color: gameSettings.initialScore === 501 ? 'var(--text)' : 'var(--bg)',
                  }}
                  className="flex-1 py-3 rounded-lg transition-colors"
                >
                  501
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2" style={{ color: 'var(--detail)' }}>
                Utgångsregel:
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDoubleOutChange(true)}
                  style={{
                    background: gameSettings.doubleOut ? 'var(--accent)' : 'var(--secondary)',
                    color: gameSettings.doubleOut ? 'var(--text)' : 'var(--bg)',
                  }}
                  className="flex-1 py-3 rounded-lg transition-colors"
                >
                  Dubbel ut
                </button>
                <button
                  onClick={() => handleDoubleOutChange(false)}
                  style={{
                    background: !gameSettings.doubleOut ? 'var(--accent)' : 'var(--secondary)',
                    color: !gameSettings.doubleOut ? 'var(--text)' : 'var(--bg)',
                  }}
                  className="flex-1 py-3 rounded-lg transition-colors"
                >
                  Singel ut
                </button>
              </div>
            </div>
          </>
        )}
        
        {gameSettings.gameMode === 'aroundTheClock' && (
          <div className="mb-6">
            <label className="block mb-2" style={{ color: 'var(--detail)' }}>
              Inkludera bullseye:
            </label>
            <div className="flex space-x-2 mb-3">
              <button
                onClick={() => handleIncludeOuterBullChange(true)}
                style={{
                  background: gameSettings.includeOuterBull ? 'var(--accent)' : 'var(--secondary)',
                  color: gameSettings.includeOuterBull ? 'var(--text)' : 'var(--bg)',
                }}
                className="flex-1 py-3 rounded-lg transition-colors"
              >
                Ja
              </button>
              <button
                onClick={() => handleIncludeOuterBullChange(false)}
                style={{
                  background: !gameSettings.includeOuterBull ? 'var(--accent)' : 'var(--secondary)',
                  color: !gameSettings.includeOuterBull ? 'var(--text)' : 'var(--bg)',
                }}
                className="flex-1 py-3 rounded-lg transition-colors"
              >
                Nej (1-20)
              </button>
            </div>
            
            {gameSettings.includeOuterBull && (
              <div>
                <label className="block mb-2" style={{ color: 'var(--detail)' }}>
                  Typ av bullseye:
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCombinedBullseyeChange(false)}
                    style={{
                      background: !gameSettings.combinedBullseye ? 'var(--accent)' : 'var(--secondary)',
                      color: !gameSettings.combinedBullseye ? 'var(--text)' : 'var(--bg)',
                    }}
                    className="flex-1 py-3 rounded-lg transition-colors"
                  >
                    Separata (21-22)
                  </button>
                  <button
                    onClick={() => handleCombinedBullseyeChange(true)}
                    style={{
                      background: gameSettings.combinedBullseye ? 'var(--accent)' : 'var(--secondary)',
                      color: gameSettings.combinedBullseye ? 'var(--text)' : 'var(--bg)',
                    }}
                    className="flex-1 py-3 rounded-lg transition-colors"
                  >
                    Kombinerad (Y/B)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block mb-2" style={{ color: 'var(--detail)' }}>
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
                className="w-full p-3 border rounded-lg"
                style={{
                  background: 'var(--secondary)',
                  color: 'var(--bg)',
                  borderColor: 'var(--accent)',
                }}
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