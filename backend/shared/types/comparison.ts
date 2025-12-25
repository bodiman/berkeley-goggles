export interface Comparison {
  id: string;
  photoA: string;
  photoB: string;
  winnerId: string;
  loserId: string;
  raterId: string;
  timestamp: Date;
  sessionId: string;
  context: ComparisonContext;
  reliabilityWeight: number;
}

export interface ComparisonContext {
  source: 'mobile' | 'web' | 'desktop_migration';
  deviceInfo?: {
    platform: string;
    version: string;
    userAgent?: string;
  };
  sessionMetadata?: {
    duration: number;
    previousComparisons: number;
    skipCount: number;
  };
}

export interface ComparisonSubmission {
  winnerId: string;
  loserId: string;
  sessionId: string;
  timestamp: Date;
  context?: Partial<ComparisonContext>;
}

export interface DailyStats {
  date: Date;
  comparisonsCompleted: number;
  target: number;
  streak: number;
  accuracy: number;
  timeSpent: number;
}

export interface ComparisonSession {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  comparisonsCompleted: number;
  comparisonsSkipped: number;
  averageResponseTime: number;
  reliability: number;
}

export interface RaterReliability {
  raterId: string;
  overallReliability: number;
  consistencyScore: number;
  outlierCount: number;
  totalComparisons: number;
  lastUpdated: Date;
}