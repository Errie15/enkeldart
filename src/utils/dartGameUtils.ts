/**
 * Utility functions for dart game logic
 */

export type Player = {
  id: number;
  name: string;
  score: number;
  initialScore: number;
  history: number[][];
};

export type GameSettings = {
  doubleOut: boolean;
};

export type PlayerStatistics = {
  totalThrows: number;
  averagePerRound: number;
  averagePerThrow: number;
};

// Calculate player statistics
export const calculatePlayerStatistics = (player: Player): PlayerStatistics => {
  // Count total number of throws
  let totalThrows = 0;
  
  if (player.history) {
    player.history.forEach(round => {
      totalThrows += round.length;
    });
  }
  
  // Calculate scores
  const pointsScored = player.initialScore - player.score;
  const totalRounds = player.history ? player.history.length : 0;
  
  return {
    totalThrows,
    averagePerRound: totalRounds > 0 ? pointsScored / totalRounds : 0,
    averagePerThrow: totalThrows > 0 ? pointsScored / totalThrows : 0
  };
};

// Check if throw would result in a bust
export const isBust = (currentScore: number, throwScore: number, doubleOut: boolean): boolean => {
  const newScore = currentScore - throwScore;
  
  if (newScore < 0) return true;
  if (newScore === 0) {
    if (doubleOut) {
      // For double out, the throw score must be even and ≤ 40 (since max double is D20=40)
      return throwScore > 40 || throwScore % 2 !== 0;
    }
    // For single out, any exact zero is fine
    return false;
  }
  if (doubleOut && newScore === 1) return true; // Can't finish with 1 remaining in double out
  
  return false;
};

// Get checkout suggestions when score is <= 170
export const getCheckoutSuggestions = (score: number, doubleOut: boolean): string[] => {
  if (score > 170) return [];
  
  if (!doubleOut) {
    // Single out is simpler, just return the direct way
    if (score <= 60) return [`${score}`];
    if (score <= 120) return [`T${Math.floor(score / 3)}${score % 3 === 0 ? '' : `, ${score % 3}`}`];
    if (score <= 180) return [`T20, ${getCheckoutSuggestions(score - 60, false)[0]}`];
    return [];
  }
  
  // Common double-out checkouts
  const checkouts: Record<number, string[]> = {
    170: ['T20, T20, Bull'],
    167: ['T20, T19, Bull'],
    164: ['T20, T18, Bull'],
    161: ['T20, T17, Bull'],
    160: ['T20, T20, D20'],
    158: ['T20, T20, D19'],
    157: ['T20, T19, D20'],
    156: ['T20, T20, D18'],
    155: ['T20, T19, D19'],
    154: ['T20, T18, D20'],
    153: ['T20, T19, D18'],
    152: ['T20, T20, D16'],
    151: ['T20, T17, D20'],
    150: ['T20, T18, D18'],
    149: ['T20, T19, D16'],
    148: ['T20, T20, D14'],
    147: ['T20, T17, D18'],
    146: ['T20, T18, D16'],
    145: ['T20, T19, D14'],
    144: ['T20, T20, D12'],
    143: ['T20, T17, D16'],
    142: ['T20, T14, D20'],
    141: ['T20, T19, D12'],
    140: ['T20, T20, D10'],
    139: ['T20, T13, D20'],
    138: ['T20, T18, D12'],
    137: ['T20, T19, D10'],
    136: ['T20, T20, D8'],
    135: ['T20, T17, D12'],
    134: ['T20, T14, D16'],
    133: ['T20, T19, D8'],
    132: ['T20, T16, D12'],
    131: ['T20, T13, D16'],
    130: ['T20, T18, D8'],
    129: ['T19, T16, D12'],
    128: ['T20, T16, D10'],
    127: ['T20, T17, D8'],
    126: ['T19, T19, D6'],
    125: ['T20, T15, D10'],
    124: ['T20, T16, D8'],
    123: ['T19, T16, D9'],
    122: ['T18, T18, D7'],
    121: ['T20, T11, D14'],
    120: ['T20, S20, D20'],
    119: ['T19, T12, D13'],
    118: ['T20, S18, D20'],
    117: ['T19, S20, D20'],
    116: ['T20, S16, D20'],
    115: ['T19, S18, D20'],
    114: ['T20, S14, D20'],
    113: ['T19, S16, D20'],
    112: ['T20, S12, D20'],
    111: ['T19, S14, D20'],
    110: ['T20, S10, D20'],
    109: ['T19, S12, D20'],
    108: ['T20, S8, D20'],
    107: ['T19, S10, D20'],
    106: ['T20, S6, D20'],
    105: ['T19, S8, D20'],
    104: ['T18, S10, D20'],
    103: ['T19, S6, D20'],
    102: ['T20, S10, D16'],
    101: ['T17, S10, D20'],
    100: ['T20, D20'],
    99: ['T19, S10, D16'],
    98: ['T20, D19'],
    97: ['T19, D20'],
    96: ['T20, D18'],
    95: ['T19, D19'],
    94: ['T18, D20'],
    93: ['T19, D18'],
    92: ['T20, D16'],
    91: ['T17, D20'],
    90: ['T18, D18'],
    89: ['T19, D16'],
    88: ['T20, D14'],
    87: ['T17, D18'],
    86: ['T18, D16'],
    85: ['T15, D20'],
    84: ['T20, D12'],
    83: ['T17, D16'],
    82: ['T14, D20'],
    81: ['T19, D12'],
    80: ['T20, D10'],
    79: ['T13, D20'],
    78: ['T18, D12'],
    77: ['T19, D10'],
    76: ['T20, D8'],
    75: ['T17, D12'],
    74: ['T14, D16'],
    73: ['T19, D8'],
    72: ['T16, D12'],
    71: ['T13, D16'],
    70: ['T18, D8'],
    69: ['T19, D6'],
    68: ['T20, D4'],
    67: ['T17, D8'],
    66: ['T10, D18'],
    65: ['T19, D4'],
    64: ['T16, D8'],
    63: ['T13, D12'],
    62: ['T10, D16'],
    61: ['T15, D8'],
    60: ['S20, D20'],
    59: ['S19, D20'],
    58: ['S18, D20'],
    57: ['S17, D20'],
    56: ['T16, D4'],
    55: ['S15, D20'],
    54: ['S14, D20'],
    53: ['S13, D20'],
    52: ['S12, D20'],
    51: ['S11, D20'],
    50: ['S10, D20'],
    49: ['S9, D20'],
    48: ['S8, D20'],
    47: ['S7, D20'],
    46: ['S6, D20'],
    45: ['S5, D20'],
    44: ['S4, D20'],
    43: ['S3, D20'],
    42: ['S10, D16'],
    41: ['S9, D16'],
    40: ['D20'],
    38: ['D19'],
    36: ['D18'],
    34: ['D17'],
    32: ['D16'],
    30: ['D15'],
    28: ['D14'],
    26: ['D13'],
    24: ['D12'],
    22: ['D11'],
    20: ['D10'],
    18: ['D9'],
    16: ['D8'],
    14: ['D7'],
    12: ['D6'],
    10: ['D5'],
    8: ['D4'],
    6: ['D3'],
    4: ['D2'],
    2: ['D1'],
  };
  
  if (checkouts[score]) return checkouts[score];
  
  // For scores not in the predefined list
  if (score <= 40 && score % 2 === 0) return [`D${score/2}`];
  
  // Default logic for other scores
  const suggestions: string[] = [];
  
  if (score <= 60) {
    suggestions.push(`S${score-2}, D1`);
  } else if (score <= 160) {
    const remainder = score % 60;
    const tripleCount = Math.floor(score / 60);
    const suggestion = Array(tripleCount).fill('T20').join(', ');
    
    if (remainder > 0) {
      if (remainder <= 40 && remainder % 2 === 0) {
        suggestions.push(`${suggestion}, D${remainder/2}`);
      } else {
        suggestions.push(`${suggestion}, S${remainder-2}, D1`);
      }
    } else {
      suggestions.push(suggestion);
    }
  }
  
  return suggestions;
};

// Create new players
export const createPlayers = (count: number, initialScore: number = 501): Player[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Spelare ${i + 1}`,
    score: initialScore,
    initialScore,
    history: [],
  }));
}; 