export interface RankingResult {
  photoId: string;
  rank: number;
  percentile: number;
  bradleyTerryScore: number;
  confidence: number;
  totalComparisons: number;
  winRate: number;
}

export interface BradleyTerryCalculation {
  items: Set<string>;
  scores: Map<string, number>;
  comparisons: any[]; // Will be typed as Comparison[] when imported
  winCounts: Map<string, Map<string, number>>;
  convergenceTolerance: number;
  maxIterations: number;
}

export interface RankingUpdate {
  photoId: string;
  oldPercentile: number;
  newPercentile: number;
  change: number;
  timestamp: Date;
  reason: 'new_comparison' | 'batch_update' | 'correction';
}

export interface Leaderboard {
  gender: 'male' | 'female';
  region?: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  rank: number;
  photoId: string;
  userId: string;
  percentile: number;
  totalVotes: number;
  winRate: number;
  isAnonymous: boolean;
}

export interface DemographicBreakdown {
  ageGroups: Record<string, number>;
  locations: Record<string, number>;
  timeframes: Record<string, number>;
  sampleSize: number;
}

export interface RankingStatistics {
  totalPhotos: number;
  totalComparisons: number;
  averagePercentile: number;
  standardDeviation: number;
  distributionBuckets: Record<string, number>;
  lastCalculated: Date;
}