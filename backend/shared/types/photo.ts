export interface Photo {
  id: string;
  userId: string;
  url: string;
  thumbnailUrl: string;
  status: PhotoStatus;
  metadata: PhotoMetadata;
  ranking: PhotoRanking;
  rejectionReason?: string;
  uploadedAt: Date;
  moderatedAt?: Date;
}

export type PhotoStatus = 'pending' | 'approved' | 'rejected' | 'processing';

export interface PhotoMetadata {
  originalFilename: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  uploadedFrom: 'mobile' | 'web';
  deviceInfo?: {
    platform: string;
    version: string;
  };
}

export interface PhotoRanking {
  currentPercentile: number;
  totalComparisons: number;
  wins: number;
  losses: number;
  winRate: number;
  bradleyTerryScore: number;
  confidence: number;
  lastUpdated: Date;
  rankingHistory: PercentilePoint[];
}

export interface PercentilePoint {
  date: Date;
  percentile: number;
  comparisons: number;
}

export interface PhotoPair {
  leftPhoto: Photo;
  rightPhoto: Photo;
  sessionId: string;
}

export interface PhotoUpload {
  file: Buffer | File;
  filename: string;
  contentType: string;
  userId: string;
}

export interface ValidationResult {
  isValid: boolean;
  violations: string[];
  confidence: number;
  requiresManualReview: boolean;
}

export interface FaceDetection {
  faceDetected: boolean;
  faceCount: number;
  faceQuality: number;
  estimatedAge?: number;
  confidence: number;
}

export interface ContentFlag {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface ModerationDecision {
  photoId: string;
  decision: 'approve' | 'reject';
  reason?: string;
  moderatorId: string;
  timestamp: Date;
}