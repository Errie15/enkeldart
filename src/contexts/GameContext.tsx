'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Player, GameSettings, GameMode, createPlayers, getCheckoutSuggestions } from '../utils/dartGameUtils';

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
  setInitialScore: (score: number) => void;
  setGameMode: (mode: GameMode) => void;
  setIncludeOuterBull: (include: boolean) => void;
  setCombinedBullseye: (combined: boolean) => void;
  addScore: (score: number) => void;
  registerHit: (number: number) => void;
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
  const [gameSettings, setGameSettings] = useState<GameSettings>({ 
    doubleOut: true,
    initialScore: 501,
    gameMode: 'standard',
    includeOuterBull: false,
    combinedBullseye: false
  });
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [winner, setWinner] = useState<Player | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [playerWithStats, setPlayerWithStats] = useState<Player | null>(null);

  // Initialize with default players
  useEffect(() => {
    if (players.length === 0) {
      setPlayers(createPlayers(1, gameSettings.initialScore, gameSettings.gameMode));
    }
  }, [players.length, gameSettings.initialScore, gameSettings.gameMode]);

  const currentPlayer = players[currentPlayerIndex] || null;

  const setPlayerCount = (count: number) => {
    setPlayers(createPlayers(count, gameSettings.initialScore, gameSettings.gameMode));
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
    setPlayers(createPlayers(players.length, gameSettings.initialScore, gameSettings.gameMode));
    setCurrentPlayerIndex(0);
    setGameState('setup');
    setWinner(null);
    setShowStats(false);
    setPlayerWithStats(null);
  };

  const setDoubleOut = (doubleOut: boolean) => {
    setGameSettings({ ...gameSettings, doubleOut });
  };

  const setInitialScore = (initialScore: number) => {
    setGameSettings({ ...gameSettings, initialScore });
    // När vi ändrar initialScore behöver vi uppdatera alla spelare
    if (gameSettings.gameMode === 'standard') {
      setPlayers(createPlayers(players.length, initialScore, gameSettings.gameMode));
    }
  };

  const setGameMode = (gameMode: GameMode) => {
    setGameSettings({ ...gameSettings, gameMode });
    // När vi ändrar spelläge behöver vi uppdatera alla spelare
    setPlayers(createPlayers(players.length, gameSettings.initialScore, gameMode));
  };

  const setIncludeOuterBull = (includeOuterBull: boolean) => {
    setGameSettings({ ...gameSettings, includeOuterBull });
  };

  const setCombinedBullseye = (combined: boolean) => {
    setGameSettings({ ...gameSettings, combinedBullseye: combined });
  };

  const addScore = (points: number) => {
    // Används bara för standardspelläge
    if (gameSettings.gameMode !== 'standard') return;

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

  const registerHit = (number: number) => {
    // Används bara för Around the Clock
    if (gameSettings.gameMode !== 'aroundTheClock') return;

    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const player = { ...updatedPlayers[currentPlayerIndex] };
      
      // Lägg till i spelarens historik för att hålla koll på alla kast
      const history = [...(player.history || [])];
      const lastRound = history.at(-1);
      
      let newHistory;
      if (!lastRound || lastRound.length >= 3) {
        newHistory = [...history, [number]];
      } else {
        const updatedRound = [...lastRound, number];
        newHistory = [...history.slice(0, -1), updatedRound];
      }
      
      player.history = newHistory;
      
      // Om spelaren träffade sitt mål, uppdatera currentTarget och hitsInOrder
      if (number === player.currentTarget) {
        const hitsInOrder = [...(player.hitsInOrder || []), number];
        player.hitsInOrder = hitsInOrder;
        
        // Bestäm nästa mål
        const nextTarget = player.currentTarget + 1;
        
        // Kontrollera om spelaren vunnit
        let hasWon = false;
        
        if (gameSettings.includeOuterBull) {
          // Om vi inkluderar bullseye
          if (gameSettings.combinedBullseye) {
            // Med kombinerad bullseye går vi bara till 21
            if (nextTarget > 21) {
              hasWon = true;
            }
          } else {
            // Med separata bullseye går vi till 22
            if (nextTarget > 22) {
              hasWon = true;
            }
          }
        } else {
          if (nextTarget > 20) {
            hasWon = true;
          }
        }
        
        if (hasWon) {
          setWinner(player);
          setPlayerWithStats(player);
          setShowStats(true);
          setGameState('finished');
        } else {
          player.currentTarget = nextTarget;
        }
      }
      
      updatedPlayers[currentPlayerIndex] = player;
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
    if (gameSettings.gameMode !== 'standard' || player.score > 170) return [];
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
        setInitialScore,
        setGameMode,
        setIncludeOuterBull,
        setCombinedBullseye,
        addScore,
        registerHit,
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