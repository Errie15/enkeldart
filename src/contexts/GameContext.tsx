'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Player, GameSettings, createPlayers, getCheckoutSuggestions } from '../utils/dartGameUtils';

interface GameContextType {
  players: Player[];
  currentPlayerIndex: number;
  gameSettings: GameSettings;
  gameState: 'setup' | 'playing' | 'finished';
  setPlayers: (players: Player[]) => void;
  setPlayerCount: (count: number) => void;
  updatePlayerName: (index: number, name: string) => void;
  startGame: () => void;
  resetGame: () => void;
  setDoubleOut: (doubleOut: boolean) => void;
  addScore: (score: number) => void;
  nextPlayer: () => void;
  currentPlayer: Player | null;
  winner: Player | null;
  getCheckoutOptions: (player: Player) => string[];
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  playerWithStats: Player | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameSettings, setGameSettings] = useState<GameSettings>({ doubleOut: true });
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [winner, setWinner] = useState<Player | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [playerWithStats, setPlayerWithStats] = useState<Player | null>(null);

  // Initialize with default players
  useEffect(() => {
    if (players.length === 0) {
      setPlayers(createPlayers(1));
    }
  }, [players.length]);

  const currentPlayer = players[currentPlayerIndex] || null;

  const setPlayerCount = (count: number) => {
    setPlayers(createPlayers(count));
  };

  const updatePlayerName = (index: number, name: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], name };
    setPlayers(updatedPlayers);
  };

  const startGame = () => {
    setCurrentPlayerIndex(0);
    setGameState('playing');
  };

  const resetGame = () => {
    setPlayers(createPlayers(players.length));
    setCurrentPlayerIndex(0);
    setGameState('setup');
    setWinner(null);
    setShowStats(false);
    setPlayerWithStats(null);
  };

  const setDoubleOut = (doubleOut: boolean) => {
    setGameSettings({ ...gameSettings, doubleOut });
  };

  const addScore = (points: number) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const player = { ...updatedPlayers[currentPlayerIndex] };
  
      const history = [...(player.history || [])];
      const lastRound = history.at(-1);
  
      let newHistory;
      let newScore = player.score - points;
  
      if (newScore < 0) {
        // Bust: registrera inte kastet
        newHistory = [...history]; // ingen ändring
        newScore = player.score; // återställ poängen
      } else {
        if (!lastRound || lastRound.length >= 3) {
          newHistory = [...history, [points]];
        } else {
          const updatedRound = [...lastRound, points];
          newHistory = [...history.slice(0, -1), updatedRound];
        }
      }
  
      player.score = newScore;
      player.history = newHistory;
  
      updatedPlayers[currentPlayerIndex] = player;
      
      // Om spelaren når exakt 0, visa statistik
      if (newScore === 0) {
        setShowStats(true);
        setPlayerWithStats(player);
        setWinner(player);
        setGameState('finished');
      }
      
      return updatedPlayers;
    });
  };
  
  const nextPlayer = () => {
    if (gameState !== 'playing') return;
    
    // Create a deep copy of players array
    const updatedPlayers = players.map(p => ({
      ...p,
      history: p.history ? [...p.history.map(round => [...round])] : []
    }));
    
    // Calculate the next player index
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    
    // Make sure next player has a history array
    if (!updatedPlayers[nextPlayerIndex].history) {
      updatedPlayers[nextPlayerIndex].history = [];
    }
    
    // Add a new empty round for the next player if needed
    if (updatedPlayers[nextPlayerIndex].history.length === 0 || 
        updatedPlayers[nextPlayerIndex].history[updatedPlayers[nextPlayerIndex].history.length - 1].length >= 3) {
      updatedPlayers[nextPlayerIndex].history.push([]);
    }
    
    setPlayers(updatedPlayers);
    
    // Move to next player
    setCurrentPlayerIndex(nextPlayerIndex);
  };

  const getCheckoutOptions = (player: Player): string[] => {
    if (player.score > 170) return [];
    return getCheckoutSuggestions(player.score, gameSettings.doubleOut);
  };

  return (
    <GameContext.Provider
      value={{
        players,
        currentPlayerIndex,
        gameSettings,
        gameState,
        setPlayers,
        setPlayerCount,
        updatePlayerName,
        startGame,
        resetGame,
        setDoubleOut,
        addScore,
        nextPlayer,
        currentPlayer,
        winner,
        getCheckoutOptions,
        showStats,
        setShowStats,
        playerWithStats
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
} 