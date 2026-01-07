export interface League {
  id: string;
  name: string;
  tier: number;
  category: 'cooked' | 'chopped' | 'chuzz' | 'mid' | 'huzz' | 'ultimate';
  minElo: number; // Backend still uses minElo/maxElo for trophy ranges
  maxElo: number; // Backend still uses minElo/maxElo for trophy ranges
  color: string;
  description: string;
}

export interface LeagueProgression {
  currentLeague: League;
  nextLeague?: League;
  previousLeague?: League;
  progressToNext: number; // 0-100 percentage
  eloToNextLeague?: number; // Backend still returns eloToNextLeague for trophy ranges
  eloFromPreviousLeague: number; // Backend still returns eloFromPreviousLeague for trophy ranges
}

export interface LeagueStats {
  league: League;
  playerCount: number;
  averageElo: number; // Backend still returns averageElo for trophy averages
  topPlayer?: {
    userId: string;
    elo: number; // Backend still returns elo for trophy scores
    rank: number;
  };
}